import React from 'react';

interface LottoBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isMatched?: boolean;
  variant?: 'gold' | 'emerald' | 'amber' | 'neutral' | 'accent';
  className?: string;
}

export const LottoBall: React.FC<LottoBallProps> = ({
  number,
  size = 'md',
  isMatched = false,
  variant = 'emerald',
  className = '',
}) => {
  const formattedNumber = number.toString().padStart(2, '0');

  // Size definitions
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs font-bold',
    md: 'w-10 h-10 text-sm font-black',
    lg: 'w-12 h-12 text-base font-black',
    xl: 'w-14 h-14 text-lg font-black',
  };

  // Visual appearance styles
  let colorClasses = 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm';

  if (isMatched) {
    colorClasses = 'bg-gradient-to-b from-indigo-400 via-indigo-500 to-purple-600 text-white border-2 border-indigo-200 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/40';
  } else if (variant === 'emerald' || variant === 'accent') {
    colorClasses = 'bg-gradient-to-b from-zinc-800 to-zinc-900 text-indigo-300 border border-indigo-500/30 shadow-inner';
  } else if (variant === 'gold') {
    colorClasses = 'bg-gradient-to-b from-amber-300 via-amber-400 to-yellow-600 text-zinc-950 border border-amber-200 shadow-md shadow-amber-500/25';
  } else {
    colorClasses = 'bg-zinc-800 text-zinc-200 border border-zinc-700';
  }

  return (
    <div
      id={`lotto-ball-${number}`}
      className={`relative inline-flex items-center justify-center rounded-full select-none transition-transform duration-200 hover:scale-105 ${sizeClasses[size]} ${colorClasses} ${className}`}
    >
      {/* Specular ball gloss highlight */}
      <span className="absolute top-1 left-2 w-2 h-1 bg-white/30 rounded-full blur-[0.5px] pointer-events-none" />
      <span className="relative z-10 tracking-tight font-mono">{formattedNumber}</span>
      {isMatched && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500 border border-zinc-900"></span>
        </span>
      )}
    </div>
  );
};
