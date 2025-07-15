import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export const useAuth = (requireAuth = true) => {
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push('/auth/sign-in');
    }
  }, [isAuthenticated, isLoading, requireAuth, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};