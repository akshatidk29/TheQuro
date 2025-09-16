import io
import os
import fitz
import time
import threading
from PIL import Image
from typing import List, Dict, Tuple
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, Form, HTTPException

from pydantic import BaseModel
from langchain_qdrant import Qdrant 
from qdrant_client import QdrantClient
from langchain_huggingface import HuggingFaceEmbeddings
from qdrant_client.http.models import Filter, FieldCondition, MatchValue, PointIdsList, Distance, VectorParams

from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed





# --------------------- Config ---------------------
load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")
vector_size = 384






# --------------------- Embedding + Vector Store ---------------------
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)




if not qdrant_client.collection_exists(COLLECTION_NAME):
    qdrant_client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
        optimizers_config={"default_segment_number": 1},
        hnsw_config={"on_disk": False},
    )

    print(f"Created collection: {COLLECTION_NAME}")


    try:
        for field in ["metadata.userEmail", "metadata.course", "metadata.topic"]:
            try:
                qdrant_client.create_payload_index(
                    collection_name=COLLECTION_NAME,
                    field_name=field,
                    field_schema="keyword"
                )
                print(f"Created index for field: {field}")
            except Exception as e:
                print(f"Index for {field} might already exist or error occurred: {e}")
    except Exception as e:
        print(f"Error creating indexes: {e}")




vectorstore = Qdrant(
    client=qdrant_client,
    collection_name=COLLECTION_NAME,
    embeddings=embedding_model,
)





# --------------------- Store Text in Qdrant ---------------------
def store_in_qdrant(text: str, metadata: dict):
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_text(text)
    docs = [Document(page_content=chunk, metadata=metadata) for chunk in chunks]
    vectorstore.add_documents(docs)



def delete_vectors_by_metadata(userEmail: str, course: str, topic: str):
    vectorstore.client.delete(
        collection_name=COLLECTION_NAME,
        points_selector=Filter(
            must=[
                FieldCondition(key="metadata.userEmail", match=MatchValue(value=userEmail)),
                FieldCondition(key="metadata.course", match=MatchValue(value=course)),
                FieldCondition(key="metadata.topic", match=MatchValue(value=topic)),
            ]
        )
    )



def update_in_qdrant(old_metadata: dict, new_text: str, new_metadata: dict):
    # Delete old document
    vectorstore.client.delete(
        collection_name=COLLECTION_NAME,
        points_selector=Filter(
            must=[
                FieldCondition(key="metadata.userEmail", match=MatchValue(value=old_metadata["userEmail"])),
                FieldCondition(key="metadata.course", match=MatchValue(value=old_metadata["course"])),
                FieldCondition(key="metadata.topic", match=MatchValue(value=old_metadata["topic"])),
            ]
        )
    )
    # Add new document
    store_in_qdrant(new_text, new_metadata)



def get_relevant_chunks(current_question: str, userEmail: str, course: str):
    try:
        print(f"Running similarity_search with: email={userEmail}, course={course}, query='{current_question}'")

        try:
            search_filter = Filter(
            must=[
                FieldCondition(
                    key="metadata.userEmail",
                    match=MatchValue(value=userEmail)
                ),
                FieldCondition(
                    key="metadata.course", 
                    match=MatchValue(value=course)
                )
            ]
        )
            user_docs = vectorstore.similarity_search(
                query=current_question,
                k=5,
                filter=search_filter
            )

            print(f"Found {len(user_docs)} chunks using langchain method")

            return [
                {
                    "userEmail": doc.metadata.get("userEmail"),
                    "course": doc.metadata.get("course"),
                    "topic": doc.metadata.get("topic"),
                    "content": doc.page_content,
                }
                for doc in user_docs
            ]
            
            
        except Exception as langchain_error:
            print(f"Langchain method also failed: {langchain_error}")
            
            # Method 3: Search without filter as last resort
            print("Attempting search without filter...")
            all_docs = vectorstore.similarity_search(
                query=current_question,
                k=20  # Get more results to filter manually
            )
            
            # Filter manually
            filtered_docs = [
                doc for doc in all_docs 
                if doc.metadata.get("userEmail") == userEmail and 
                    doc.metadata.get("course") == course
            ][:5]  # Limit to 5 results
            
            print(f"Found {len(filtered_docs)} chunks after manual filtering")
            
            return [
                {
                    "userEmail": doc.metadata.get("userEmail"),
                    "course": doc.metadata.get("course"),
                    "topic": doc.metadata.get("topic"),
                    "content": doc.page_content,
                }
                for doc in filtered_docs
            ]

    except Exception as e:
        print("Qdrant error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))











# --------------------- FastAPI App ---------------------

base_url = os.getenv("IPV4_URL")
frontend_url = f"{base_url}:5173"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)









