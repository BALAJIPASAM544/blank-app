from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select

from ..db import get_session
from ..models import Email


router = APIRouter()


@router.post("/run")
def run_ingest(
    provider: str = Query("dev", description="gmail|imap|graph|dev"),
    hours: int = Query(24, ge=1, le=168),
    session: Session = Depends(get_session),
):
    """Dev stub: seed a few example emails if provider==dev."""
    if provider != "dev":
        return {"status": "queued", "provider": provider, "hours": hours}

    now = datetime.utcnow()
    seeds = [
        {
            "provider_id": f"dev-{now.timestamp()}-1",
            "sender_email": "jane@example.com",
            "subject": "Support: Cannot access my account",
            "body_text": "Hi team, I cannot access my account since yesterday. It's urgent.",
            "received_at": now - timedelta(minutes=30),
            "labels": ["inbox"],
            "is_filtered_support": True,
        },
        {
            "provider_id": f"dev-{now.timestamp()}-2",
            "sender_email": "billing@acme-corp.com",
            "subject": "Request: Refund for last invoice",
            "body_text": "Please help with a refund for invoice #12345. Thanks!",
            "received_at": now - timedelta(hours=2),
            "labels": ["inbox"],
            "is_filtered_support": True,
        },
    ]

    added = 0
    for s in seeds:
        exists = session.exec(
            select(Email).where(Email.provider_id == s["provider_id"]) 
        ).first()
        if exists:
            continue
        email = Email(**s)
        session.add(email)
        added += 1
    session.commit()
    return {"status": "ok", "seeded": added}

