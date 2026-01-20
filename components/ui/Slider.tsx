'use client';

import React from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  showValue?: boolean;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  minLabel,
  maxLabel,
  showValue = true,
  className = '',
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-amber-400
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:bg-amber-400
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:bg-amber-400
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:shadow-md"
          style={{
            background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${percentage}%, rgb(226 232 240) ${percentage}%, rgb(226 232 240) 100%)`,
          }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {minLabel && (
          <span className="text-sm text-slate-700 dark:text-slate-200">
            {minLabel}
          </span>
        )}
        {showValue && (
          <span className="text-sm font-medium text-amber-500 dark:text-amber-400 absolute left-1/2 -translate-x-1/2">
            {value}
          </span>
        )}
        {maxLabel && (
          <span className="text-sm text-slate-700 dark:text-slate-200">
            {maxLabel}
          </span>
        )}
      </div>
    </div>
  );
}
