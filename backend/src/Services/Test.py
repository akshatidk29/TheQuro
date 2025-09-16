import google.generativeai as genai

GEMINI_API_KEY_1='AIzaSyAK4MDY_-dme83K9ez6rmBqr3jIJA7EdJY'
GEMINI_API_KEY_2='AIzaSyAmF6RiZ9E_yc_PWGGU2UFNnVxm4r3De6U'
GEMINI_API_KEY_3='AIzaSyD9cnSt9hFXr_f6v8gwAnb3RgiV9rjnWsQ'
GEMINI_API_KEY_4='AIzaSyA_SurSZEUywxp6wx60yJG7fLKk23aqu6s'
GEMINI_API_KEY_5='AIzaSyBEIG5XUEMRJWdo888EzeSxkHLzxlQ1Afg'
GEMINI_API_KEY_6='AIzaSyALRb5-zdNU4cJN3DzqNgDAqX1S64wSc00'
GEMINI_API_KEY_7='AIzaSyA_Zla12LZHth-y-rCoTTLDOHVCgLrgXSo'
GEMINI_API_KEY_8='AIzaSyDuNLEeisVJ0-3AdZ7Xq4OXFq8-5J9yndM'

def test_gemini_api_key(api_key: str) -> bool:
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content("Say Hello")
        print(f"✅ Key works: {api_key[:6]}... → Response: {response.text.strip()}")
        return True
    except Exception as e:
        print(f"❌ Key failed: {api_key[:6]}... → Error: {e}")
        return False

# Example usage
test_gemini_api_key(GEMINI_API_KEY_1)
