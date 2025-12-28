from typing import List


async def chunk_document(
    document: str,
    chunk_size: int = 800,
    overlap: int = 100
) -> List[str]:
    """
    Chunk text for RAG (word-based).
    """

    words = document.split()
    chunks = []

    start = 0
    total_words = len(words)

    while start < total_words:
        end = start + chunk_size
        chunk_words = words[start:end]

        if not chunk_words:
            break

        chunk_text = " ".join(chunk_words)
        chunks.append(chunk_text)

        start += chunk_size - overlap
    print(chunks)
    return chunks
