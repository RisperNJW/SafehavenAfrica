from .models import RiskFactor

def calculate_risk_from_answers(answers: dict) -> dict:
    """
    answers = { "q1": True, "q2": False, ... }
    Returns: { "score": 78, "level": "critical", "triggers": [...] }
    """
    factors = RiskFactor.objects.all()
    score = 0
    triggers = []

    # Pre-defined high-risk questions (you can expand)
    critical_triggers = {
        "Has the perpetrator threatened to kill you or someone you love?": 50,
        "Do you fear for your life right now?": 60,
        "Has the perpetrator used or threatened with a weapon?": 55,
        "Are you being prevented from leaving the house?": 45,
    }

    for factor in factors:
        answer = answers.get(str(factor.id))
        if answer is True:
            score += factor.weight
            if factor.question in critical_triggers:
                triggers.append(factor.question)

    # Final risk level
    if score >= 70 or any(t in " ".join(triggers) for t in ["kill", "weapon", "life"]):
        level = "critical"
    elif score >= 45:
        level = "high"
    elif score >= 25:
        level = "medium"
    else:
        level = "low"

    return {
        "score": score,
        "level": level,
        "triggers": triggers,
        "needs_escalation": level in ["high", "critical"]
    }