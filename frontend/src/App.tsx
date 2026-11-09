import React, { useState, useEffect, useCallback } from 'react';
import { Header, NavTab } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Analyzer } from './components/Analyzer';
import { History } from './components/History';
import { HealthResponse, AnalysisHistoryItem, PredictionResult } from './types';
import { api } from './services/api';
import {
  getStoredHistory,
  saveHistoryItem,
  saveBatchHistoryItems,
  clearStoredHistory,
} from './utils/storage';
import { LandingPage } from './components/LandingPage';
import './workspace.css';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  // Load persisted history on mount
  useEffect(() => {
    setHistory(getStoredHistory());
  }, []);

  // Check backend health
  const checkHealthStatus = useCallback(async () => {
    setHealthLoading(true);
    try {
      const data = await api.checkHealth();
      setHealth(data);
    } catch (err) {
      console.warn('Backend health check error:', err);
      setHealth(null);
    } finally {
      setHealthLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealthStatus();
    const interval = setInterval(checkHealthStatus, 30000);
    return () => clearInterval(interval);
  }, [checkHealthStatus]);

  // Handle saving prediction
  const handleSavePrediction = (result: PredictionResult) => {
    const newItem = saveHistoryItem(result);
    setHistory((prev) => [newItem, ...prev]);
  };

  // Handle saving batch predictions
  const handleSaveBatch = (results: PredictionResult[]) => {
    const newItems = saveBatchHistoryItems(results);
    setHistory((prev) => [...newItems, ...prev]);
  };

  // Handle clearing history
  const handleClearHistory = () => {
    clearStoredHistory();
    setHistory([]);
  };

  if (showLandingPage) {
    return (
      <LandingPage
        onNavigate={(tab) => {
          setCurrentTab(tab);
          setShowLandingPage(false);
        }}
      />
    );
  }

  return (
    <div className="workspace-shell min-h-screen flex flex-col">
      <div className="workspace-backdrop" aria-hidden="true">
        <video autoPlay muted loop playsInline preload="none">
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_112712_da9d53df-6d27-4b12-bdf6-aa9dc2622bdf.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      {/* Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onBackToLanding={() => setShowLandingPage(true)}
        health={health}
        healthLoading={healthLoading}
        onRefreshHealth={checkHealthStatus}
      />

      {/* Main Content Area */}
      <main className="workspace-main flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <Dashboard
            history={history}
            onNavigateToAnalyzer={() => setCurrentTab('analyzer')}
            onNavigateToHistory={() => setCurrentTab('history')}
          />
        )}

        {currentTab === 'analyzer' && (
          <Analyzer
            onSavePrediction={handleSavePrediction}
            onSaveBatch={handleSaveBatch}
          />
        )}

        {currentTab === 'history' && (
          <History
            history={history}
            onClearHistory={handleClearHistory}
            onNavigateToAnalyzer={() => setCurrentTab('analyzer')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="workspace-footer py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <div className="flex items-center gap-3">
            <span className="text-[#64748B]">
              "See the sentiment behind every word."
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-[#94A3B8]">
            <span>DistilBERT Model</span>
            <span>•</span>
            <span>128-Token Window</span>
            <span>•</span>
            <span>Softmax Confidence</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
