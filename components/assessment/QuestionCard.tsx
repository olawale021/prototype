'use client';

import React from 'react';
import { Question, AnswerValue } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { MultipleChoice } from './MultipleChoice';
import { MultiSelect } from './MultiSelect';
import { SliderInput } from './SliderInput';
import { TextInput } from './TextInput';

interface QuestionCardProps {
  question: Question;
  value?: AnswerValue;
  onChange: (value: AnswerValue) => void;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionCard({
  question,
  value,
  onChange,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const renderInput = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <MultipleChoice
            options={question.options || []}
            value={value as string}
            onChange={onChange}
          />
        );

      case 'multi-select':
        return (
          <MultiSelect
            options={question.options || []}
            value={value as string[]}
            onChange={onChange}
          />
        );

      case 'slider':
        return (
          <SliderInput
            value={value as number}
            onChange={onChange}
            min={question.min}
            max={question.max}
            step={question.step}
            minLabel={question.minLabel}
            maxLabel={question.maxLabel}
          />
        );

      case 'text':
        return (
          <TextInput
            value={value as string}
            onChange={onChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto" padding="sm">
      <CardHeader className="mb-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
            {questionNumber} of {totalQuestions}
          </span>
          {question.required && (
            <span className="text-xs text-slate-600 dark:text-slate-300">· Required</span>
          )}
        </div>
        <CardTitle className="text-base">{question.question}</CardTitle>
        {question.description && (
          <CardDescription className="text-sm mt-1">
            {question.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>{renderInput()}</CardContent>
    </Card>
  );
}
