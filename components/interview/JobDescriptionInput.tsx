'use client';

import React from 'react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  const characterCount = value.length;
  const hasContent = value.trim().length > 0;

  return (
    <div className="space-y-2">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the complete job description here, including responsibilities, requirements, and qualifications..."
          className="w-full h-48 p-4 bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/20 rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
        />

        {hasContent && (
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            title="Clear"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{characterCount} characters</span>
        {hasContent && (
          <span className="flex items-center gap-1 text-green-500">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Ready
          </span>
        )}
      </div>
    </div>
  );
}
