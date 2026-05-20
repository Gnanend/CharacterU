import React from 'react';
import Card from './Card';

/**
 * Basic reusable Skeleton Block
 * Applies a smooth shimmer pulse animation.
 */
export const SkeletonBlock = ({ className = '', rounded = 'rounded-xl' }) => (
  <div className={`animate-pulse bg-dark-800 ${rounded} ${className}`} />
);

/**
 * Skeleton Loader specifically designed for the Dashboard/Profile Stat Cards
 */
export const StatCardSkeleton = () => (
  <Card padding="p-6">
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-3 w-full">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-8 w-32" />
        <SkeletonBlock className="h-4 w-16 mt-2" />
      </div>
      <SkeletonBlock className="w-14 h-14 rounded-2xl shrink-0" />
    </div>
  </Card>
);

/**
 * Standard content row skeleton (e.g., Leaderboard row, activity feed)
 */
export const RowSkeleton = () => (
  <div className="flex items-center gap-4 p-4 border border-dark-800 rounded-2xl bg-dark-900/50">
    <SkeletonBlock className="w-12 h-12 rounded-full shrink-0" />
    <div className="flex-1 space-y-2">
      <SkeletonBlock className="h-4 w-1/3" />
      <SkeletonBlock className="h-3 w-1/4" />
    </div>
    <div className="hidden sm:block">
      <SkeletonBlock className="h-6 w-20" />
    </div>
  </div>
);

export default { SkeletonBlock, StatCardSkeleton, RowSkeleton };
