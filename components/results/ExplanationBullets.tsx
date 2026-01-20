'use client';

import React from 'react';

interface ExplanationBulletsProps {
  reasons: string[];
}

export function ExplanationBullets({ reasons }: ExplanationBulletsProps) {
  return (
    <ul className="space-y-2">
      {reasons.map((reason, index) => (
        <li
          key={index}
          className="flex items-start gap-2 text-slate-700 dark:text-slate-200"
        >
          <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full text-xs mt-0.5">
            &#10003;
          </span>
          <span>{reason}</span>
        </li>
      ))}
    </ul>
  );
}
