export type SentimentLabel = 'positive' | 'neutral' | 'negative';

export interface SentimentScores {
  negative: number;
  neutral: number;
  positive: number;
}

export interface PredictionResult {
  text: string;
  label: SentimentLabel;
  confidence: number;
  scores: SentimentScores;
}

export interface BatchPredictResponse {
  predictions: PredictionResult[];
  total: number;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  device: string;
  labels: string[];
}

export interface AnalysisHistoryItem extends PredictionResult {
  id: string;
  timestamp: string; // ISO 8601 string
}
