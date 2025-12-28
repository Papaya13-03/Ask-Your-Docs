from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from fastapi.exceptions import HTTPException
from pydantic import BaseModel
from typing import Optional
import asyncio
from app.services.message import generate_response

router = APIRouter() 

class MessageRequest(BaseModel): 
    user_message: str
    openai_api_key: str
    file_ids: Optional[list[str]] = None 


@router.post("/stream")
async def receive_message_stream(request: MessageRequest):
    if not request.openai_api_key:
        raise HTTPException(status_code=400, detail="OpenAI API key is required")
    return StreamingResponse(
        generate_response(request.user_message, request.file_ids, request.openai_api_key, top_k=8),
        media_type="text/plain"
    )
