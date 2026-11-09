# SentiLens — AI-Powered Sentiment Analysis Platform

> *"See the sentiment behind every word."*

Full-stack production sentiment analysis SaaS application powered by fine-tuned DistilBERT inference with a refined light-mode React dashboard.

---

## Architecture Overview

```
SentimentAi/
├── start_app.bat            # One-click startup script (Windows Command Prompt)
├── start_app.ps1            # One-click startup script (PowerShell)
├── backend/
│   ├── main.py              # FastAPI app with lifespan model loading & CORS
│   ├── requirements.txt     # Backend dependencies (FastAPI, PyTorch, Transformers)
│   └── .venv/               # Python virtual environment
├── frontend/
│   ├── src/
│   │   ├── components/      # Dashboard, Analyzer, History, ScoreBars, SentimentBadge, Header, Logo
│   │   ├── services/api.ts  # Centralized REST client connecting to FastAPI
│   │   ├── utils/storage.ts # LocalStorage history persistence
│   │   ├── types.ts         # TypeScript interfaces matching backend schemas
│   │   ├── App.tsx          # Main layout and tab router
│   │   └── main.tsx         # Application entry
│   ├── package.json         # React 18, TypeScript, Tailwind CSS, Recharts
│   └── vite.config.ts       # Vite config with /api reverse proxy
└── models/
    └── distilbert_final/    # Fine-tuned DistilBERT model weights and tokenizer
```

---

## Core Capabilities

- **Transformer Ingestion**: Fine-tuned DistilBERT sequence classifier loaded once at startup via FastAPI `lifespan`.
- **Three-Class Inference**: Classifies text into `positive`, `neutral`, and `negative` classes with exact softmax probabilities.
- **Analytics Dashboard**: 4 KPI counters, Recharts distribution donut and frequency volume bar charts, and 5 most recent evaluations.
- **Sentiment Analyzer**:
  - Single sequence evaluation with live character counter and 128-token estimation.
  - Multi-line batch processing endpoint.
  - Probability progress bars with exact scores, percentages, and winning class badge.
- **Analysis History**:
  - Filterable by sentiment (`all`, `positive`, `neutral`, `negative`).
  - Search by query text.
  - Export history to **JSON** and **CSV**.
  - Persisted in browser `localStorage`.
- **Brand Identity**: Indigo Intelligence light SaaS aesthetic with the official Three Sentiment Signals logo.

---

## API Endpoints

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/api/health` | Service health & model status | None | `HealthResponse` |
| `POST` | `/api/predict` | Single sequence prediction | `{"text": "..."}` | `PredictionResult` |
| `POST` | `/api/predict/batch` | Batch sequence prediction | `{"texts": ["..."]}` or `[...]` | `BatchPredictResponse` |

---

## Quickstart Guide

### Option A: One-Click Startup (Recommended)

From the project root:
- Double-click **`start_app.bat`** or run:
  ```powershell
  .\start_app.ps1
  ```
This automatically launches both the FastAPI backend (`http://localhost:8000`) and the Vite frontend dev server (`http://localhost:5173`) in dedicated windows.

---

### Option B: Manual Startup

#### 1. Start the FastAPI Backend
```powershell
.\backend\.venv\Scripts\uvicorn.exe backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive API docs: `http://localhost:8000/docs`

#### 2. Start the Frontend Dev Server
In a separate terminal:
```powershell
cd frontend
npm run dev
```
Open `http://localhost:5173` in your browser.

#### 3. Production Frontend Build
```powershell
cd frontend
npm run build
```
Compiled production files will be output to `frontend/dist/`.
