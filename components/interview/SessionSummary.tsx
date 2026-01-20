'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useInterview } from '@/context/InterviewContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function SessionSummary() {
  const router = useRouter();
  const { session, reset, setStatus, getAverageScore } = useInterview();

  const averageScore = getAverageScore();
  const answersWithFeedback = session.answers.filter((a) => a.feedback);

  // Calculate category breakdowns
  const categoryScores = session.questions.reduce((acc, question) => {
    const answer = session.answers.find((a) => a.questionId === question.id);
    if (answer?.feedback) {
      if (!acc[question.category]) {
        acc[question.category] = { total: 0, count: 0 };
      }
      acc[question.category].total += answer.feedback.score;
      acc[question.category].count += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const categoryAverages = Object.entries(categoryScores).map(([category, data]) => ({
    category,
    average: Math.round(data.total / data.count),
    count: data.count,
  }));

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-400/20 border-green-400/30';
    if (score >= 60) return 'bg-amber-400/20 border-amber-400/30';
    return 'bg-red-400/20 border-red-400/30';
  };

  const getOverallFeedback = (score: number) => {
    if (score >= 80) {
      return {
        title: 'Excellent Performance!',
        message:
          "You demonstrated strong interview skills across multiple areas. Your answers were well-structured and showed clear evidence of relevant experience.",
      };
    }
    if (score >= 60) {
      return {
        title: 'Good Progress!',
        message:
          "You're on the right track with solid fundamentals. Focus on adding more specific examples and quantifiable results to strengthen your answers.",
      };
    }
    return {
      title: 'Keep Practicing!',
      message:
        'Review the feedback on each question and practice using the STAR method. Focus on being specific and providing concrete examples from your experience.',
    };
  };

  const overallFeedback = getOverallFeedback(averageScore);

  const handlePracticeAgain = () => {
    setStatus('in_progress');
    router.push('/interview-prep/practice');
  };

  const handleNewSession = () => {
    reset();
    router.push('/interview-prep');
  };

  return (
    <div className="min-h-screen py-4 px-4 pb-24">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/interview-prep"
            className="text-sm text-slate-700 dark:text-slate-200 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            &larr; Back to Setup
          </Link>
          <Link
            href="/interview-prep/resources"
            className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
          >
            Study Resources &rarr;
          </Link>
        </div>

        {/* Overall Score Card */}
        <Card padding="lg" className={`mb-6 ${getScoreBgColor(averageScore)}`}>
          <CardContent>
            <div className="text-center py-4">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {overallFeedback.title}
              </h1>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={`text-6xl font-bold ${getScoreColor(averageScore)}`}>
                  {averageScore}
                </span>
                <span className="text-2xl text-slate-400">/100</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                {overallFeedback.message}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card padding="md">
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {answersWithFeedback.length}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Questions Answered
              </div>
            </CardContent>
          </Card>
          <Card padding="md">
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {answersWithFeedback.filter((a) => (a.feedback?.score || 0) >= 70).length}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Strong Answers
              </div>
            </CardContent>
          </Card>
          <Card padding="md">
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-amber-500">
                {answersWithFeedback.filter((a) => (a.feedback?.score || 0) < 70).length}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Need Practice
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card padding="lg" className="mb-6">
          <CardHeader>
            <CardTitle>Performance by Category</CardTitle>
            <CardDescription>How you scored in each question type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryAverages.map(({ category, average, count }) => (
                <div key={category} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {category}
                  </div>
                  <div className="flex-1 h-3 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        average >= 80
                          ? 'bg-green-400'
                          : average >= 60
                          ? 'bg-amber-400'
                          : 'bg-red-400'
                      }`}
                      style={{ width: `${average}%` }}
                    />
                  </div>
                  <div className={`w-16 text-right font-medium ${getScoreColor(average)}`}>
                    {average}%
                  </div>
                  <div className="w-12 text-xs text-slate-500">
                    ({count} q)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Question Results */}
        <Card padding="lg" className="mb-6">
          <CardHeader>
            <CardTitle>Question-by-Question Results</CardTitle>
            <CardDescription>Click to review individual feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {session.questions.map((question, index) => {
                const answer = session.answers.find((a) => a.questionId === question.id);
                const score = answer?.feedback?.score || 0;

                return (
                  <div
                    key={question.id}
                    className="p-3 bg-white/40 dark:bg-white/5 rounded-lg border border-white/40 dark:border-white/20"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          score >= 70
                            ? 'bg-green-400/20 text-green-600 dark:text-green-400'
                            : 'bg-amber-400/20 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {score >= 70 ? '✓' : index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 dark:text-slate-200 line-clamp-2">
                          {question.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 capitalize">
                            {question.category}
                          </span>
                          <span className={`text-xs font-medium ${getScoreColor(score)}`}>
                            {score}/100
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={handlePracticeAgain}>
            Practice Again
          </Button>
          <Button onClick={handleNewSession}>
            New Session
          </Button>
        </div>

        {/* Tips */}
        <Card padding="md" className="mt-6 bg-amber-400/10 border-amber-400/30">
          <CardContent>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Next Steps
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
              <li>
                <span className="text-amber-500 mr-2">1.</span>
                Review questions where you scored below 70%
              </li>
              <li>
                <span className="text-amber-500 mr-2">2.</span>
                Study the sample answers for structure inspiration
              </li>
              <li>
                <span className="text-amber-500 mr-2">3.</span>
                Check out our Study Resources for more interview tips
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
