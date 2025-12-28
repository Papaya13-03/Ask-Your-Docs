from openai import OpenAI
from app.core.config import EMBED_MODEL

class EmbeddingService:
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)

    async def embed_documents(self,texts: list[str]) -> list[list[float]]:
        response = self.client.embeddings.create(
            model=EMBED_MODEL,
            input=texts
        )
        return [item.embedding for item in response.data]

    async def embed_query(self, text: str) -> list[float]:
        response = self.client.embeddings.create(
            model=EMBED_MODEL,
            input=text
        )
        return response.data[0].embedding
