from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import List
from app.services import document as document_service

router = APIRouter()

@router.post("/upload")
async def upload_documents(
    files: List[UploadFile] = File(...),
    openai_api_key: str = Form(...)
):
    if not openai_api_key:
        raise HTTPException(status_code=400, detail="OpenAI API key is required")
    try:
        results = []

        for file in files:
            result = await document_service.save_document(
                file,
                openai_api_key
            )
            results.append(result)

        return {
            "status": "success",
            "files": results
        }

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list")
async def list_documents():
    try:
        documents = await document_service.list_documents()
        return {
            "status": "success",
            "documents": documents
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

