
import os
import sys
import logging
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Dict, List, Optional, Union

# Use temporary storage for Hugging Face cache on Vercel
if os.environ.get("VERCEL"):
    os.environ.setdefault("HF_HOME", "/tmp/huggingface")
    os.environ.setdefault("HF_HUB_CACHE", "/tmp/huggingface/hub")

import torch
from fastapi import Body, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from transformers import AutoModelForSequenceClassification, AutoTokenizer


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("sentiment_ai")

# ---------------------------------------------------------
# Path resolution for model
# ---------------------------------------------------------

def resolve_model_path() -> Union[Path, str]:
    hf_model_id = os.environ.get("HF_MODEL_ID")
    if hf_model_id:
        return hf_model_id

    env_path = os.environ.get("MODEL_PATH")
    if env_path and Path(env_path).exists():
        return Path(env_path)

    base_dir = Path(__file__).resolve().parent
    candidates = [
        base_dir / "models" / "distilbert_final",
        base_dir.parent / "models" / "distilbert_final",
        Path("models/distilbert_final").resolve(),
    ]

    for candidate in candidates:
        if candidate.exists() and (candidate / "config.json").exists():
            return candidate

    raise FileNotFoundError(
        "Model directory 'models/distilbert_final' not found."
    )


# ---------------------------------------------------------
# Model Service Singleton
# ---------------------------------------------------------
class ModelService:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.id2label: Dict[int, str] = {0: "negative", 1: "neutral", 2: "positive"}

    def load(self, model_path: Union[Path, str]):
        logger.info(f"Loading model and tokenizer from: {model_path} onto {self.device}")
        self.tokenizer = AutoTokenizer.from_pretrained(str(model_path))
        self.model = AutoModelForSequenceClassification.from_pretrained(str(model_path))
        self.model.to(self.device)
        self.model.eval()

        if hasattr(self.model.config, "id2label") and self.model.config.id2label:
            self.id2label = {int(k): v for k, v in self.model.config.id2label.items()}
        logger.info(f"Model loaded successfully with id2label: {self.id2label}")

    def predict_batch(self, texts: List[str]) -> List[dict]:
        if self.model is None or self.tokenizer is None:
            raise RuntimeError("Model is not initialized.")

        inputs = self.tokenizer(
            texts,
            padding=True,
            truncation=True,
            max_length=128,
            return_tensors="pt"
        ).to(self.device)

        with torch.no_grad():
            outputs = self.model(**inputs)
            probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)

        results = []
        for text, prob in zip(texts, probabilities):
            pred_id = int(torch.argmax(prob).item())
            confidence = float(prob[pred_id].item())
            scores = {
                self.id2label[i]: float(prob[i].item())
                for i in sorted(self.id2label.keys())
            }
            results.append({
                "text": text,
                "label": self.id2label[pred_id],
                "confidence": round(confidence, 6),
                "scores": {k: round(v, 6) for k, v in scores.items()},
            })
        return results


model_service = ModelService()


# ---------------------------------------------------------
# Lifespan: load model once at startup
# ---------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    model_path = resolve_model_path()
    model_service.load(model_path)
    yield
    logger.info("Application shutdown.")


# ---------------------------------------------------------
# FastAPI app setup
# ---------------------------------------------------------
app = FastAPI(
    title="SentimentAI Backend",
    version="1.0.0",
    description="Production sentiment analysis API using fine-tuned DistilBERT.",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Schemas
# ---------------------------------------------------------
class PredictRequest(BaseModel):
    text: str = Field(..., description="Text input for sentiment classification")


class PredictionResult(BaseModel):
    text: str
    label: str
    confidence: float
    scores: Dict[str, float]


class BatchPredictRequest(BaseModel):
    texts: List[str] = Field(..., description="List of texts for sentiment classification")


class BatchPredictResponse(BaseModel):
    predictions: List[PredictionResult]
    total: int


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    device: str
    labels: List[str]


# ---------------------------------------------------------
# Routes
# ---------------------------------------------------------
@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    is_loaded = model_service.model is not None and model_service.tokenizer is not None
    return HealthResponse(
        status="healthy" if is_loaded else "unhealthy",
        model_loaded=is_loaded,
        device=str(model_service.device),
        labels=[model_service.id2label[k] for k in sorted(model_service.id2label.keys())],
    )


@app.post("/api/predict", response_model=PredictionResult)
async def predict_single(request: PredictRequest):
    text = request.text
    if not text or not text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Input text must not be empty or whitespace only.",
        )
    results = model_service.predict_batch([text])
    return results[0]


@app.post("/api/predict/batch", response_model=BatchPredictResponse)
async def predict_batch(
    request: Union[BatchPredictRequest, List[str]] = Body(
        ...,
        openapi_examples={
            "object_format": {
                "summary": "Object with texts key",
                "value": {"texts": ["I love this product!", "The package arrived at 3pm.", "Terrible customer service."]}
            },
            "array_format": {
                "summary": "Direct list of strings",
                "value": ["I love this product!", "The package arrived at 3pm.", "Terrible customer service."]
            }
        }
    )
):
    if isinstance(request, BatchPredictRequest):
        texts = request.texts
    elif isinstance(request, list):
        texts = request
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid request body format.",
        )

    if not texts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The 'texts' list cannot be empty.",
        )

    for idx, t in enumerate(texts):
        if not isinstance(t, str) or not t.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Item at index {idx} must be a non-empty string.",
            )

    results = model_service.predict_batch(texts)
    return BatchPredictResponse(predictions=results, total=len(results))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
