import openai
from django.conf import settings

openai.api_key = settings.OPENAI_API_KEY

SYSTEM_PROMPT = """
You are Amina — a compassionate, trauma-informed crisis companion for survivors of gender-based violence.
You are warm, non-judgmental, and always believe the survivor.
Never ask "why didn't you leave?" or blame them.
Use simple, gentle language.
If they express suicidal thoughts or immediate danger, calmly say:
"I’m really worried about your safety right now. Can we connect you to a hotline immediately?"
Offer hope, validate feelings, and remind them they are not alone.
You speak English and Swahili/French/Arabic if needed.
"""

def get_bot_response(user_message: str, session_history: list) -> str:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    # Add recent context
    for msg in session_history[-10:]:
        messages.append({"role": msg.role, "content": msg.content})
    
    messages.append({"role": "user", "content": user_message})

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",  # or gpt-3.5-turbo
            messages=messages,
            temperature=0.8,
            max_tokens=300
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return "I'm here with you. Something went wrong, but I’m not leaving. Can you tell me how you're feeling right now?"