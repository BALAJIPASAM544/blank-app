from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from ..db import get_session
from ..models import Email, ReplyDraft


router = APIRouter()


@router.get("/24h")
def stats_24h(session: Session = Depends(get_session)):
    since = datetime.utcnow() - timedelta(hours=24)
    emails = session.exec(select(Email).where(Email.received_at >= since)).all()
    total = len(emails)
    support = sum(1 for e in emails if e.is_filtered_support)
    drafts = session.exec(select(ReplyDraft)).all()
    resolved = sum(1 for d in drafts if d.status == "sent")
    pending = total - resolved
    return {
        "total_emails": total,
        "support_filtered": support,
        "urgent_count": 0,  # placeholder
        "resolved_count": resolved,
        "pending_count": pending,
        "sentiment_breakdown": {},
    }

