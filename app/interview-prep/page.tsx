'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useInterview } from '@/context/InterviewContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ResumeUpload } from '@/components/interview/ResumeUpload';
import { JobDescriptionInput } from '@/components/interview/JobDescriptionInput';
import { InterviewQuestion, QuestionCategory } from '@/lib/interview-types';

const categoryTabs: { id: QuestionCategory | 'all'; label: string; color: string }[] = [
  { id: 'all', label: 'All', color: 'bg-slate-400' },
  { id: 'behavioral', label: 'Behavioral', color: 'bg-blue-400' },
  { id: 'technical', label: 'Technical', color: 'bg-purple-400' },
  { id: 'situational', label: 'Situational', color: 'bg-green-400' },
  { id: 'cultural', label: 'Cultural', color: 'bg-orange-400' },
];

export default function InterviewPrepPage() {
  const router = useRouter();
  const { session, setInput, setQuestions, startSession, reset } = useInterview();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<QuestionCategory | 'all'>('all');
  const [showInputs, setShowInputs] = useState(false);

  const canGenerate = session.input.resumeText.trim() && session.input.jobDescription.trim();

  const handleGenerateQuestions = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: session.input.jobDescription,
          resumeText: session.input.resumeText,
          count: 12,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate questions');
      }

      const data = await response.json();
      setQuestions(data.questions as InterviewQuestion[]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate questions');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartPractice = () => {
    startSession(uuidv4());
    router.push('/interview-prep/practice');
  };

  const handleReset = () => {
    reset();
    setError(null);
  };

  const hasQuestions = session.questions.length > 0;

  return (
    <div className="min-h-screen py-4 px-4 pb-24">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="text-sm text-slate-700 dark:text-slate-200 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            &larr; Back
          </Link>
          <Link
            href="/interview-prep/resources"
            className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
          >
            Study Resources &rarr;
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Interview Preparation
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Upload your resume and paste a job description to get personalized interview questions
          </p>
        </div>

        {/* Input Section */}
        {!hasQuestions ? (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Resume Upload */}
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Resume</CardTitle>
                <CardDescription>Upload your resume (PDF or DOCX)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResumeUpload
                  fileName={session.input.fileName}
                  hasContent={!!session.input.resumeText}
                  onUpload={(text, fileName) => setInput({ resumeText: text, fileName })}
                  onClear={() => setInput({ resumeText: '', fileName: '' })}
                />
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
                <CardDescription>Paste the job posting you're applying to</CardDescription>
              </CardHeader>
              <CardContent>
                <JobDescriptionInput
                  value={session.input.jobDescription}
                  onChange={(value) => setInput({ jobDescription: value })}
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Collapsible Input Section after questions generated */
          <div className="mb-6">
            <button
              onClick={() => setShowInputs(!showInputs)}
              className="w-full flex items-center justify-between p-4 bg-white/40 dark:bg-white/5 rounded-xl border border-white/40 dark:border-white/20 hover:bg-white/60 dark:hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{session.input.fileName || 'Resume'}</span>
                </div>
                <span className="text-slate-400">•</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">
                  {session.input.jobDescription.slice(0, 50)}...
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-slate-400 transition-transform ${showInputs ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showInputs && (
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                {/* Resume Preview */}
                <Card padding="lg">
                  <CardHeader>
                    <CardTitle>Resume</CardTitle>
                    <CardDescription>{session.input.fileName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-48 overflow-y-auto p-3 bg-white/40 dark:bg-white/5 rounded-lg text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                      {session.input.resumeText}
                    </div>
                  </CardContent>
                </Card>

                {/* Job Description Preview */}
                <Card padding="lg">
                  <CardHeader>
                    <CardTitle>Job Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-48 overflow-y-auto p-3 bg-white/40 dark:bg-white/5 rounded-lg text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                      {session.input.jobDescription}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-400/20 border border-red-400/40 rounded-xl text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Generate Button */}
        {!hasQuestions && (
          <div className="flex justify-center mb-8">
            <Button
              onClick={handleGenerateQuestions}
              disabled={!canGenerate || isGenerating}
              size="lg"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating Questions...
                </>
              ) : (
                'Generate Interview Questions'
              )}
            </Button>
          </div>
        )}

        {/* Questions Preview */}
        {hasQuestions && (
          <Card padding="lg" className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Questions</CardTitle>
                  <CardDescription>
                    {session.questions.length} questions ready for practice
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categoryTabs.map((tab) => {
                  const count = tab.id === 'all'
                    ? session.questions.length
                    : session.questions.filter(q => q.category === tab.id).length;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
                        activeTab === tab.id
                          ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/25'
                          : 'bg-white/40 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-white/40 dark:border-white/20 hover:bg-white/60 dark:hover:bg-white/20'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${tab.color}`} />
                      {tab.label}
                      <span className="text-[10px] opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Filtered Questions List */}
              <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                {session.questions
                  .filter(q => activeTab === 'all' || q.category === activeTab)
                  .map((question, index) => {
                    const tabInfo = categoryTabs.find(t => t.id === question.category);
                    return (
                      <div
                        key={question.id}
                        className="p-3 bg-white/40 dark:bg-white/5 rounded-lg border border-white/40 dark:border-white/20"
                      >
                        <div className="flex items-start gap-3">
                          <span className={`flex-shrink-0 w-6 h-6 rounded-full ${tabInfo?.color}/20 text-xs font-medium flex items-center justify-center`}>
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-800 dark:text-slate-200">
                              {question.text}
                            </p>
                            <span className={`inline-flex items-center gap-1.5 mt-1 text-xs px-2 py-0.5 rounded-full bg-slate-200/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 capitalize`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${tabInfo?.color}`} />
                              {question.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="secondary" onClick={handleGenerateQuestions} disabled={isGenerating}>
                  Regenerate
                </Button>
                <Button onClick={handleStartPractice}>
                  Start Practice
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips Section */}
        <Card padding="md" className="bg-amber-400/10 border-amber-400/30">
          <CardContent>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Tips for Best Results
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
              <li>
                <span className="text-amber-500 mr-2">1.</span>
                Include the complete job description with requirements and responsibilities
              </li>
              <li>
                <span className="text-amber-500 mr-2">2.</span>
                Make sure your resume is up-to-date with relevant experience
              </li>
              <li>
                <span className="text-amber-500 mr-2">3.</span>
                Practice answering using the STAR method (Situation, Task, Action, Result)
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
