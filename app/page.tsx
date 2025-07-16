'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import VeloCardsLoader from '@/components/shared/VeloCardsLoader';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check auth status on mount
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Redirect when auth status is determined
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/auth/sign-in');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  return <VeloCardsLoader message="Redirecting..." />;
}