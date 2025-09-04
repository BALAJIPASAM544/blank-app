from __future__ import annotations

from typing import Optional, List, Dict
from datetime import datetime
import uuid

from sqlmodel import SQLModel, Field, JSON, Column


class Email(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    provider_id: str
    sender_email: str
    subject: str
    body_text: str
    body_html: Optional[str] = None
    received_at: datetime
    labels: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    is_filtered_support: bool = False


class Extraction(SQLModel, table=True):
    email_id: str = Field(primary_key=True, foreign_key="email.id")
    phones: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    alternate_emails: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    customer_requirements: Optional[Dict] = Field(default=None, sa_column=Column(JSON))
    sentiment: Optional[str] = None
    priority: Optional[str] = None
    priority_score: Optional[float] = 0.0
    keywords_matched: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))


class ReplyDraft(SQLModel, table=True):
    email_id: str = Field(primary_key=True, foreign_key="email.id")
    summary: Optional[str] = None
    rag_chunks: Optional[List[Dict]] = Field(default=None, sa_column=Column(JSON))
    draft_body: Optional[str] = None
    tone: Optional[str] = None
    status: str = "draft"
    sent_at: Optional[datetime] = None

