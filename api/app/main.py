import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import init_db
from .routers import emails, ingest, kb, stats


def create_app() -> FastAPI:
    app = FastAPI(title="Support Assistant API", version="0.1.0")

    frontend_origin = os.getenv("FRONTEND_ORIGIN", "*")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[frontend_origin] if frontend_origin != "*" else ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(ingest.router, prefix="/ingest", tags=["ingest"]) 
    app.include_router(emails.router, prefix="/emails", tags=["emails"]) 
    app.include_router(kb.router, prefix="/kb", tags=["kb"]) 
    app.include_router(stats.router, prefix="/stats", tags=["stats"]) 

    @app.on_event("startup")
    def _on_startup() -> None:
        init_db()

    return app


app = create_app()

