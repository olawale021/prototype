'use client';

import React from 'react';
import { Slider } from '@/components/ui/Slider';

interface SliderInputProps {
  value?: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
}

export function SliderInput({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  minLabel,
  maxLabel,
}: SliderInputProps) {
  const currentValue = value ?? min;

  return (
    <div className="py-4">
      <div className="flex justify-center mb-6">
        <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
          {currentValue}
        </span>
      </div>
      <Slider
        value={currentValue}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        minLabel={minLabel}
        maxLabel={maxLabel}
        showValue={false}
      />
    </div>
  );
}
