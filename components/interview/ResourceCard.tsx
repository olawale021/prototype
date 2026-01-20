'use client';

import React, { useState } from 'react';
import { StudyResource } from '@/lib/study-resources';
import { Card, CardContent } from '@/components/ui/Card';

interface ResourceCardProps {
  resource: StudyResource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderContent = (content: string) => {
    // Simple markdown-like rendering for bold text
    return content.split('**').map((part, index) => {
      if (index % 2 === 1) {
        return (
          <strong key={index} className="font-semibold text-slate-900 dark:text-white">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
      <Card padding="lg" hover>
        <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
              {resource.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {resource.description}
            </p>
          </div>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <ul className="space-y-3">
              {resource.content.map((item, index) => (
                <li
                  key={index}
                  className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
                >
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>{renderContent(item)}</span>
                </li>
              ))}
            </ul>

            {resource.examples && resource.examples.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                  Example
                </h4>
                {resource.examples.map((example, index) => (
                  <div key={index} className="space-y-2">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic">
                      {example.scenario}
                    </p>
                    <div className="p-3 bg-white/40 dark:bg-white/5 rounded-lg text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">
                      {renderContent(example.answer)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
