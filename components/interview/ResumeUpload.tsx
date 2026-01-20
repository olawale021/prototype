'use client';

import React, { useCallback, useState } from 'react';

interface ResumeUploadProps {
  fileName?: string;
  hasContent: boolean;
  onUpload: (text: string, fileName: string) => void;
  onClear: () => void;
}

export function ResumeUpload({
  fileName,
  hasContent,
  onUpload,
  onClear,
}: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/interview/parse-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse resume');
      }

      if (!data.text || data.text.trim().length === 0) {
        throw new Error('Could not extract text from the file');
      }

      onUpload(data.text, file.name);
    } catch (err: any) {
      setError(err.message || 'Failed to process file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    []
  );

  if (hasContent) {
    return (
      <div className="p-4 bg-green-400/10 border border-green-400/30 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {fileName || 'Resume uploaded'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ready for question generation
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative p-6 border-2 border-dashed rounded-xl text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-amber-400 bg-amber-400/10'
            : 'border-slate-300/50 dark:border-slate-600/50 hover:border-amber-400/50 hover:bg-amber-400/5'
        }`}
      >
        <input
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-amber-500 mb-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm text-slate-600 dark:text-slate-300">Processing resume...</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 mx-auto mb-3 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-slate-500 dark:text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 font-medium mb-1">
              {isDragging ? 'Drop your resume here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              PDF or DOCX up to 10MB
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
