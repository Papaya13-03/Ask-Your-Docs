import shutil
import os
import uuid
from fastapi import UploadFile
from .embedding import EmbeddingService
from pathlib import Path
from PyPDF2 import PdfReader
from .vector_database import VectorDatabase
from .chunking import chunk_document
import json
import pdfplumber

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

vector_db = VectorDatabase()

async def save_document(file: UploadFile, openai_api_key: str) -> dict:
    # 1. Save file to disk
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{file_id}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, saved_filename)

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # 2. Extract text
    document_text = extract_document(file_path)
    if not document_text.strip():
        raise ValueError("Document is empty or unreadable")

    # 3. Chunking
    chunks = await chunk_document(document_text)

    # 4. Embedding
    embedding_service = EmbeddingService(openai_api_key)
    embeddings = await embedding_service.embed_documents(chunks)

    # 5. Save to Vector DB
    vector_db.upsert_chunks(
        document_id=file_id,
        document_name=file.filename,
        chunks=chunks,
        embeddings=embeddings
    )
    # 6. Add to documents.json
    add_document(file_id, file.filename)

    return {
        "file_id": file_id,
        "filename": file.filename,
    }

async def list_documents() -> list:
    documents_path = os.path.join("uploads", "documents.json")

    os.makedirs(os.path.dirname(documents_path), exist_ok=True)

    if not os.path.exists(documents_path) or os.path.getsize(documents_path) == 0:
        with open(documents_path, "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False, indent=2)

    with open(documents_path, "r", encoding="utf-8") as f:
        documents = json.load(f)

    return documents

def read_txt_md(file_path: Path) -> str:
    return file_path.read_text(encoding="utf-8", errors="ignore")

def read_pdf(file_path: Path) -> str:
    document_text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                document_text += text + "\n"
    return document_text

def extract_document(file_path: str) -> str:
    path = Path(file_path)
    suffix = path.suffix.lower()

    if suffix in [".txt", ".md"]:
        return read_txt_md(path)

    if suffix == ".pdf":
        return read_pdf(path)

    raise ValueError(f"Unsupported file type: {suffix}")

def add_document(file_id: str, filename: str) -> None:
    documents_path = os.path.join("uploads", "documents.json")
    with open(documents_path, "r") as f:
        documents = json.load(f)
    documents.append({
        "file_id": file_id,
        "filename": filename,
    })
    with open(documents_path, "w") as f:
        json.dump(documents, f, indent=2)