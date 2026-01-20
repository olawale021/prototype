'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  hasSubmitted: boolean;
}

export function AnswerInput({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  hasSubmitted,
}: AnswerInputProps) {
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const words = value.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }, [value]);

  const canSubmit = value.trim().length >= 50 && !isSubmitting && !hasSubmitted;
  const isTooShort = value.trim().length > 0 && value.trim().length < 50;

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer here. Be specific and use examples from your experience. For behavioral questions, try using the STAR method (Situation, Task, Action, Result)..."
          className={`w-full h-48 p-4 bg-white/40 dark:bg-white/5 border rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all ${
            hasSubmitted
              ? 'border-green-400/50 bg-green-400/5'
              : 'border-white/40 dark:border-white/20'
          }`}
          disabled={hasSubmitted}
        />

        {hasSubmitted && (
          <div className="absolute top-2 right-2 flex items-center gap-1 text-green-500 text-xs">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Submitted
          </div>
        )}
      </div>

      {/* Word count and status */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span className={`${wordCount < 10 ? 'text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
            {wordCount} words
          </span>
          {isTooShort && (
            <span className="text-amber-500">
              Please write at least 50 characters
            </span>
          )}
        </div>

        {!hasSubmitted && (
          <Button
            onClick={onSubmit}
            disabled={!canSubmit}
            size="sm"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              'Submit Answer'
            )}
          </Button>
        )}
      </div>

      {/* STAR Method Helper */}
      {!hasSubmitted && value.length < 100 && (
        <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-lg">
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">
            STAR Method Reminder
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
            <li><strong>S</strong>ituation - Set the scene and context</li>
            <li><strong>T</strong>ask - Describe your responsibility</li>
            <li><strong>A</strong>ction - Explain what YOU did</li>
            <li><strong>R</strong>esult - Share the outcome and impact</li>
          </ul>
        </div>
      )}
    </div>
  );
}