# --------------------- Gemini Model ---------------------
# --------------------- Gemini Model ---------------------

NUM_KEYS = int(os.getenv("NUM_KEYS", "1"))
API_KEYS = [
    os.getenv(f"GEMINI_API_KEY_{i+1}")
    for i in range(NUM_KEYS)
    if os.getenv(f"GEMINI_API_KEY_{i+1}")
]
MODEL_ID = "gemini-2.0-flash"

GENAI_MODELS = [{"key": key, "index": i} for i, key in enumerate(API_KEYS)]
print(f"Configured {len(GENAI_MODELS)} API keys for load balancing")

# ----- NEW: Per-key request timing tracking -----
last_request_time = defaultdict(lambda: 0)
lock = threading.Lock()
MIN_DELAY = 4  # 15 req/min -> at least 4s between requests per key


def process_page(api_key: str, idx: int, img: Image.Image, prompt: str) -> Tuple[int, str]:
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(MODEL_ID)
        response = model.generate_content([img, prompt])
        text = response.text.strip()
        return idx, f"--- Page {idx + 1} ---\n{text}" if text else f"--- Page {idx + 1} ---\n[No Text Found]"
    except Exception as e:
        return idx, f"--- Page {idx + 1} ---\nError: {str(e)}"


def throttled_process_page(api_key: str, idx: int, img: Image.Image, prompt: str):
    # Ensure per-key delay so we stay under quota
    with lock:
        now = time.time()
        elapsed = now - last_request_time[api_key]
        if elapsed < MIN_DELAY:
            wait_time = MIN_DELAY - elapsed
            print(f"[Key {api_key[:6]}...] Waiting {wait_time:.2f}s before sending request...")
            time.sleep(wait_time)
        last_request_time[api_key] = time.time()
    return process_page(api_key, idx, img, prompt)


def extract_text_parallel(images: List[Image.Image], description: str, course: str, topic: str) -> str:
    prompt = enrich_prompt(description, course, topic)
    results = [None] * len(images)

    with ThreadPoolExecutor(max_workers=min(len(images), len(API_KEYS))) as executor:
        futures = []
        for idx, img in enumerate(images):
            api_key = API_KEYS[idx % len(API_KEYS)]
            futures.append(executor.submit(throttled_process_page, api_key, idx, img, prompt))
            print(f"Page {idx + 1} assigned to API key {(idx % len(API_KEYS)) + 1}")

        for future in as_completed(futures):
            idx, result = future.result()
            results[idx] = result

    return "\n\n".join(results)


# Round-robin LLM access for other tasks
LLM_MODELS = [ChatGoogleGenerativeAI(model=MODEL_ID, google_api_key=key) for key in API_KEYS]
_index = 0

def get_next_llm():
    global _index
    model = LLM_MODELS[_index]
    _index = (_index + 1) % len(LLM_MODELS)
    return model




















