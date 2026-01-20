'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useAssessment } from '@/context/AssessmentContext';
import { getRecommendations } from '@/lib/recommendationEngine';
import { CareerCard } from '@/components/results/CareerCard';
import { AnswerSummary } from '@/components/results/AnswerSummary';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CareerRecommendation, UserAnswers } from '@/lib/types';

async function fetchAIRecommendations(
  answers: UserAnswers
): Promise<CareerRecommendation[]> {
  const response = await fetch('/api/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch recommendations');
  }

  return data.recommendations;
}

export default function ResultsPage() {
  const { state, setAnswer, reset } = useAssessment();
  const { answers, isComplete } = state;

  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadRecommendations = useCallback(async (userAnswers: UserAnswers) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const aiRecommendations = await fetchAIRecommendations(userAnswers);
      if (aiRecommendations && aiRecommendations.length > 0) {
        setRecommendations(aiRecommendations);
      } else {
        throw new Error('No recommendations returned');
      }
    } catch (err: any) {
      console.error('AI recommendations failed, using fallback:', err);
      // Fallback to rule-based recommendations
      const fallbackRecommendations = getRecommendations(userAnswers);
      setRecommendations(fallbackRecommendations);
      setError(`AI unavailable: ${err?.message || 'Unknown error'}. Showing rule-based recommendations.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load recommendations when answers change (with debounce)
  useEffect(() => {
    if (!isComplete || Object.keys(answers).length === 0) {
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce API calls by 500ms
    debounceTimerRef.current = setTimeout(() => {
      loadRecommendations(answers);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [answers, isComplete, loadRecommendations]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswer(questionId, value);
  };

  const handleStartOver = () => {
    reset();
  };

  if (!isComplete) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-md text-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Complete Your Assessment
          </h1>
          <p className="text-slate-700 dark:text-slate-200 mb-6">
            Please answer all required questions to see your career recommendations.
          </p>
          <Link href="/assessment">
            <Button size="lg">Continue Assessment</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <Link
              href="/"
              className="text-sm text-slate-700 dark:text-slate-200 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              ← Back
            </Link>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-2">
              Your Career Matches
            </h1>
            <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">
              Based on your responses. Edit answers on the right to see how results change.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/assessment">
              <Button variant="outline" size="sm">
                Retake
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleStartOver}>
              Start Over
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Career Recommendations */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/40 dark:border-white/20 rounded-2xl p-4 shadow-lg shadow-black/5">
              <p className="text-sm text-slate-700 dark:text-slate-200">
                <span className="font-medium text-slate-900 dark:text-slate-100">AI-Powered:</span> Your recommendations are generated by AI based on your unique answers.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-amber-100/60 dark:bg-amber-900/20 backdrop-blur-xl border border-amber-200/60 dark:border-amber-700/30 rounded-2xl p-4 shadow-lg shadow-black/5">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {error}
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <LoadingSpinner size="lg" />
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  Analyzing your answers...
                </p>
              </div>
            ) : (
              <>
                {recommendations.map((recommendation, index) => (
                  <CareerCard
                    key={recommendation.career.id}
                    recommendation={recommendation}
                    rank={index + 1}
                  />
                ))}
              </>
            )}

            {/* Additional Industries Teaser */}
            {!isLoading && (
              <div className="text-center py-6 border-t border-white/30 dark:border-white/10">
                <p className="text-sm text-slate-700 dark:text-slate-200 mb-1">
                  Your top 3 matches. Other industries considered:
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Technology, Business, Finance, Healthcare, Education, Creative & Design, Marketing, Law & Government, Science, Manufacturing, Hospitality, Social Impact, Beauty & Fashion
                </p>
              </div>
            )}
          </div>

          {/* Right Panel - Answer Summary */}
          <div className="lg:col-span-1">
            <AnswerSummary
              answers={answers}
              onAnswerChange={handleAnswerChange}
            />
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-10 pt-8 border-t border-white/30 dark:border-white/10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Ready to take the next step?
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-200 mb-5">
            Explore the learning resources in each career card to start building the skills you need.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              Print Results
            </Button>
            <Link href="/assessment">
              <Button size="sm">Refine Answers</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
