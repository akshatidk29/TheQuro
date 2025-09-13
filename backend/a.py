import google.generativeai as genai

def test_gemini_api_key(api_key: str) -> bool:
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content("Say Hello")
        print(f"✅ Key works: {api_key[:6]}... → Response: {response.text.strip()}")
        return True
    except Exception as e:
        print(f"❌ Key failed: {api_key[:6]}... → Error: {e}")
        return False

# Example usage
test_gemini_api_key('AIzaSyD9cnSt9hFXr_f6v8gwAnb3RgiV9rjnWsQ')
