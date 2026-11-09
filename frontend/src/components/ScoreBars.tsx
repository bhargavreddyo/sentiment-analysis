import React from 'react';
import { SentimentScores, SentimentLabel } from '../types';
import { Check } from 'lucide-react';

interface ScoreBarsProps {
  scores: SentimentScores;
  highlightedLabel?: SentimentLabel;
}

export const ScoreBars: React.FC<ScoreBarsProps> = ({ scores, highlightedLabel }) => {
  const items: { label: SentimentLabel; name: string; score: number; barColor: string; trackBg: string }[] = [
    {
      label: 'positive',
      name: 'Positive',
      score: scores.positive,
      barColor: 'bg-[#15966A]',
      trackBg: 'bg-[#E8F7F0]',
    },
    {
      label: 'neutral',
      name: 'Neutral',
      score: scores.neutral,
      barColor: 'bg-[#E5A12B]',
      trackBg: 'bg-[#FEF7E6]',
    },
    {
      label: 'negative',
      name: 'Negative',
      score: scores.negative,
      barColor: 'bg-[#DC6262]',
      trackBg: 'bg-[#FDECEC]',
    },
  ];

  return (
    <div className="space-y-3.5 w-full">
      {items.map((item) => {
        const percentage = Math.min(100, Math.max(0, item.score * 100));
        const isHighlight = highlightedLabel === item.label;

        return (
          <div
            key={item.label}
            className={`w-full p-3 rounded-xl transition-all duration-200 border ${
              isHighlight
                ? 'bg-[#FFFFFF] border-[#536DFE]/30 shadow-subtle'
                : 'bg-[#F7F8FC]/60 border-[#E8EAF2]'
            }`}
          >
            <div className="flex items-center justify-between text-xs sm:text-[13px] mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${item.barColor}`}
                  aria-hidden="true"
                />
                <span className={`font-medium ${isHighlight ? 'text-[#171D32] font-semibold' : 'text-[#64748B]'}`}>
                  {item.name}
                </span>
                {isHighlight && (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[#536DFE]/10 text-[#536DFE]">
                    <Check size={10} strokeWidth={2.5} />
                    <span>Predicted</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 font-mono">
                <span className="text-[11px] text-[#94A3B8]">
                  {item.score.toFixed(4)}
                </span>
                <span className={`text-xs font-semibold ${isHighlight ? 'text-[#171D32]' : 'text-[#64748B]'}`}>
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Progress track */}
            <div className={`w-full h-2 rounded-full overflow-hidden ${item.trackBg}`}>
              <div
                className={`h-full rounded-full transition-all duration-500 ease-saas ${item.barColor}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
