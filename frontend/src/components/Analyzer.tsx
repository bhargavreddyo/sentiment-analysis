import React, { useState } from 'react';
import { PredictionResult } from '../types';
import { api } from '../services/api';
import { SentimentBadge } from './SentimentBadge';
import { ScoreBars } from './ScoreBars';
import {
  Sparkles,
  Layers,
  Trash2,
  AlertCircle,
  Send,
  Loader2,
  Copy,
  Check,
  CornerDownLeft,
  FileText,
} from 'lucide-react';

interface AnalyzerProps {
  onSavePrediction: (result: PredictionResult) => void;
  onSaveBatch: (results: PredictionResult[]) => void;
}

const SAMPLE_SENTENCES = [
  { text: "This product exceeded all my expectations! Remarkable quality and customer service.", label: 'Positive', color: '#15966A' },
  { text: "The delivery package arrived at the warehouse on Tuesday morning at 10 AM.", label: 'Neutral', color: '#E5A12B' },
  { text: "Terrible customer support and defective hardware. Completely frustrating experience.", label: 'Negative', color: '#DC6262' },
];

const SAMPLE_BATCH = [
  "I am deeply impressed by the speed, accuracy, and reliability of this service.",
  "The system configuration was updated to version 2.4.1 today.",
  "A frustrating bug caused the application to crash unexpectedly during checkout.",
  "The user interface is clean, exceptionally responsive, and very intuitive.",
  "Our team has scheduled the sprint review meeting for 3 PM tomorrow.",
];

