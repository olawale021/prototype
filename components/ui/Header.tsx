'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAssessment } from '@/context/AssessmentContext';

export function Header() {
  const { state, getProgress } = useAssessment();
  const pathname = usePathname();
  const progress = getProgress();
  const hasProgress = progress > 0;

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/assessment', label: 'Assessment' },
    ...(state.isComplete ? [{ href: '/results', label: 'Results' }] : []),
  ];

  const getButtonText = () => {
    if (hasProgress && !state.isComplete) return `Continue (${progress}%)`;
    if (state.isComplete) return 'View Results';
    return 'About Us';
  };

  const getButtonHref = () => {
    if (state.isComplete) return '/results';
    return '/assessment';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-5xl px-4 mt-4">
        <nav className="bg-white/60 dark:bg-white/10 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/20 shadow-lg shadow-black/5 px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-400/25">
                <svg className="w-6 h-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-slate-900 dark:text-white text-lg leading-tight">CAREERPATH</div>
                <div className="text-amber-500 dark:text-amber-400 text-[10px] tracking-widest uppercase">Advisor</div>
              </div>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-amber-500 dark:text-amber-400'
                      : 'text-slate-700 dark:text-slate-200 hover:text-amber-500 dark:hover:text-amber-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href={getButtonHref()}
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/25 text-sm"
            >
              {getButtonText()}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
