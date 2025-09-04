import os
from typing import List

from fastapi import APIRouter, UploadFile, File, Form

# Minimal in-memory store placeholder; will wire to Chroma later
KB_DIR = os.getenv("KB_DIR", "/workspace/kb_uploads")
os.makedirs(KB_DIR, exist_ok=True)

router = APIRouter()


@router.post("/upload")
async def upload_kb(files: List[UploadFile] = File(...)):
    saved = []
    for f in files:
        dest = os.path.join(KB_DIR, f.filename)
        with open(dest, "wb") as out:
            out.write(await f.read())
        saved.append({"filename": f.filename})
    return {"saved": saved}


@router.get("/search")
def search_kb(q: str):
    # Stub: keyword match over filenames only
    matches = []
    for name in os.listdir(KB_DIR):
        if q.lower() in name.lower():
            matches.append({"title": name, "score": 0.1})
    return {"matches": matches}