# --------------------- Utility Functions ---------------------
def enrich_prompt(description: str, course: str, topic: str) -> str:
    return (
        f"You are a highly accurate OCR and summarization assistant. The content you will process is part of a file with the following context:\n"
        f"- Description: \"{description}\"\n"
        f"- Course: \"{course}\"\n"
        f"- Topic: \"{topic}\"\n\n"
        "Your job is to extract all clearly visible typed or handwritten text from the given page. "
        "If the page contains embedded images, summarize the content or information conveyed by those images as well. "
        "This page may be part of a scanned or unclear PDF—handle imperfections intelligently. "
        "Do not hallucinate or assume missing content. Preserve structure, formatting, and meaning as faithfully as possible. "
        "If any of the provided metadata (description, course, or topic) appears irrelevant, placeholder-like, or nonsensical (e.g., gibberish, lorem ipsum, etc.), please ignore it entirely and focus only on what is genuinely present in the image."
        "Do not add any extra lines like 'Here is the Summarized Text', IF you understand what is written you can even short form it a little bit"
    )



def pdfToImage(file_bytes):
    images = []
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    for page in doc:
        pix = page.get_pixmap(dpi=300)
        image = Image.open(io.BytesIO(pix.tobytes("png")))
        images.append(image)
    return images

def findpages(file_bytes):
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    return len(doc)

# def process_page(model, idx: int, img: Image.Image, prompt: str) -> Tuple[int, str]:
#     try:
#         response = model.generate_content([img, prompt])
#         text = response.text.strip()
#         return idx, f"--- Page {idx + 1} ---\n{text}" if text else f"--- Page {idx + 1} ---\n[No Text Found]"
#     except Exception as e:
#         return idx, f"--- Page {idx + 1} ---\nError: {str(e)}"


# def extract_text_parallel(images: List[Image.Image], description: str, course: str, topic: str) -> str:
#     prompt = enrich_prompt(description, course, topic)
#     results = [None] * len(images)

#     with ThreadPoolExecutor(max_workers=min(len(images), 20)) as executor:
#         futures = []
#         for idx, img in enumerate(images):
#             model = GENAI_MODELS[idx % NUM_KEYS]["model"]
#             futures.append(executor.submit(process_page, model, idx, img, prompt))

#         for future in as_completed(futures):
#             idx, result = future.result()
#             results[idx] = result

#     return "\n\n".join(results)





# --------------------- OCR Endpoints ---------------------
@app.post("/extract/image")
async def extract_from_image(
    file: UploadFile = File(...),
    name: str = Form(...),
    date: str = Form(...),
    time: str = Form(...),
    course: str = Form(...),
    topic: str = Form(...),
    description: str = Form(...),
    userEmail: str = Form(...),
):
    try:
        image = Image.open(io.BytesIO(await file.read()))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    extracted_text = extract_text_parallel([image], description, course, topic)

    store_in_qdrant(extracted_text, {
        "userEmail": userEmail,
        "name": name,
        "course": course,
        "topic": topic,
        "description": description,
        "file_type": "image",
        "date": date,
        "time": time,
    })

    return {
        "status": "success",
        "metadata": {
            "name": name,
            "date": date,
            "time": time,
            "course": course,
            "topic": topic,
            "description": description,
            "file_type": "image"
        },
        "text": extracted_text
    }


