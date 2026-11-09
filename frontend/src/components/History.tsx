import React, { useState, useMemo } from 'react';
import { AnalysisHistoryItem, SentimentLabel } from '../types';
import { SentimentBadge } from './SentimentBadge';
import {
  Search,
  Filter,
  Trash2,
  Clock,
  Download,
  Inbox,
  FileSpreadsheet,
} from 'lucide-react';

interface HistoryProps {
  history: AnalysisHistoryItem[];
  onClearHistory: () => void;
  onNavigateToAnalyzer: () => void;
}

export const History: React.FC<HistoryProps> = ({
  history,
  onClearHistory,
  onNavigateToAnalyzer,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<SentimentLabel | 'all'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filtered and searched list
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesFilter = filter === 'all' || item.label === filter;
      const matchesSearch =
        search.trim() === '' ||
        item.text.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [history, filter, search]);

  const formatDateTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return {
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: d.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }),
      };
    } catch {
      return { time: iso, date: '' };
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sentilens_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Timestamp', 'Sentiment', 'Confidence', 'Text', 'Positive_Score', 'Neutral_Score', 'Negative_Score'];
    const rows = history.map((item) => [
      `"${item.id}"`,
      `"${item.timestamp}"`,
      `"${item.label}"`,
      (item.confidence * 100).toFixed(2),
      `"${item.text.replace(/"/g, '""')}"`,
      (item.scores.positive * 100).toFixed(2),
      (item.scores.neutral * 100).toFixed(2),
      (item.scores.negative * 100).toFixed(2),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `sentilens_history_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8EAF2]">
        <div>
          <h1 className="text-2xl font-semibold text-[#171D32] tracking-tight">
            Analysis History
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Review previous sentiment predictions stored in your local session ({history.length} records).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {history.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleExportJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#171D32] bg-[#FFFFFF] hover:bg-[#F7F8FC] border border-[#E8EAF2] rounded-lg shadow-subtle transition-colors"
                title="Export history as JSON"
              >
                <Download size={13} />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#171D32] bg-[#FFFFFF] hover:bg-[#F7F8FC] border border-[#E8EAF2] rounded-lg shadow-subtle transition-colors"
                title="Export history as CSV"
              >
                <FileSpreadsheet size={13} />
                <span>Export CSV</span>
              </button>

              {showClearConfirm ? (
                <div className="flex items-center gap-2 bg-[#FDECEC] p-1 rounded-lg border border-[#DC6262]/20">
                  <span className="text-xs text-[#DC6262] font-medium px-2">Clear all?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClearHistory();
                      setShowClearConfirm(false);
                    }}
                    className="px-2.5 py-1 text-xs font-medium bg-[#DC6262] text-white rounded hover:bg-[#c44e4e] transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2 py-1 text-xs text-[#64748B] hover:text-[#171D32]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#DC6262] bg-[#FDECEC]/60 hover:bg-[#FDECEC] border border-[#DC6262]/20 rounded-lg transition-colors"
                >
                  <Trash2 size={13} />
                  <span>Clear History</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E8EAF2] shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search text in history..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E8EAF2] bg-[#F7F8FC]/50 focus:bg-[#FFFFFF] focus:border-[#536DFE] focus:ring-2 focus:ring-[#536DFE]/15 outline-none text-[#171D32] placeholder:text-[#94A3B8] transition-all"
          />
        </div>

        {/* Sentiment Filter Tabs */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-[#64748B] flex items-center gap-1 mr-1 font-medium">
            <Filter size={12} />
            <span>Filter:</span>
          </span>

          {(['all', 'positive', 'neutral', 'negative'] as const).map((cat) => {
            const count =
              cat === 'all'
                ? history.length
                : history.filter((h) => h.label === cat).length;
            const isSelected = filter === cat;

            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#536DFE] text-white shadow-subtle font-semibold'
                    : 'text-[#64748B] hover:text-[#171D32] hover:bg-[#F7F8FC]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* History Items Table */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E8EAF2] shadow-subtle overflow-hidden">
        {filteredHistory.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#64748B] space-y-1">
            {history.length === 0 ? (
              <>
                <Inbox size={28} className="mx-auto text-[#94A3B8]" />
                <p className="font-medium text-[#171D32]">No history records found</p>
                <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                  Run predictions in the Sentiment Analyzer and they will be preserved here in local storage.
                </p>
                <button
                  onClick={onNavigateToAnalyzer}
                  className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#536DFE] text-white text-xs font-medium rounded-lg hover:bg-[#4357D6] transition-colors"
                >
                  Go to Analyzer
                </button>
              </>
            ) : (
              <>
                <Search size={28} className="mx-auto text-[#94A3B8]" />
                <p className="font-medium text-[#171D32]">No matching records</p>
                <p className="text-xs text-[#64748B]">
                  No evaluations match the search query or selected sentiment filter.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F8FC] border-b border-[#E8EAF2] text-[11px] uppercase tracking-wider font-semibold text-[#64748B]">
                  <th className="py-3 px-5">Evaluated Text</th>
                  <th className="py-3 px-4">Sentiment</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Class Scores</th>
                  <th className="py-3 px-5 text-right">Date / Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF2] text-sm">
                {filteredHistory.map((item) => {
                  const dt = formatDateTime(item.timestamp);

                  return (
                    <tr key={item.id} className="hover:bg-[#F7F8FC]/50 transition-colors">
                      <td className="py-3.5 px-5 max-w-md">
                        <p className="font-medium text-[#171D32] line-clamp-2" title={item.text}>
                          "{item.text}"
                        </p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <SentimentBadge label={item.label} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-mono font-semibold text-xs text-[#171D32]">
                        {(item.confidence * 100).toFixed(1)}%
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="w-36 space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-[#64748B]">
                            <span className="text-[#15966A]">P:{(item.scores.positive * 100).toFixed(0)}%</span>
                            <span className="text-[#E5A12B]">N:{(item.scores.neutral * 100).toFixed(0)}%</span>
                            <span className="text-[#DC6262]">C:{(item.scores.negative * 100).toFixed(0)}%</span>
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
                      </td>

                      <td className="py-3.5 px-5 whitespace-nowrap text-right">
                        <div className="text-xs text-[#171D32] font-medium">{dt.date}</div>
                        <div className="text-[11px] text-[#94A3B8] flex items-center justify-end gap-1 mt-0.5 font-mono">
                          <Clock size={11} />
                          <span>{dt.time}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
