'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/context/AssessmentContext';
import { questions, questionCategories } from '@/lib/questions';
import { QuestionCard } from '@/components/assessment/QuestionCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { AnswerValue } from '@/lib/types';

export default function AssessmentPage() {
  const router = useRouter();
  const { state, setAnswer, setStep, getProgress } = useAssessment();
  const { currentStep, answers, isComplete } = state;

  const currentQuestion = questions[currentStep];
  const totalQuestions = questions.length;
  const progress = getProgress();

  const handleAnswer = (value: AnswerValue) => {
    setAnswer(currentQuestion.id, value);
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    }
  };

  const handleViewResults = () => {
    router.push('/results');
  };

  const canProceed = () => {
    const answer = answers[currentQuestion.id];
    if (!currentQuestion.required) return true;

    if (answer === undefined || answer === null) return false;
    if (Array.isArray(answer) && answer.length === 0) return false;
    if (typeof answer === 'string' && answer.trim() === '') return false;

    return true;
  };

  // Get current category
  const currentCategory = questionCategories.find(
    (c) => c.id === currentQuestion.category
  );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="text-sm text-slate-700 dark:text-slate-200 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            ← Back
          </Link>
          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            {currentCategory?.icon && (
              <Image src={currentCategory.icon} alt="" width={20} height={20} className="invert opacity-80" />
            )}
            {currentCategory?.title}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <ProgressBar progress={progress} size="md" />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {questionCategories.map((category) => {
            const categoryQuestions = questions.filter(
              (q) => q.category === category.id
            );
            const firstIndex = questions.findIndex(
              (q) => q.category === category.id
            );
            const lastIndex =
              firstIndex + categoryQuestions.length - 1;
            const isCurrent =
              currentStep >= firstIndex && currentStep <= lastIndex;
            const isCompleted = currentStep > lastIndex;

            return (
              <button
                key={category.id}
                onClick={() => setStep(firstIndex)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-xl ${
                  isCurrent
                    ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/25'
                    : isCompleted
                    ? 'bg-white/50 dark:bg-white/15 text-slate-700 dark:text-slate-200 border border-white/40 dark:border-white/20'
                    : 'bg-white/40 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-white/40 dark:border-white/20 hover:bg-white/60 dark:hover:bg-white/20'
                }`}
              >
                <Image
                  src={category.icon}
                  alt=""
                  width={18}
                  height={18}
                  className={isCurrent ? '' : 'invert opacity-80'}
                />
                {category.title}
              </button>
            );
          })}
        </div>

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          value={answers[currentQuestion.id]}
          onChange={handleAnswer}
          questionNumber={currentStep + 1}
          totalQuestions={totalQuestions}
        />

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            &larr; Previous
          </Button>

          <div className="flex gap-3">
            {currentStep === totalQuestions - 1 ? (
              <Button
                onClick={handleViewResults}
                disabled={!isComplete}
                className={isComplete ? 'animate-pulse' : ''}
              >
                View Results
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next &rarr;
              </Button>
            )}
          </div>
        </div>

        {/* Quick Navigation Dots */}
        <div className="flex justify-center gap-1.5 mt-8 flex-wrap">
          {questions.map((_, index) => {
            const isAnswered = answers[questions[index].id] !== undefined;
            const isCurrent = index === currentStep;

            return (
              <button
                key={index}
                onClick={() => setStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-amber-400 ring-2 ring-amber-200 dark:ring-amber-800'
                    : isAnswered
                    ? 'bg-slate-400 dark:bg-slate-500 hover:bg-slate-500'
                    : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                }`}
                title={`Question ${index + 1}`}
              />
            );
          })}
        </div>

        {/* View Results Link (if complete) */}
        {isComplete && currentStep !== totalQuestions - 1 && (
          <div className="text-center mt-6">
            <Link href="/results">
              <Button variant="secondary" size="sm">
                All questions answered · View Results
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
