import React from 'react';
import { motion } from 'motion/react';
import { Layout, Grid, FileText, CheckCircle, RefreshCw } from 'lucide-react';

interface SkeletonLoaderProps {
  darkMode?: boolean;
}

export function SkeletonLoader({ darkMode = false }: SkeletonLoaderProps) {
  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Header Skeleton */}
      <header className="h-16 border-b border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Logo Icon Placeholder */}
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
          <div className="space-y-1.5">
            {/* Title Placeholder */}
            <div className="h-4 w-28 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
            {/* Subtitle Placeholder */}
            <div className="h-2.5 w-40 rounded-sm bg-slate-150 dark:bg-slate-850 animate-pulse relative overflow-hidden" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Circle Icon Button Placeholder */}
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
          {/* Pill Badge Placeholder */}
          <div className="w-24 h-7 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
          {/* Avatar Placeholder */}
          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
      </header>

      <div className="flex-1 flex h-full">
        
        {/* Sidebar Skeleton */}
        <aside className="hidden md:flex w-64 border-r border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 p-5 flex-col gap-6 shrink-0">
          <div className="space-y-2">
            <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-pulse mb-4" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850/50">
                <div className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-3.5 w-28 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse mb-4" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 px-3 rounded-xl">
                <div className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-3.5 w-24 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area Skeleton */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          
          {/* Top Banner Skeleton */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
            <div className="space-y-2.5 flex-1">
              <div className="h-5 w-48 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              </div>
              <div className="h-3.5 w-full max-w-lg rounded-md bg-slate-150 dark:bg-slate-850 animate-pulse" />
              <div className="h-3.5 w-2/3 rounded-md bg-slate-150 dark:bg-slate-850 animate-pulse" />
            </div>
            {/* CTA Button Placeholder */}
            <div className="w-32 h-10 rounded-2xl bg-blue-500/20 dark:bg-blue-500/10 border border-blue-500/30 animate-pulse shrink-0" />
          </div>

          {/* KPI Dashboard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="h-3.5 w-24 rounded bg-slate-150 dark:bg-slate-850 animate-pulse" />
                  <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-7 w-20 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-3 w-32 rounded bg-slate-150 dark:bg-slate-850 animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Two Column Layout (Graph & Table) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Column 1: Chart Placeholder (7 cols) */}
            <div className="lg:col-span-7 p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="space-y-1.5">
                  <div className="h-4.5 w-36 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-3 w-44 rounded bg-slate-150 dark:bg-slate-850 animate-pulse" />
                </div>
                <div className="flex gap-1.5">
                  <div className="w-12 h-6 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="w-12 h-6 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
              </div>

              {/* Chart Bars Shimmer Container */}
              <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
                {[30, 85, 45, 60, 95, 50, 70, 40, 65, 80, 55, 90].map((h, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-slate-200 dark:bg-slate-800/80 rounded-t-lg relative overflow-hidden animate-pulse"
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 dark:via-white/5 to-transparent" />
                    </div>
                    <div className="h-2 w-full max-w-[20px] rounded bg-slate-150 dark:bg-slate-850 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: List Table Placeholder (5 cols) */}
            <div className="lg:col-span-5 p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="h-4.5 w-32 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-3 w-48 rounded bg-slate-150 dark:bg-slate-850 animate-pulse" />
                </div>

                <div className="space-y-3.5 pt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-850 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        <div className="space-y-1.5">
                          <div className="h-3.5 w-28 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                          <div className="h-2.5 w-20 rounded bg-slate-150 dark:bg-slate-850 animate-pulse" />
                        </div>
                      </div>
                      <div className="w-16 h-5 rounded-full bg-slate-150 dark:bg-slate-850 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full h-9 rounded-xl bg-slate-150 dark:bg-slate-850 animate-pulse mt-4" />
            </div>

          </div>

          {/* Table Grid Content Skeleton */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-1.5">
                <div className="h-4.5 w-40 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-3 w-56 rounded bg-slate-150 dark:bg-slate-850 animate-pulse" />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse flex-1 sm:flex-none" />
                <div className="h-8 w-32 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse flex-1 sm:flex-none" />
              </div>
            </div>

            {/* Structured Table Rows */}
            <div className="space-y-3.5 pt-4">
              {[1, 2, 3, 5].map((i) => (
                <div key={i} className="grid grid-cols-12 gap-4 items-center p-3.5 border border-slate-100 dark:border-slate-850 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                  <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3.5 w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                      <div className="h-2.5 w-24 rounded bg-slate-150 dark:bg-slate-850" />
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-3">
                    <div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    <div className="h-5 w-14 rounded-full bg-slate-150 dark:bg-slate-850 animate-pulse" />
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    <div className="h-3.5 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  </div>
                  <div className="col-span-12 md:col-span-1 flex justify-end">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
