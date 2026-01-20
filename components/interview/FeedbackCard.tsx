'use client';

import React, { useState } from 'react';
import { AnswerFeedback } from '@/lib/interview-types';
import { Card, CardContent } from '@/components/ui/Card';

interface FeedbackCardProps {
  feedback: AnswerFeedback;
  questionCategory: string;
}

export function FeedbackCard({ feedback, questionCategory }: FeedbackCardProps) {
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Review Required';
  };

  const isBehavioral = questionCategory === 'behavioral';

  return (
    <Card padding="lg" className="bg-white/70 dark:bg-white/15">
      <CardContent>
        <div className="space-y-5">
          {/* Score Header */}
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Feedback
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {getScoreLabel(feedback.score)}
              </p>
            </div>
            <div className="text-right">
              <span className={`text-3xl font-bold ${getScoreColor(feedback.score)}`}>
                {feedback.score}
              </span>
              <span className="text-slate-400 text-lg">/100</span>
            </div>
          </div>

          {/* STAR Analysis (for behavioral questions) */}
          {isBehavioral && feedback.starAnalysis && (
            <div className="p-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">
                STAR Method Analysis
              </p>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(feedback.starAnalysis).map(([key, present]) => (
                  <div
                    key={key}
                    className={`text-center p-2 rounded-lg ${
                      present
                        ? 'bg-green-400/20 text-green-600 dark:text-green-400'
                        : 'bg-red-400/20 text-red-500 dark:text-red-400'
                    }`}
                  >
                    <div className="text-lg mb-0.5">
                      {present ? '✓' : '✗'}
                    </div>
                    <div className="text-xs font-medium capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {feedback.strengths.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2 mb-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Strengths
              </h4>
              <ul className="space-y-1.5">
                {feedback.strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
                  >
                    <span className="text-green-500 mt-1">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {feedback.improvements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Areas for Improvement
              </h4>
              <ul className="space-y-1.5">
                {feedback.improvements.map((improvement, index) => (
                  <li
                    key={index}
                    className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
                  >
                    <span className="text-amber-500 mt-1">•</span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sample Answer Toggle */}
          <div>
            <button
              onClick={() => setShowSampleAnswer(!showSampleAnswer)}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-transform ${showSampleAnswer ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {showSampleAnswer ? 'Hide' : 'Show'} Sample Answer
            </button>

            {showSampleAnswer && (
              <div className="mt-3 p-4 bg-blue-400/10 border border-blue-400/20 rounded-lg">
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
                  Sample Strong Answer
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                  {feedback.sampleAnswer}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
