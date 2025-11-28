import openai
from django.conf import settings
import base64

# Set your OpenAI key in .env → OPENAI_API_KEY=sk-...
openai.api_key = settings.OPENAI_API_KEY

def moderate_text(text: str):
    try:
        response = openai.Moderation.create(input=text)
        result = response["results"][0]
        flagged = result["flagged"]
        categories = result["categories"]
        scores = result["category_scores"]

        labels = [cat for cat, flagged in categories.items() if flagged]
        score = max(scores.values()) if scores else 0.0

        return {
            "flagged": flagged,
            "score": round(score, 4),
            "labels": labels,
            "result": "blocked" if flagged else "safe"
        }
    except Exception as e:
        return {"flagged": True, "score": 1.0, "labels": ["error"], "result": "blocked", "error": str(e)}