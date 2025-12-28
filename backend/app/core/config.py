import os
from dotenv import load_dotenv

load_dotenv()

LLM_MODEL = os.getenv("MODEL_NAME", "gpt-3.5-turbo-16k")
EMBED_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")