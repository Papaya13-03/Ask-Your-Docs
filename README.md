# Ask Your Docs

A powerful Retrieval-Augmented Generation (RAG) application designed to bridge the gap between your documents and AI. Seamlessly upload PDF files and engage in intelligent conversations to extract insights, summaries, and answers directly from your content.

## 🌟 Features

- **📄 Smart Document Ingestion**: Robust support for uploading and processing multiple PDF documents simultaneously using `pdfplumber` and `pypdf2`.
- **🔍 High-Performance Vector Search**: utilizes **Qdrant**, a high-performance vector database, for efficient embedding storage and retrieval.
- **🤖 Advanced AI Integration**: Powered by **OpenAI's GPT models** to provide accurate, context-aware responses based on your data.
- **⚡ Modern, Reactive Frontend**: Built with **Next.js 16** and **React 19**, offering a lightning-fast user experience.
- **🎨 Sleek UI Design**: Styled with **TailwindCSS v4**, featuring a clean, responsive, and user-friendly interface.
- **☁️ Scalable Backend**: Developed with **FastAPI**, ensuring high performance and easy extensibility.

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **State Management & Data Fetching**: @tanstack/react-query
- **Linting**: ESLint

### Backend

- **Framework**: FastAPI
- **Runtime**: Python 3.12+
- **Package Management**: uv
- **Vector Database**: Qdrant
- **AI/LLM**: OpenAI API
- **PDF Processing**: pdfplumber, pypdf2

## 📂 Project Structure

```bash
AskYourDocs/
├── backend/                # Python FastAPI Backend
│   ├── app/                # Application source code
│   │   ├── main.py         # Entry point
│   │   └── ...
│   ├── uploads/            # Temporary storage for uploaded files
│   ├── qdrant/             # Local Qdrant data storage
│   ├── pyproject.toml      # Python dependencies (managed by uv)
│   └── .env                # Backend environment variables
├── frontend/               # Next.js Frontend
│   ├── app/                # App router pages and layouts
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── ...
├── makefile                # Convenience commands for running the app
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Python 3.12+**
- **Node.js** (LTS recommended) & **npm**
- **uv** (Python package installer and resolver) - `pip install uv`
- An **OpenAI API Key**

### Installation

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd AskYourDocs
    ```

2.  **Backend Setup**
    Navigate to the backend directory and set up your environment variables:

    ```bash
    cp backend/.env.example backend/.env
    ```

    _Open `backend/.env` and add your `OPENAI_API_KEY`._

    Run the backend server using the makefile:

    ```bash
    make run-backend
    ```

    _This command uses `uv` to handle dependencies and start the Uvicorn server on port 8000._

3.  **Frontend Setup**
    In a new terminal wndow, install dependencies and start the frontend:

    ```bash
    make run-frontend
    ```

    _The frontend will start on port 3000._

4.  **Access the Application**
    Open your browser and navigate to:
    [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

1.  **Upload Documents**: Use the "Upload" section to drag and drop or select your PDF files. The system will process and index them.
2.  **Ask Questions**: Type your query in the chat interface. The AI will search your uploaded documents for relevant context and provide an answer.
3.  **Explore**: Upload diverse documents to see how the RAG architecture handles different types of content.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
