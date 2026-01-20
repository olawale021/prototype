'use client';

import React from 'react';
import { InterviewQuestion } from '@/lib/interview-types';

interface QuestionDisplayProps {
  question: InterviewQuestion;
  questionNumber: number;
  totalQuestions: number;
}

const categoryColors: Record<string, string> = {
  behavioral: 'bg-blue-400/20 text-blue-600 dark:text-blue-400 border-blue-400/30',
  technical: 'bg-purple-400/20 text-purple-600 dark:text-purple-400 border-purple-400/30',
  situational: 'bg-green-400/20 text-green-600 dark:text-green-400 border-green-400/30',
  cultural: 'bg-orange-400/20 text-orange-600 dark:text-orange-400 border-orange-400/30',
};

const categoryIcons: Record<string, React.ReactNode> = {
  behavioral: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  technical: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  situational: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  cultural: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
};

export function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
}: QuestionDisplayProps) {
  return (
    <div className="space-y-4">
      {/* Question Number and Category */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[question.category]}`}
        >
          {categoryIcons[question.category]}
          <span className="capitalize">{question.category}</span>
        </span>
      </div>

      {/* Question Text */}
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white leading-relaxed">
        {question.text}
      </h2>

      {/* Context (if available) */}
      {question.context && (
        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
          {question.context}
        </p>
      )}

      {/* Skills Assessed (if available) */}
      {question.skillsAssessed && question.skillsAssessed.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Assessing:</span>
          {question.skillsAssessed.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-slate-200/50 dark:bg-slate-700/50 rounded text-xs text-slate-600 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
