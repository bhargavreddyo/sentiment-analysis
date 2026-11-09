import React from 'react';
import { AnalysisHistoryItem, SentimentLabel } from '../types';
import { SentimentBadge } from './SentimentBadge';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Smile,
  Meh,
  Frown,
  ArrowRight,
  Clock,
  Sparkles,
  Inbox,
} from 'lucide-react';

interface DashboardProps {
  history: AnalysisHistoryItem[];
  onNavigateToAnalyzer: () => void;
  onNavigateToHistory: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  history,
  onNavigateToAnalyzer,
  onNavigateToHistory,
}) => {
  const total = history.length;

  const counts: Record<SentimentLabel, number> = {
    positive: history.filter((h) => h.label === 'positive').length,
    neutral: history.filter((h) => h.label === 'neutral').length,
    negative: history.filter((h) => h.label === 'negative').length,
  };

  const getPercentage = (count: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  const chartData = [
    { name: 'Positive', value: counts.positive, color: '#15966A', bgLight: '#E8F7F0' },
    { name: 'Neutral', value: counts.neutral, color: '#E5A12B', bgLight: '#FEF7E6' },
    { name: 'Negative', value: counts.negative, color: '#DC6262', bgLight: '#FDECEC' },
  ];

  // Most recent 5 analyses
  const recentAnalyses = history.slice(0, 5);

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8EAF2]">
        <div>
          <h1 className="text-2xl font-semibold text-[#171D32] tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Real-time activity telemetry and classification distribution overview.
          </p>
        </div>

        <button
          onClick={onNavigateToAnalyzer}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#536DFE] hover:bg-[#4357D6] text-white text-sm font-medium rounded-lg shadow-subtle transition-all duration-200 ease-saas self-start sm:self-auto"
        >
          <Sparkles size={15} />
          <span>New Analysis</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* KPI Cards Row (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyses */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E8EAF2] shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider">
              Total Analyses
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F7F8FC] border border-[#E8EAF2] text-[#64748B] flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-bold text-[#171D32] tracking-tight">
              {total}
            </div>
            <span className="text-xs text-[#94A3B8] font-mono">100% eval</span>
          </div>
          <div className="mt-3 w-full h-1.5 rounded-full bg-[#F7F8FC] overflow-hidden">
            <div
              className="h-full bg-[#536DFE] rounded-full transition-all duration-500 ease-saas"
              style={{ width: total > 0 ? '100%' : '0%' }}
            />
          </div>
        </div>

        {/* Positive Analyses */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E8EAF2] shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#15966A] uppercase tracking-wider">
              Positive
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E8F7F0] text-[#15966A] flex items-center justify-center">
              <Smile size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-bold text-[#171D32] tracking-tight">
              {counts.positive}
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8F7F0] text-[#15966A]">
              {getPercentage(counts.positive)}%
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 rounded-full bg-[#E8F7F0] overflow-hidden">
            <div
              className="h-full bg-[#15966A] rounded-full transition-all duration-500 ease-saas"
              style={{ width: `${getPercentage(counts.positive)}%` }}
            />
          </div>
        </div>

        {/* Neutral Analyses */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E8EAF2] shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#E5A12B] uppercase tracking-wider">
              Neutral
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FEF7E6] text-[#E5A12B] flex items-center justify-center">
              <Meh size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-bold text-[#171D32] tracking-tight">
              {counts.neutral}
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FEF7E6] text-[#E5A12B]">
              {getPercentage(counts.neutral)}%
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 rounded-full bg-[#FEF7E6] overflow-hidden">
            <div
              className="h-full bg-[#E5A12B] rounded-full transition-all duration-500 ease-saas"
              style={{ width: `${getPercentage(counts.neutral)}%` }}
            />
          </div>
        </div>

        {/* Negative Analyses */}
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E8EAF2] shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#DC6262] uppercase tracking-wider">
              Negative
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FDECEC] text-[#DC6262] flex items-center justify-center">
              <Frown size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-bold text-[#171D32] tracking-tight">
              {counts.negative}
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FDECEC] text-[#DC6262]">
              {getPercentage(counts.negative)}%
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 rounded-full bg-[#FDECEC] overflow-hidden">
            <div
              className="h-full bg-[#DC6262] rounded-full transition-all duration-500 ease-saas"
              style={{ width: `${getPercentage(counts.negative)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart: Sentiment Distribution */}
        <div className="lg:col-span-5 bg-[#FFFFFF] p-5 sm:p-6 rounded-xl border border-[#E8EAF2] shadow-subtle flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#171D32]">Sentiment Distribution</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Ratio across evaluated sentences</p>
            </div>
            <span className="text-xs font-mono text-[#64748B] px-2 py-0.5 rounded bg-[#F7F8FC] border border-[#E8EAF2]">
              {total} Total
            </span>
          </div>

          <div className="h-60 w-full flex items-center justify-center my-3">
            {total === 0 ? (
              <div className="text-center py-8 text-[#94A3B8] space-y-1">
                <Inbox size={28} className="mx-auto text-[#94A3B8]/60" />
                <p className="text-xs font-medium text-[#64748B]">No sentiment data yet</p>
                <button
                  onClick={onNavigateToAnalyzer}
                  className="text-xs text-[#536DFE] hover:underline font-medium"
                >
                  Analyze your first sentence →
                </button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={84}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        return (
                          <div className="bg-[#FFFFFF] p-2.5 rounded-lg border border-[#E8EAF2] shadow-sm text-xs">
                            <span className="font-semibold text-[#171D32]">{data.name}: </span>
                            <span className="font-mono text-[#64748B]">
                              {data.value} ({getPercentage(Number(data.value))}%)
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend summary row */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E8EAF2] mt-auto">
            {chartData.map((item) => (
              <div key={item.name} className="text-center p-2 rounded-lg bg-[#F7F8FC]">
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748B]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-sm font-bold text-[#171D32] mt-0.5">
                  {total > 0 ? `${getPercentage(item.value)}%` : '0%'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Comparative Frequency */}
        <div className="lg:col-span-7 bg-[#FFFFFF] p-5 sm:p-6 rounded-xl border border-[#E8EAF2] shadow-subtle flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#171D32]">Classification Volume</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Frequency count by sentiment class</p>
            </div>
            <span className="text-xs text-[#64748B] font-mono">
              DistilBERT 3-Class
            </span>
          </div>

          <div className="h-60 w-full mt-3 flex items-center justify-center">
            {total === 0 ? (
              <div className="text-center text-[#94A3B8] py-8 space-y-1">
                <p className="text-xs text-[#64748B] font-medium">Activity graph will display here.</p>
                <p className="text-xs text-[#94A3B8]">Perform predictions in the Sentiment Analyzer to populate charts.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EAF2" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#E8EAF2' }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#E8EAF2' }} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(232, 234, 242, 0.4)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        return (
                          <div className="bg-[#FFFFFF] p-2.5 rounded-lg border border-[#E8EAF2] shadow-sm text-xs">
                            <span className="font-semibold text-[#171D32]">{data.payload.name}: </span>
                            <span className="font-mono text-[#64748B]">{data.value} sentences</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`bar-cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="pt-3 border-t border-[#E8EAF2] mt-auto flex items-center justify-between text-xs text-[#64748B]">
            <span>Model sequence window: 128 tokens</span>
            <span className="font-mono text-[#94A3B8]">PyTorch CPU Engine</span>
          </div>
        </div>
      </div>

      {/* Five Most Recent Analyses */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E8EAF2] shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-[#E8EAF2] flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#171D32]">Recent Analyses</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Five most recently evaluated statements</p>
          </div>
          {recentAnalyses.length > 0 && (
            <button
              onClick={onNavigateToHistory}
              className="text-xs font-semibold text-[#536DFE] hover:text-[#4357D6] flex items-center gap-1 transition-colors"
            >
              <span>View all ({total})</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        <div className="divide-y divide-[#E8EAF2]">
          {recentAnalyses.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#64748B] space-y-1">
              <Inbox size={26} className="mx-auto text-[#94A3B8]" />
              <p className="font-medium text-[#171D32]">No evaluations recorded yet</p>
              <p className="text-xs text-[#64748B]">
                Predictions run via the Sentiment Analyzer will appear here automatically.
              </p>
              <button
                onClick={onNavigateToAnalyzer}
                className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#536DFE] text-white text-xs font-medium rounded-lg hover:bg-[#4357D6] transition-colors"
              >
                Go to Analyzer
              </button>
            </div>
          ) : (
            recentAnalyses.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-4.5 hover:bg-[#F7F8FC]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-sm font-medium text-[#171D32] line-clamp-2">
                    "{item.text}"
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-[#64748B]">
                    <span className="flex items-center gap-1 font-mono text-[11px] text-[#94A3B8]">
                      <Clock size={12} />
                      {formatTimestamp(item.timestamp)}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[#64748B]">
                      Confidence: {(item.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <SentimentBadge label={item.label} size="sm" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
