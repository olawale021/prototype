'use client';

import React from 'react';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  progress,
  showLabel = true,
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const sizes = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
            Progress
          </span>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {clampedProgress}%
          </span>
        </div>
      )}
      <div
        className={`w-full bg-slate-200 rounded-full overflow-hidden dark:bg-slate-700/50 ${sizes[size]}`}
      >
        <div
          className={`bg-amber-400 ${sizes[size]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
