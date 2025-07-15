'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">VeloCards Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Manage your virtual cards with crypto
        </p>
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Go to Dashboard
          <i className="las la-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
}