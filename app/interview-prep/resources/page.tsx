'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { studyResources, categoryInfo } from '@/lib/study-resources';
import { Card, CardContent } from '@/components/ui/Card';
import { ResourceCard } from '@/components/interview/ResourceCard';

type CategoryFilter = 'all' | 'method' | 'questions' | 'tips';

export default function StudyResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const filteredResources =
    activeCategory === 'all'
      ? studyResources
      : studyResources.filter((r) => r.category === activeCategory);

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All Resources' },
    { id: 'method', label: 'Methods' },
    { id: 'questions', label: 'Questions' },
    { id: 'tips', label: 'Tips' },
  ];

  return (
    <div className="min-h-screen py-4 px-4 pb-24">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/interview-prep"
            className="text-sm text-slate-700 dark:text-slate-200 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            &larr; Back to Interview Prep
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Study Resources
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Master your interview skills with these guides and tips
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/25'
                  : 'bg-white/40 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-white/40 dark:border-white/20 hover:bg-white/60 dark:hover:bg-white/20'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Category Info Cards */}
        {activeCategory !== 'all' && (
          <Card padding="md" className="mb-6 bg-amber-400/10 border-amber-400/30">
            <CardContent>
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {categoryInfo[activeCategory as keyof typeof categoryInfo].icon}
                </span>
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    {categoryInfo[activeCategory as keyof typeof categoryInfo].title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {categoryInfo[activeCategory as keyof typeof categoryInfo].description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resource Cards */}
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

        {/* Bottom CTA */}
        <Card padding="lg" className="mt-8 text-center">
          <CardContent>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Ready to Practice?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Put these strategies to the test with our AI-powered mock interview
            </p>
            <Link
              href="/interview-prep"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/25 text-sm"
            >
              Start Practice Interview
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
