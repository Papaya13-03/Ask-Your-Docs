import asyncio
from openai import AsyncOpenAI  # Changed from OpenAI
from app.services.embedding import EmbeddingService
from app.services.vector_database import VectorDatabase
from app.services.prompt import SYSTEM_PROMPT
from app.core.config import LLM_MODEL

async def generate_response(
    message: str,
    file_ids: list[str],
    openai_api_key: str,
    top_k: int = 5
):
    """
    Stream RAG response token by token.
    """
    embedding_service = EmbeddingService(openai_api_key)
    query_vector_list = await embedding_service.embed_documents([message])
    query_vector = query_vector_list[0]

    vector_db = VectorDatabase()
    retrieved_chunks = vector_db.search(
        query_vector=query_vector,
        document_ids=file_ids,
        top_k=top_k
    )

    context_text = "\n\n".join(
        [f"[Doc {c['document_name']}, Chunk {c['chunk_index']}]: {c['text']}" 
         for c in retrieved_chunks]
    )

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Context:\n{context_text}\n\nQuestion:\n{message}"}
    ]

    # 3️⃣ Stream OpenAI with AsyncOpenAI
    client = AsyncOpenAI(api_key=openai_api_key)

    # Proper async streaming
    stream = await client.chat.completions.create(
        model=LLM_MODEL,
        messages=messages,
        temperature=0,
        stream=True  # Enable streaming
    )
    
    async for chunk in stream:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content