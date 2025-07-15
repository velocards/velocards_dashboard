'use client';

import { Suspense } from 'react';
import GoogleCallback from '@/components/auth/GoogleCallback';

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleCallback />
    </Suspense>
  );
}