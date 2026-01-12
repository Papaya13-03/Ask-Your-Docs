from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://ask-your-docs-production-55de.up.railway.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

from app.api.v1.router import router as api_router
app.include_router(api_router, prefix="/api/v1")
