import os
import json
from rq import Queue
from redis import Redis


def get_queue() -> Queue:
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    conn = Redis.from_url(redis_url)
    return Queue("emails", connection=conn)


def process_email(email_id: str):
    # Placeholder for background processing pipeline
    print(json.dumps({"event": "process_email", "email_id": email_id}))

