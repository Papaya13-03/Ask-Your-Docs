# Ask Your Docs

A Retrieval-Augmented Generation (RAG) application that allows users to upload PDF documents and ask questions about their content using AI.

## Features

- **Document Upload**: Upload multiple PDF documents securely.
- **RAG Architecture**: Efficient document chunking and embedding using Qdrant.
- **AI-Powered Chat**: Ask questions and get accurate answers based on your uploaded documents.
- **Modern UI**: Clean and responsive component-based frontend.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: FastAPI, Python
- **Vector Database**: Qdrant
- **AI Model**: OpenAI (GPT models)

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js & npm
- OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AskYourDocs
   ```

2. **Backend Setup**
   
   Create a `.env` file in the `backend` directory:
   ```bash
   cp backend/.env.example backend/.env
   ```
   *Make sure to populate `OPENAI_API_KEY` in the `.env` file.*

   Run the backend:
   ```bash
   make run-backend
   ```

3. **Frontend Setup**

   Run the frontend:
   ```bash
   make run-frontend
   ```

4. **Access the App**
   Open [http://localhost:3000](http://localhost:3000) in your browser.
