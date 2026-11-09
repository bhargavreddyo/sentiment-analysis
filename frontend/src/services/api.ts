import { HealthResponse, PredictionResult, BatchPredictResponse } from '../types';

// In development, Vite proxies /api to http://localhost:8000.
// Alternatively fallback directly to http://localhost:8000
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://sentiment-analysis-kappa-six.vercel.app';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    let response: Response;

    try {
      response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(options?.headers || {}),
        },
        ...options,
      });
    } catch (error) {
      throw new Error(`Network error connecting to backend at ${API_BASE}. Ensure the FastAPI server is running.`);
    }

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
          }
        }
      } catch {
        // use fallback message
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async checkHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/api/health', {
      method: 'GET',
    });
  }

  async predict(text: string): Promise<PredictionResult> {
    return this.request<PredictionResult>('/api/predict', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async predictBatch(texts: string[]): Promise<BatchPredictResponse> {
    return this.request<BatchPredictResponse>('/api/predict/batch', {
      method: 'POST',
      body: JSON.stringify({ texts }),
    });
  }
}

export const api = new ApiService();
