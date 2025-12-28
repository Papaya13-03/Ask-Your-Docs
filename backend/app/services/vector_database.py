# app/services/vector_database.py
from typing import List, Dict, Any
from qdrant_client import QdrantClient
from qdrant_client.models import (
    VectorParams,
    Distance,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
    MatchAny,
)
import uuid

qdrant_client = QdrantClient(path="./qdrant")


class VectorDatabase:
    def __init__(
        self,
        collection_name: str = "documents",
        vector_size: int = 1536,
    ):
        self.collection_name = collection_name

        self._ensure_collection(vector_size)

    def _ensure_collection(self, vector_size: int):
        collections = qdrant_client.get_collections().collections
        if self.collection_name not in [c.name for c in collections]:
            qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=vector_size,
                    distance=Distance.COSINE
                )
            )

    def upsert_chunks(
        self,
        document_id: str,
        document_name: str,
        chunks: List[str],
        embeddings: List[List[float]]
    ):
        points = []

        for idx, (text, vector) in enumerate(zip(chunks, embeddings)):
            points.append(
                PointStruct(
                    id=uuid.uuid4(),
                    vector=vector,
                    payload={
                        "document_id": document_id,
                        "document_name": document_name,
                        "chunk_index": idx,
                        "text": text
                    }
                )
            )

        qdrant_client.upsert(
            collection_name=self.collection_name,
            points=points
        )
    
    def search(
        self,
        query_vector: List[float],
        document_ids: List[str] | None = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        search_filter = None

        if document_ids:
            search_filter = Filter(
                must=[
                    FieldCondition(
                        key="document_id",
                        match=MatchAny(any=document_ids)
                    )
                ]
            )

        results = qdrant_client.query_points(
            collection_name=self.collection_name,
            limit=top_k,
            query=query_vector,
            query_filter=search_filter
        ).points

        return [
            {
                "score": hit.score,
                "text": hit.payload.get("text", ""),
                "document_id": hit.payload.get("document_id", ""),
                "document_name": hit.payload.get("document_name", ""),
                "chunk_index": hit.payload.get("chunk_index", -1)
            }
            for hit in results
        ]

    def delete_document(self, document_id: str):
        qdrant_client.delete(
            collection_name=self.collection_name,
            points_selector=Filter(
                must=[
                    FieldCondition(
                        key="document_id",
                        match=MatchValue(value=document_id)
                    )
                ]
            )
        )
