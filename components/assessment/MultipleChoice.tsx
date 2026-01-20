'use client';

import React from 'react';
import { Option } from '@/lib/types';

interface MultipleChoiceProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
}

export function MultipleChoice({ options, value, onChange }: MultipleChoiceProps) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-xl
            ${
              value === option.value
                ? 'bg-amber-400/20 dark:bg-amber-400/20 border-2 border-amber-400/50 dark:border-amber-400/50 shadow-lg shadow-amber-400/10'
                : 'bg-white/40 dark:bg-white/10 border border-white/40 dark:border-white/20 hover:bg-white/60 dark:hover:bg-white/20'
            }
          `}
        >
          <input
            type="radio"
            name="multiple-choice"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700"
          />
          <span
            className={`ml-3 text-base ${
              value === option.value
                ? 'text-primary-700 dark:text-primary-300 font-medium'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
