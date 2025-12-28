from fastapi import APIRouter
from .documents.route import router as documents_router
from .message.route import router as message_router

router = APIRouter()
router.include_router(documents_router, prefix="/documents", tags=["Documents"])
router.include_router(message_router, prefix="/message", tags=["Message"])