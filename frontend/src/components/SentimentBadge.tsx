import React from 'react';
import { SentimentLabel } from '../types';
import { Smile, Meh, Frown } from 'lucide-react';

interface SentimentBadgeProps {
  label: SentimentLabel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const SentimentBadge: React.FC<SentimentBadgeProps> = ({
  label,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const config = {
    positive: {
      bg: 'bg-[#E8F7F0]',
      text: 'text-[#15966A]',
      border: 'border-[#15966A]/20',
      icon: Smile,
      name: 'Positive',
    },
    neutral: {
      bg: 'bg-[#FEF7E6]',
      text: 'text-[#E5A12B]',
      border: 'border-[#E5A12B]/25',
      icon: Meh,
      name: 'Neutral',
    },
    negative: {
      bg: 'bg-[#FDECEC]',
      text: 'text-[#DC6262]',
      border: 'border-[#DC6262]/20',
      icon: Frown,
      name: 'Negative',
    },
  }[label] || {
    bg: 'bg-[#F7F8FC]',
    text: 'text-[#64748B]',
    border: 'border-[#E8EAF2]',
    icon: Meh,
    name: label,
  };

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5 font-medium',
    md: 'text-xs sm:text-[13px] px-3 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  }[size];

  const iconSizes = {
    sm: 13,
    md: 14,
    lg: 16,
  }[size];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      {showIcon && <Icon size={iconSizes} strokeWidth={2.2} className="flex-shrink-0" />}
      <span className="capitalize">{config.name}</span>
    </span>
  );
};
