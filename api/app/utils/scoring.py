from datetime import datetime


STRONG = {
    "immediately",
    "urgent",
    "asap",
    "critical",
    "down",
    "outage",
    "cannot access",
    "security",
    "breach",
    "payment failed",
    "escalate",
}
WEAK = {"follow up", "not working", "issue", "help needed", "stuck", "error", "problem"}


def urgency_features(text: str):
    t = (text or "").lower()
    strong = sum(1 for k in STRONG if k in t)
    weak = sum(1 for k in WEAK if k in t)
    return strong, weak


def priority_score(sentiment: str, received_at, sla_minutes=60, now=None, strong=0, weak=0):
    now = now or datetime.utcnow()
    mins = (now - received_at).total_seconds() / 60
    sla_risk = min(1.0, max(0.0, mins / sla_minutes))
    u = min(1.0, strong * 0.5 + weak * 0.2)
    neg = 1.0 if sentiment == "negative" else 0.5 if sentiment == "neutral" else 0.0
    score = 0.5 * u + 0.3 * neg + 0.2 * sla_risk
    return score


def priority_label(score: float):
    return "Urgent" if score >= 0.6 else "Not urgent"

