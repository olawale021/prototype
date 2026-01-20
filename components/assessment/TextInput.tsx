'use client';

import React from 'react';

interface TextInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export function TextInput({
  value = '',
  onChange,
  placeholder = 'Type your answer here...',
  multiline = false,
}: TextInputProps) {
  const baseStyles = `w-full px-4 py-3 text-slate-700 bg-white border-2 border-slate-200
    rounded-lg focus:outline-none focus:border-primary-500 dark:bg-slate-800
    dark:text-slate-200 dark:border-slate-600 dark:focus:border-primary-400
    placeholder-slate-400 dark:placeholder-slate-500 transition-colors duration-200`;

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className={`${baseStyles} resize-none`}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={baseStyles}
    />
  );
}
