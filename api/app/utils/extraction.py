import re
from typing import List, Tuple


EMAIL_RE = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
PHONE_RE = re.compile(r"\+?\d[\d\s().-]{7,}\d")


def extract_contacts(text: str) -> Tuple[List[str], List[str]]:
    emails = sorted(set(EMAIL_RE.findall(text or "")))
    phones = sorted(set(PHONE_RE.findall(text or "")))
    return emails, phones