@app.post("/calculatePages/pdf")
async def calculatePages(
    file: UploadFile = File(...)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Uploaded file is not a PDF")

    try:
        pdf_bytes = await file.read()
        pages = findpages(pdf_bytes)
    except Exception:
        raise HTTPException(status_code=400, detail="Could not process PDF")

    return {
        "status": "success",
        "pages": pages
    }


@app.post("/extract/pdf")
async def extract_from_pdf(
    file: UploadFile = File(...),
    name: str = Form(...),
    date: str = Form(...),
    time: str = Form(...),
    course: str = Form(...),
    topic: str = Form(...),
    description: str = Form(...),
    userEmail: str = Form(...),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Uploaded file is not a PDF")

    try:
        pdf_bytes = await file.read()
        images = pdfToImage(pdf_bytes)
    except Exception:
        raise HTTPException(status_code=400, detail="Could not process PDF")

    extracted_text = extract_text_parallel(images, description, course, topic)

    store_in_qdrant(extracted_text, {
        "userEmail": userEmail,
        "name": name,
        "course": course,
        "topic": topic,
        "description": description,
        "file_type": "pdf",
        "date": date,
        "time": time,
    })

    return {
        "status": "success",
        "metadata": {
            "name": name,
            "date": date,
            "time": time,
            "course": course,
            "topic": topic,
            "description": description,
            "file_type": "pdf",
            "total_pages": len(images)
        },
        "text": extracted_text
    }













# --------------------- RAG Endpoint ---------------------

class VectorUpdateRequest(BaseModel):
    old_course: str
    old_topic: str
    userEmail: str
    new_course: str
    new_topic: str
    new_description: str
    new_text: str  # Updated or re-OCR'd text if applicable
    name: str
    date: str
    time: str
    file_type: str  # "pdf" or "image"

class DeleteQuery(BaseModel):
    userEmail: str
    course: str
    topic: str

class ChatOnlyRequest(BaseModel):
    context: str
    question: str
    chat_history: List[Dict[str, str]]  # [{'question': ..., 'answer': ...}, ...]

class ChatQuery(BaseModel):
    currentQuestion: str
    userEmail: str
    course: str




















@app.post("/rag/chat")
async def chat_only(payload: ChatOnlyRequest):
    try:
        # Format chat history
        chat_history_str = "\n".join(
            [f"User: {item['question']}\nAssistant: {item['answer']}" for item in payload.chat_history]
        )

        # Build the prompt
        prompt = f"""You are a helpful and intelligent assistant. Use the provided context to answer the user’s query accurately and concisely. If the context is irrelevant, insufficient, or missing, rely on your own knowledge to generate the best possible answer.
        Avoid mentioning the existence of context or phrases like "Based on the context" or "Here's your answer." Focus solely on providing a clear, direct, and informative response.

Chat History:
{chat_history_str}

Relevant Context:
{payload.context}

User Question:
{payload.question}

Answer:"""

        llm = get_next_llm()
        response = llm.invoke(prompt)
        return {"answer": response.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/getChunks")
async def chunk_endpoint(payload: ChatQuery):
    return get_relevant_chunks(
        current_question=payload.currentQuestion,
        userEmail=payload.userEmail,
        course=payload.course
    )

@app.post("/rag/delete")
async def delete_vectors(payload: DeleteQuery):
    try:
        delete_vectors_by_metadata(payload.userEmail, payload.course, payload.topic)
        return {"status": "success", "message": "Vectors deleted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/rag/update")
async def update_vector(payload: VectorUpdateRequest):
    try:
        old_metadata = {
            "userEmail": payload.userEmail,
            "course": payload.old_course,
            "topic": payload.old_topic
        }

        new_metadata = {
            "userEmail": payload.userEmail,
            "name": payload.name,
            "course": payload.new_course,
            "topic": payload.new_topic,
            "description": payload.new_description,
            "date": payload.date,
            "time": payload.time,
            "file_type": payload.file_type,
        }

        update_in_qdrant(old_metadata, payload.new_text, new_metadata)

        return {"status": "success", "message": "Vector updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))













# --------------------- Utility Endpoint to Check/Create Indexes ---------------------
@app.post("/admin/create-indexes")
async def create_indexes():
    """Utility endpoint to create indexes if they don't exist"""
    try:
        for field in ["userEmail", "course", "topic"]:
            try:
                qdrant_client.create_payload_index(
                    collection_name=COLLECTION_NAME,
                    field_name=field,
                    field_schema="keyword"
                )
                print(f"Created index for field: {field}")
            except Exception as e:
                print(f"Index for {field} might already exist: {e}")
        
        return {"status": "success", "message": "Indexes created/verified"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/collection-info")
async def get_collection_info():
    """Get information about the collection"""
    try:
        collection_info = qdrant_client.get_collection(COLLECTION_NAME)
        return {"collection_info": collection_info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))