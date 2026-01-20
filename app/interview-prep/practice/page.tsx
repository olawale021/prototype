'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useInterview } from '@/context/InterviewContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { QuestionDisplay } from '@/components/interview/QuestionDisplay';
import { AnswerInput } from '@/components/interview/AnswerInput';
import { FeedbackCard } from '@/components/interview/FeedbackCard';
import { InterviewProgress } from '@/components/interview/InterviewProgress';
import { SessionSummary } from '@/components/interview/SessionSummary';
import { AnswerFeedback } from '@/lib/interview-types';

export default function InterviewPracticePage() {
  const router = useRouter();
  const {
    session,
    setAnswer,
    setFeedback,
    setQuestionIndex,
    setStatus,
    getCurrentQuestion,
    getProgress,
  } = useInterview();

  const [currentAnswerText, setCurrentAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();

  // Redirect if no questions
  useEffect(() => {
    if (session.questions.length === 0) {
      router.push('/interview-prep');
    }
  }, [session.questions.length, router]);

  // Load existing answer when question changes
  useEffect(() => {
    const existingAnswer = session.answers.find(
      (a) => a.questionId === currentQuestion?.id
    );
    setCurrentAnswerText(existingAnswer?.answer || '');
  }, [session.currentQuestionIndex, currentQuestion?.id, session.answers]);

  const currentAnswerRecord = session.answers.find(
    (a) => a.questionId === currentQuestion?.id
  );
  const hasSubmitted = currentAnswerRecord?.feedback !== undefined;

  const handleSubmitAnswer = useCallback(async () => {
    if (!currentQuestion || !currentAnswerText.trim()) return;

    setIsSubmitting(true);
    setError(null);

    // Save the answer first
    setAnswer(currentQuestion.id, currentAnswerText);

    try {
      const response = await fetch('/api/interview/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.text,
          questionCategory: currentQuestion.category,
          userAnswer: currentAnswerText,
          jobDescription: session.input.jobDescription,
          resumeText: session.input.resumeText,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to evaluate answer');
      }

      const data = await response.json();
      setFeedback(currentQuestion.id, data.feedback as AnswerFeedback);
    } catch (err: any) {
      setError(err.message || 'Failed to evaluate answer');
    } finally {
      setIsSubmitting(false);
    }
  }, [currentQuestion, currentAnswerText, session.input, setAnswer, setFeedback]);

  const handleNext = useCallback(() => {
    if (session.currentQuestionIndex < session.questions.length - 1) {
      setQuestionIndex(session.currentQuestionIndex + 1);
    } else {
      // All questions answered
      setStatus('completed');
    }
  }, [session.currentQuestionIndex, session.questions.length, setQuestionIndex, setStatus]);

  const handlePrevious = useCallback(() => {
    if (session.currentQuestionIndex > 0) {
      setQuestionIndex(session.currentQuestionIndex - 1);
    }
  }, [session.currentQuestionIndex, setQuestionIndex]);

  const handleNavigate = useCallback(
    (index: number) => {
      setQuestionIndex(index);
    },
    [setQuestionIndex]
  );

  // Show summary when completed
  if (session.status === 'completed') {
    return <SessionSummary />;
  }

  if (!currentQuestion) {
    return null;
  }

  const isLastQuestion = session.currentQuestionIndex === session.questions.length - 1;

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
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {progress}% Complete
          </span>
        </div>

        {/* Progress */}
        <Card padding="md" className="mb-6">
          <CardContent>
            <InterviewProgress
              questions={session.questions}
              answers={session.answers}
              currentIndex={session.currentQuestionIndex}
              onNavigate={handleNavigate}
            />
          </CardContent>
        </Card>

        {/* Question */}
        <Card padding="lg" className="mb-6">
          <CardContent>
            <QuestionDisplay
              question={currentQuestion}
              questionNumber={session.currentQuestionIndex + 1}
              totalQuestions={session.questions.length}
            />
          </CardContent>
        </Card>

        {/* Answer Input */}
        <Card padding="lg" className="mb-6">
          <CardContent>
            <AnswerInput
              value={currentAnswerText}
              onChange={setCurrentAnswerText}
              onSubmit={handleSubmitAnswer}
              isSubmitting={isSubmitting}
              hasSubmitted={hasSubmitted}
            />
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-400/20 border border-red-400/40 rounded-xl text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Feedback */}
        {currentAnswerRecord?.feedback && (
          <div className="mb-6">
            <FeedbackCard
              feedback={currentAnswerRecord.feedback}
              questionCategory={currentQuestion.category}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={session.currentQuestionIndex === 0}
          >
            &larr; Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!hasSubmitted}
          >
            {isLastQuestion ? 'View Summary' : 'Next Question'} &rarr;
          </Button>
        </div>
      </div>
    </div>
  );
}
