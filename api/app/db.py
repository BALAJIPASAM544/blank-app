import os
from typing import Generator

from sqlmodel import SQLModel, Session, create_engine


DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data.db")

# For SQLite, check_same_thread must be False for use with FastAPI
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)


def init_db() -> None:
    """Create all tables if they do not exist."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