export const Analyzer: React.FC<AnalyzerProps> = ({ onSavePrediction, onSaveBatch }) => {
  const [mode, setMode] = useState<'single' | 'batch'>('single');

  // Single mode state
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Batch mode state
  const [batchText, setBatchText] = useState('');
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [batchResults, setBatchResults] = useState<PredictionResult[] | null>(null);

  // Single analysis handler
  const handleSingleAnalyze = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Please provide text to evaluate.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.predict(trimmed);
      setResult(res);
      onSavePrediction(res);
    } catch (err: any) {
      setError(err.message || 'Inference failed. Ensure the FastAPI backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSingle = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  const handleCopyText = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Batch analysis helper
  const parseBatchLines = (raw: string) => {
    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  const batchLines = parseBatchLines(batchText);

  const handleBatchAnalyze = async () => {
    if (batchLines.length === 0) {
      setBatchError('Please provide at least one sentence for batch analysis.');
      return;
    }

    setBatchLoading(true);
    setBatchError(null);

    try {
      const response = await api.predictBatch(batchLines);
      setBatchResults(response.predictions);
      onSaveBatch(response.predictions);
    } catch (err: any) {
      setBatchError(err.message || 'Batch evaluation failed.');
    } finally {
      setBatchLoading(false);
    }
  };

  const handleClearBatch = () => {
    setBatchText('');
    setBatchResults(null);
    setBatchError(null);
  };

  const estimatedTokens = Math.ceil(text.length / 4);

  return (
    <div className="space-y-6">
      {/* Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8EAF2]">
        <div>
          <h1 className="text-2xl font-semibold text-[#171D32] tracking-tight">
            Sentiment Analyzer
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Analyze text using fine-tuned DistilBERT inference (max 128 tokens).
          </p>
        </div>

        {/* Mode Selector */}
        <div className="inline-flex items-center bg-[#F7F8FC] p-1 rounded-xl border border-[#E8EAF2] self-start sm:self-auto">
          <button
            onClick={() => setMode('single')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-[13px] font-medium transition-all duration-200 ease-saas ${
              mode === 'single'
                ? 'bg-[#FFFFFF] text-[#536DFE] shadow-sm font-semibold border border-[#E8EAF2]'
                : 'text-[#64748B] hover:text-[#171D32]'
            }`}
          >
            <Sparkles size={14} />
            <span>Single Text</span>
          </button>

          <button
            onClick={() => setMode('batch')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-[13px] font-medium transition-all duration-200 ease-saas ${
              mode === 'batch'
                ? 'bg-[#FFFFFF] text-[#536DFE] shadow-sm font-semibold border border-[#E8EAF2]'
                : 'text-[#64748B] hover:text-[#171D32]'
            }`}
          >
            <Layers size={14} />
            <span>Batch Analysis</span>
          </button>
        </div>
      </div>

      {mode === 'single' ? (
        /* SINGLE TEXT MODE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Form Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#FFFFFF] p-5 sm:p-6 rounded-xl border border-[#E8EAF2] shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="single-input" className="text-sm font-medium text-[#171D32]">
                  Input Text
                </label>
                <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
                  <span>{text.length} chars</span>
                  <span className="text-[#E8EAF2]">•</span>
                  <span className={estimatedTokens > 128 ? 'text-[#DC6262] font-semibold' : 'text-[#64748B]'}>
                    ~{estimatedTokens} / 128 tokens
                  </span>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                id="single-input"
                rows={5}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleSingleAnalyze();
                  }
                }}
                placeholder="Type or paste text to analyze sentiment (e.g., customer feedback, review, message)..."
                className="w-full p-3.5 text-sm rounded-lg border border-[#E8EAF2] bg-[#FFFFFF] focus:border-[#536DFE] focus:ring-2 focus:ring-[#536DFE]/15 outline-none transition-all duration-200 resize-y placeholder:text-[#94A3B8] text-[#171D32]"
              />

              {/* Sample statement buttons */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider block">
                  Sample Statements
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_SENTENCES.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setText(sample.text);
                        setError(null);
                      }}
                      className="group flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-[#F7F8FC] hover:bg-[#E8EAF2] text-[#171D32] rounded-lg border border-[#E8EAF2] transition-colors text-left"
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: sample.color }} />
                      <span className="font-semibold text-[#64748B] group-hover:text-[#171D32]">{sample.label}:</span>
                      <span className="truncate max-w-[180px] sm:max-w-xs">{sample.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E8EAF2]">
                <button
                  type="button"
                  onClick={handleClearSingle}
                  disabled={loading || (!text && !result && !error)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#64748B] hover:text-[#DC6262] disabled:opacity-40 transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Clear</span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#94A3B8] font-mono">
                    <span>Ctrl</span> + <CornerDownLeft size={11} />
                  </span>

                  <button
                    type="button"
                    onClick={handleSingleAnalyze}
                    disabled={loading || !text.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-[#536DFE] hover:bg-[#4357D6] disabled:bg-[#E8EAF2] disabled:text-[#94A3B8] text-white text-sm font-medium rounded-lg shadow-subtle transition-all duration-200 ease-saas"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} />
                        <span>Analyze Sentiment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="p-4 rounded-xl bg-[#FDECEC] border border-[#DC6262]/25 flex items-start gap-3 text-sm text-[#DC6262]">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold">Analysis Error</div>
                  <div className="text-xs mt-0.5 opacity-90">{error}</div>
                </div>
              </div>
            )}
          </div>

          {/* Prediction Result Column */}
          <div className="lg:col-span-5">
            <div className="bg-[#FFFFFF] p-5 sm:p-6 rounded-xl border border-[#E8EAF2] shadow-subtle min-h-[360px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E8EAF2]">
                  <h2 className="text-sm font-medium text-[#171D32]">
                    Prediction Result
                  </h2>
                  {result && (
                    <span className="text-xs font-mono text-[#64748B]">
                      Softmax Probabilities
                    </span>
                  )}
                </div>

                {loading ? (
                  <div className="py-16 flex flex-col items-center justify-center space-y-3">
                    <Loader2 size={28} className="animate-spin text-[#536DFE]" />
                    <div className="text-center space-y-0.5">
                      <p className="text-sm font-medium text-[#171D32]">Computing inference...</p>
                      <p className="text-xs text-[#64748B]">DistilBERT calculating sequence logits</p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-5 pt-4">
                    {/* Highlighted Predicted Sentiment & Confidence */}
                    <div className="p-4 rounded-xl bg-[#F7F8FC] border border-[#E8EAF2] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#64748B] font-medium block mb-1">
                          Predicted Sentiment
                        </span>
                        <SentimentBadge label={result.label} size="lg" />
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-[#64748B] font-medium block mb-0.5">
                          Confidence
                        </span>
                        <div className="text-2xl sm:text-3xl font-bold font-mono text-[#171D32]">
                          {(result.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* Three Horizontal Probability Bars */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-medium uppercase tracking-wider text-[#64748B]">
                          Class Probabilities
                        </h3>
                        <span className="text-[11px] font-mono text-[#94A3B8]">sum = 1.0</span>
                      </div>
                      <ScoreBars scores={result.scores} highlightedLabel={result.label} />
                    </div>
                  </div>
                ) : (
                  <div className="py-16 flex flex-col items-center justify-center text-center text-[#94A3B8] space-y-2">
                    <FileText size={28} className="mx-auto text-[#94A3B8]/60" />
                    <div className="space-y-0.5 max-w-xs">
                      <p className="text-sm font-medium text-[#171D32]">Awaiting text input</p>
                      <p className="text-xs text-[#64748B]">
                        Enter text on the left and click Analyze Sentiment to view classification and score breakdown.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Analyzed Text in a Separate Section */}
              {result && (
                <div className="pt-4 border-t border-[#E8EAF2] mt-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#64748B] font-medium">
                      Analyzed Text
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(result.text)}
                      className="text-xs text-[#64748B] hover:text-[#171D32] flex items-center gap-1 transition-colors"
                      title="Copy analyzed text"
                    >
                      {copied ? <Check size={12} className="text-[#15966A]" /> : <Copy size={12} />}
                      <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#171D32] italic bg-[#F7F8FC] p-3 rounded-lg border border-[#E8EAF2] line-clamp-3">
                    "{result.text}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* BATCH ANALYSIS MODE */
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] p-5 sm:p-6 rounded-xl border border-[#E8EAF2] shadow-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label htmlFor="batch-input" className="text-sm font-medium text-[#171D32]">
                  Batch Text Input
                </label>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Enter each text statement on a separate line. The model will evaluate all items concurrently.
                </p>
              </div>
              <span className="self-start sm:self-auto text-xs font-mono px-2.5 py-1 bg-[#F7F8FC] rounded-lg border border-[#E8EAF2] text-[#64748B]">
                {batchLines.length} {batchLines.length === 1 ? 'sentence' : 'sentences'} detected
              </span>
            </div>

            <textarea
              id="batch-input"
              rows={6}
              value={batchText}
              onChange={(e) => {
                setBatchText(e.target.value);
                if (batchError) setBatchError(null);
              }}
              placeholder={`Enter one sentence per line...\nExample:\nI love the responsiveness of this tool!\nThe order was delivered on Friday.\nThe battery life is completely unacceptable.`}
              className="w-full p-3.5 text-sm font-mono rounded-lg border border-[#E8EAF2] bg-[#FFFFFF] focus:border-[#536DFE] focus:ring-2 focus:ring-[#536DFE]/15 outline-none transition-all duration-200 resize-y placeholder:text-[#94A3B8] text-[#171D32]"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E8EAF2]">
              <button
                type="button"
                onClick={() => {
                  setBatchText(SAMPLE_BATCH.join('\n'));
                  setBatchError(null);
                }}
                className="text-xs font-medium text-[#536DFE] hover:underline self-start"
              >
                + Load 5 sample statements
              </button>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleClearBatch}
                  disabled={batchLoading || (!batchText && !batchResults)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#64748B] hover:text-[#DC6262] disabled:opacity-40 transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Clear</span>
                </button>

                <button
                  type="button"
                  onClick={handleBatchAnalyze}
                  disabled={batchLoading || batchLines.length === 0}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#536DFE] hover:bg-[#4357D6] disabled:bg-[#E8EAF2] disabled:text-[#94A3B8] text-white text-sm font-medium rounded-lg shadow-subtle transition-all duration-200 ease-saas"
                >
                  {batchLoading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Processing Batch...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Analyze Batch ({batchLines.length})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Batch Error State */}
          {batchError && (
            <div className="p-4 rounded-xl bg-[#FDECEC] border border-[#DC6262]/25 flex items-start gap-3 text-sm text-[#DC6262]">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold">Batch Analysis Failed</div>
                <div className="text-xs mt-0.5 opacity-90">{batchError}</div>
              </div>
            </div>
          )}

          {/* Batch Results View */}
          {batchResults && (
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E8EAF2] shadow-subtle overflow-hidden">
              <div className="p-5 border-b border-[#E8EAF2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-[#171D32]">
                    Batch Results ({batchResults.length} sentences)
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Evaluated concurrently and logged to analysis history.
                  </p>
                </div>

                {/* Batch Distribution Counts */}
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#E8F7F0] text-[#15966A] font-medium border border-[#15966A]/20">
                    {batchResults.filter((r) => r.label === 'positive').length} Positive
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#FEF7E6] text-[#E5A12B] font-medium border border-[#E5A12B]/20">
                    {batchResults.filter((r) => r.label === 'neutral').length} Neutral
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#FDECEC] text-[#DC6262] font-medium border border-[#DC6262]/20">
                    {batchResults.filter((r) => r.label === 'negative').length} Negative
                  </span>
                </div>
              </div>

              <div className="divide-y divide-[#E8EAF2]">
                {batchResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 hover:bg-[#F7F8FC]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-mono text-[#64748B] bg-[#F7F8FC] px-1.5 py-0.5 rounded border border-[#E8EAF2]">
                          #{idx + 1}
                        </span>
                        <SentimentBadge label={item.label} size="sm" />
                        <span className="text-xs font-mono font-semibold text-[#171D32]">
                          {(item.confidence * 100).toFixed(1)}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-[#171D32]">
                        "{item.text}"
                      </p>
                    </div>

                    <div className="w-full md:w-60 flex-shrink-0 pt-2 md:pt-0">
                      <div className="space-y-1 p-2.5 rounded-lg bg-[#F7F8FC] border border-[#E8EAF2]">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-[#15966A] font-medium">Pos: {(item.scores.positive * 100).toFixed(0)}%</span>
                          <span className="text-[#E5A12B] font-medium">Neu: {(item.scores.neutral * 100).toFixed(0)}%</span>
                          <span className="text-[#DC6262] font-medium">Neg: {(item.scores.negative * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full overflow-hidden flex bg-[#E8EAF2]">
                          <div
                            style={{ width: `${item.scores.positive * 100}%` }}
                            className="bg-[#15966A] h-full"
                          />
                          <div
                            style={{ width: `${item.scores.neutral * 100}%` }}
                            className="bg-[#E5A12B] h-full"
                          />
                          <div
                            style={{ width: `${item.scores.negative * 100}%` }}
                            className="bg-[#DC6262] h-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
