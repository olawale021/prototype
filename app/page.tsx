'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAssessment } from '@/context/AssessmentContext';

export default function HomePage() {
  const { state, reset, getProgress } = useAssessment();
  const progress = getProgress();
  const hasProgress = progress > 0;

  return (
    <div className="">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-3 tracking-wide uppercase">
            Career Assessment
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 dark:text-slate-100 mb-5 leading-tight">
            Find the career path that fits you
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-200 mb-8 leading-relaxed">
            Answer a few questions about your skills, interests, and goals.
            Get personalized career recommendations based on your unique profile.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {hasProgress ? (
              <>
                <Link href="/assessment">
                  <Button size="lg">
                    Continue ({progress}% complete)
                  </Button>
                </Link>
                <Button variant="outline" size="lg" onClick={reset}>
                  Start Over
                </Button>
              </>
            ) : (
              <Link href="/assessment">
                <Button size="lg">Start Assessment</Button>
              </Link>
            )}
          </div>

          {state.isComplete && (
            <div className="mt-4">
              <Link href="/results">
                <Button variant="secondary" size="lg">
                  View Your Results
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
          <Card padding="lg">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Personalized Analysis
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              Our assessment analyzes your unique combination of skills, interests, and preferences.
            </p>
          </Card>

          <Card padding="lg">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Instant Results
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              Get immediate recommendations with detailed explanations for each career path.
            </p>
          </Card>

          <Card padding="lg">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Interactive Refinement
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              Edit any answer and watch your recommendations update in real-time.
            </p>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 text-center mb-10">
            How It Works
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div className="pt-0.5">
                <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-1">
                  Answer Questions
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  Complete questions about your experience, skills, interests, and career goals.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div className="pt-0.5">
                <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-1">
                  Get Matched
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  Our algorithm matches you with career paths that align with your profile.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div className="pt-0.5">
                <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-1">
                  Explore & Refine
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  Review your matches and adjust answers to explore different possibilities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 pt-10 border-t border-white/30 dark:border-white/10">
          <p className="text-sm text-slate-700 dark:text-slate-200 mb-4">
            18 questions · About 5 minutes · Free
          </p>
          <Link href="/assessment">
            <Button size="lg" variant={hasProgress ? 'outline' : 'primary'}>
              {hasProgress ? 'Continue Assessment' : 'About Us'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
