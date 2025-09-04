from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from ..db import get_session
from ..models import Email, Extraction, ReplyDraft


router = APIRouter()


@router.get("")
def list_emails(
    support: Optional[bool] = Query(None),
    sentiment: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    session: Session = Depends(get_session),
):
    stmt = select(Email).order_by(Email.received_at.desc())
    rows = session.exec(stmt).all()
    # naive filters for stub
    results = []
    for e in rows:
        if support is not None and e.is_filtered_support != support:
            continue
        if q and q.lower() not in (e.subject.lower() + " " + e.body_text.lower()):
            continue
        results.append(e)
    total = len(results)
    start = (page - 1) * page_size
    end = start + page_size
    return {"total": total, "items": results[start:end]}


@router.get("/{email_id}")
def get_email(email_id: str, session: Session = Depends(get_session)):
    email = session.get(Email, email_id)
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    extraction = session.get(Extraction, email_id)
    draft = session.get(ReplyDraft, email_id)
    return {"email": email, "extraction": extraction, "draft": draft}


@router.post("/{email_id}/draft")
def regenerate_draft(email_id: str, session: Session = Depends(get_session)):
    email = session.get(Email, email_id)
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    # Minimal stub: just echo a template
    draft = ReplyDraft(
        email_id=email_id,
        summary=f"Summary for: {email.subject}",
        rag_chunks=[],
        draft_body=(
            f"Hi,\n\nThanks for reaching out about '{email.subject}'. "
            "We are looking into this and will get back shortly.\n\nBest,\nAcme Support"
        ),
        tone="empathetic, professional",
        status="draft",
    )
    session.merge(draft)
    session.commit()
    return draft


@router.post("/{email_id}/send")
def send_email(email_id: str, session: Session = Depends(get_session)):
    draft = session.get(ReplyDraft, email_id)
    if not draft:
        raise HTTPException(status_code=400, detail="No draft to send")
    draft.status = "sent"
    from datetime import datetime

    draft.sent_at = datetime.utcnow()
    session.add(draft)
    session.commit()
    return {"status": "sent", "sent_at": draft.sent_at}

