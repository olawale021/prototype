'use client';

import React from 'react';
import { InterviewQuestion, AnswerRecord } from '@/lib/interview-types';

interface InterviewProgressProps {
  questions: InterviewQuestion[];
  answers: AnswerRecord[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export function InterviewProgress({
  questions,
  answers,
  currentIndex,
  onNavigate,
}: InterviewProgressProps) {
  const getAnswerForQuestion = (questionId: string) => {
    return answers.find((a) => a.questionId === questionId);
  };

  const completedCount = answers.filter((a) => a.feedback).length;
  const progressPercentage = Math.round((completedCount / questions.length) * 100);

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-slate-600 dark:text-slate-300">
          Progress: {completedCount}/{questions.length}
        </span>
        <span className="font-medium text-amber-500">{progressPercentage}%</span>
      </div>

      <div className="h-2 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Question Pills */}
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => {
          const answer = getAnswerForQuestion(question.id);
          const isCompleted = answer?.feedback !== undefined;
          const isCurrent = index === currentIndex;
          const isAnswered = answer !== undefined;

          return (
            <button
              key={question.id}
              onClick={() => onNavigate(index)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-all flex items-center justify-center ${
                isCurrent
                  ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-200 dark:ring-amber-800'
                  : isCompleted
                  ? 'bg-green-400/20 text-green-600 dark:text-green-400 border border-green-400/40'
                  : isAnswered
                  ? 'bg-blue-400/20 text-blue-600 dark:text-blue-400 border border-blue-400/40'
                  : 'bg-white/40 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-white/40 dark:border-white/20 hover:bg-white/60 dark:hover:bg-white/20'
              }`}
              title={`Question ${index + 1}: ${question.category}`}
            >
              {isCompleted ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </button>
          );
        })}
      </div>

      {/* Category Summary */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-slate-500 dark:text-slate-400">
            Behavioral ({questions.filter((q) => q.category === 'behavioral').length})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          <span className="text-slate-500 dark:text-slate-400">
            Technical ({questions.filter((q) => q.category === 'technical').length})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-slate-500 dark:text-slate-400">
            Situational ({questions.filter((q) => q.category === 'situational').length})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-400" />
          <span className="text-slate-500 dark:text-slate-400">
            Cultural ({questions.filter((q) => q.category === 'cultural').length})
          </span>
        </div>
      </div>
    </div>
  );
}
