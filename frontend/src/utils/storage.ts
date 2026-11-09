import { AnalysisHistoryItem, PredictionResult } from '../types';

const STORAGE_KEY = 'sentilens_analysis_history';
const MAX_HISTORY_ITEMS = 500;

export function getStoredHistory(): AnalysisHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to load history from localStorage', err);
    return [];
  }
}

export function saveHistoryItem(prediction: PredictionResult): AnalysisHistoryItem {
  const history = getStoredHistory();
  const newItem: AnalysisHistoryItem = {
    ...prediction,
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date().toISOString(),
  };

  const updated = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save item to localStorage', err);
  }
  return newItem;
}

export function saveBatchHistoryItems(predictions: PredictionResult[]): AnalysisHistoryItem[] {
  const history = getStoredHistory();
  const newItems: AnalysisHistoryItem[] = predictions.map((p, idx) => ({
    ...p,
    id: `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date().toISOString(),
  }));

  const updated = [...newItems, ...history].slice(0, MAX_HISTORY_ITEMS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save batch items to localStorage', err);
  }
  return newItems;
}

export function clearStoredHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear history from localStorage', err);
  }
}
