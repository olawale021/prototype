'use client';

import React from 'react';
import { Option } from '@/lib/types';

interface MultiSelectProps {
  options: Option[];
  value?: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  maxSelections,
}: MultiSelectProps) {
  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      if (maxSelections && value.length >= maxSelections) {
        // Remove first item and add new one
        const newValue = [...value.slice(1), optionValue];
        onChange(newValue);
      } else {
        onChange([...value, optionValue]);
      }
    }
  };

  return (
    <div className="space-y-3">
      {maxSelections && (
        <p className="text-sm text-slate-700 dark:text-slate-200 mb-2">
          Select up to {maxSelections} options ({value.length}/{maxSelections} selected)
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          return (
            <label
              key={option.value}
              className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-xl
                ${
                  isSelected
                    ? 'bg-amber-400/20 dark:bg-amber-400/20 border-2 border-amber-400/50 dark:border-amber-400/50 shadow-lg shadow-amber-400/10'
                    : 'bg-white/40 dark:bg-white/10 border border-white/40 dark:border-white/20 hover:bg-white/60 dark:hover:bg-white/20'
                }
              `}
            >
              <input
                type="checkbox"
                value={option.value}
                checked={isSelected}
                onChange={() => handleToggle(option.value)}
                className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700"
              />
              <span
                className={`ml-3 text-sm ${
                  isSelected
                    ? 'text-primary-700 dark:text-primary-300 font-medium'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
