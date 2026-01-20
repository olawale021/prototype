'use client';

import React, { useState } from 'react';
import { CareerRecommendation } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface CareerCardProps {
  recommendation: CareerRecommendation;
  rank: number;
}

export function CareerCard({ recommendation, rank }: CareerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { career, percentage, reasons } = recommendation;

  const rankLabels = {
    1: 'Best Match',
    2: '2nd Match',
    3: '3rd Match',
  };

  return (
    <Card className="relative" padding="none">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{career.icon}</span>
            <div>
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                {rankLabels[rank as keyof typeof rankLabels]}
              </span>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {career.title}
              </h3>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {percentage}%
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300">match</div>
          </div>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-200 mb-4">
          {career.description}
        </p>

        <div className="mb-4">
          <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
            Why this fits you
          </h4>
          <ul className="space-y-1.5">
            {reasons.map((reason, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200"
              >
                <svg className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          {isExpanded ? 'Hide Details' : 'Show Next Steps'}
        </Button>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-white/30 dark:border-white/10 space-y-4">
            <div>
              <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Key Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {career.suggestedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-white/50 dark:bg-white/10 text-slate-700 dark:text-slate-200 rounded-lg backdrop-blur-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Example Roles
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {career.exampleJobs.map((job, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded"
                  >
                    {job}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Resources
              </h4>
              <ul className="space-y-1">
                {career.resources.map((resource, index) => (
                  <li key={index}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {resource.title} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
