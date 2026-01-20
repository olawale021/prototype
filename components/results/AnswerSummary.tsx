'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Question, AnswerValue } from '@/lib/types';
import { questions, questionCategories } from '@/lib/questions';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MultipleChoice } from '@/components/assessment/MultipleChoice';
import { MultiSelect } from '@/components/assessment/MultiSelect';
import { SliderInput } from '@/components/assessment/SliderInput';

interface AnswerSummaryProps {
  answers: Record<string, AnswerValue>;
  onAnswerChange: (questionId: string, value: AnswerValue) => void;
}

export function AnswerSummary({ answers, onAnswerChange }: AnswerSummaryProps) {
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const getAnswerDisplay = (question: Question, answer: AnswerValue): string => {
    if (answer === undefined || answer === null) return 'Not answered';

    switch (question.type) {
      case 'multiple-choice': {
        const option = question.options?.find((o) => o.value === answer);
        return option?.label || String(answer);
      }
      case 'multi-select': {
        const values = answer as string[];
        const labels = values.map(
          (v) => question.options?.find((o) => o.value === v)?.label || v
        );
        return labels.join(', ');
      }
      case 'slider': {
        return `${answer}${question.maxLabel ? ` (${question.maxLabel})` : ''}`;
      }
      default:
        return String(answer);
    }
  };

  const renderEditInput = (question: Question) => {
    const currentValue = answers[question.id];

    switch (question.type) {
      case 'multiple-choice':
        return (
          <MultipleChoice
            options={question.options || []}
            value={currentValue as string}
            onChange={(value) => {
              onAnswerChange(question.id, value);
              setEditingQuestion(null);
            }}
          />
        );
      case 'multi-select':
        return (
          <div className="space-y-3">
            <MultiSelect
              options={question.options || []}
              value={currentValue as string[]}
              onChange={(value) => onAnswerChange(question.id, value)}
            />
            <Button
              size="sm"
              onClick={() => setEditingQuestion(null)}
            >
              Done
            </Button>
          </div>
        );
      case 'slider':
        return (
          <div className="space-y-3">
            <SliderInput
              value={currentValue as number}
              onChange={(value) => onAnswerChange(question.id, value)}
              min={question.min}
              max={question.max}
              step={question.step}
              minLabel={question.minLabel}
              maxLabel={question.maxLabel}
            />
            <Button
              size="sm"
              onClick={() => setEditingQuestion(null)}
            >
              Done
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Answers</span>
          <span className="text-sm font-normal text-slate-700 dark:text-slate-200">
            Click to edit
          </span>
        </CardTitle>
      </CardHeader>

      <div className="space-y-4">
        {questionCategories.map((category) => {
          const categoryQuestions = questions.filter(
            (q) => q.category === category.id
          );
          const isExpanded = expandedCategory === category.id;

          return (
            <div key={category.id}>
              <button
                onClick={() =>
                  setExpandedCategory(isExpanded ? null : category.id)
                }
                className="w-full flex items-center justify-between p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-xl transition-all duration-300"
              >
                <span className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100">
                  <Image src={category.icon} alt="" width={18} height={18} className="invert opacity-80" />
                  {category.title}
                </span>
                <span className="text-slate-600 dark:text-slate-300">{isExpanded ? '−' : '+'}</span>
              </button>

              {isExpanded && (
                <div className="mt-2 space-y-3 pl-2">
                  {categoryQuestions.map((question) => (
                    <div
                      key={question.id}
                      className="p-3 bg-white/40 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-white/30 dark:border-white/10"
                    >
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {question.question}
                      </p>

                      {editingQuestion === question.id ? (
                        <div className="mt-3">{renderEditInput(question)}</div>
                      ) : (
                        <button
                          onClick={() => setEditingQuestion(question.id)}
                          className="w-full text-left"
                        >
                          <p className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                            {getAnswerDisplay(question, answers[question.id])}
                          </p>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
