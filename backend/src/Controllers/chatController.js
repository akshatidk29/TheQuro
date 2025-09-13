import axios from "axios";
import ExtractedFile from "../Models/ExtractedFile.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

  
export const ragQuery = async (req, res) => {
    try {
        const { currentQuestion, history, course } = req.body;
        const userEmail = req.user?.email;

        let chunks = [];
        try {
            const chunkRes = await axios.post(`${process.env.IPV4_URL}:8001/getChunks`, {
                currentQuestion,
                userEmail,
                course
            });
            chunks = chunkRes.data || [];
        } catch (err) {
            console.warn("Chunk retrieval failed, continuing without it:", err.message);
        }

        let context = "";
        if (chunks.length > 0) {
            const uniquePairs = [
                ...new Map(
                    chunks.map(item => [`${item.course}|${item.topic}`, item])
                ).values()
            ];

            const orConditions = uniquePairs.map(({ course, topic }) => ({
                userEmail,
                course,
                topic,
            }));

            const docs = await ExtractedFile.find({ $or: orConditions });
            context = docs.map(doc => doc.extractedText).join("\n\n");
        }

        const finalRes = await axios.post(`${process.env.IPV4_URL}:8001/rag/chat`, {
            context,
            chat_history: history,
            question: currentQuestion,
        });

        return res.status(200).json({
            success: true,
            answer: finalRes.data.answer,
        });

    } catch (error) {
        console.error("Chat API error:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.response?.data || error.message,
        });
    }
};




const NUM_KEYS = parseInt(process.env.NUM_KEYS || "1");

const apiKeys = Array.from({ length: NUM_KEYS }, (_, i) =>
  process.env[`GEMINI_API_KEY_${i + 1}`]
).filter(Boolean);

const models = apiKeys.map((key) => {
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
});

let currentIndex = 0;

export function getNextModel() {
  const model = models[currentIndex];
  currentIndex = (currentIndex + 1) % models.length;
  return model;
}




export const Query = async (req, res) => {
    try {
        const { userEmail, currentQuestion, history = [] } = req.body;

        const model = getNextModel();

        // Construct a prompt using previous messages
        const prompt = `
You are a helpful AI Assistant. Use the following recent Q&A history to stay in context and give informative, direct, and friendly responses.

${history.map((pair, i) => `Q${i + 1}: ${pair.question}\nA${i + 1}: ${pair.answer}`).join('\n')}

User: ${currentQuestion}
AI:
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const answer = response.text();

        return res.status(200).json({ answer });
    } catch (error) {
        console.error("Gemini General Chat Error:", error);
        return res.status(500).json({ message: "Failed to generate response." });
    }
};
