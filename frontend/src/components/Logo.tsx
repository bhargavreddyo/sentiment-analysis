import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  const sizeMap = {
    sm: { icon: 26, text: 'text-base' },
    md: { icon: 32, text: 'text-lg' },
    lg: { icon: 40, text: 'text-2xl' },
  };

  const { icon, text } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Three Sentiment Signals Icon */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        aria-hidden="true"
      >
        {/* Subtle connecting bridge */}
        <path
          d="M24 50 C 36 40, 64 40, 76 50"
          stroke="#536DFE"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M24 50 L 76 50"
          stroke="#8067E8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="3 3"
          opacity="0.35"
        />

        {/* Signal 1: Negative (Angled Diamond Node in #DC6262) */}
        <g transform="translate(24, 50)">
          <rect
            x="-12"
            y="-12"
            width="24"
            height="24"
            rx="5"
            transform="rotate(45)"
            fill="#DC6262"
          />
          <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" opacity="0.95" />
        </g>

        {/* Signal 2: Neutral (Balanced Square Node in #E5A12B) */}
        <g transform="translate(50, 48)">
          <rect
            x="-10"
            y="-10"
            width="20"
            height="20"
            rx="4"
            fill="#E5A12B"
          />
          <line x1="-4" y1="0" x2="4" y2="0" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* Signal 3: Positive (Upward Circular Node in #15966A) */}
        <g transform="translate(76, 50)">
          <circle
            cx="0"
            cy="0"
            r="12"
            fill="#15966A"
          />
          <circle cx="0" cy="0" r="4" fill="#FFFFFF" opacity="0.95" />
        </g>
      </svg>

      {showText && (
        <div className="flex items-center tracking-tight leading-none">
          <span className={`${text} text-[#171D32] font-semibold tracking-tight`}>Senti</span>
          <span className={`${text} text-[#536DFE] font-semibold tracking-tight`}>Lens</span>
        </div>
      )}
    </div>
  );
};
