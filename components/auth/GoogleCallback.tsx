'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/authStore';
import { IconLoader2, IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import Image from 'next/image';

const GoogleCallback = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { checkAuth } = useAuthStore();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      // Get tokens from URL parameters
      const accessToken = searchParams.get('access_token');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        setStatus('error');
        setErrorMessage(errorDescription || 'Authentication failed');
        toast.error(errorDescription || 'Google sign-in failed');
        return;
      }

      if (!accessToken) {
        setStatus('error');
        setErrorMessage('No access token received');
        toast.error('Authentication failed - no token received');
        return;
      }

      try {
        // Store the access token
        localStorage.setItem('accessToken', accessToken);
        
        // Check authentication status to get user data
        await checkAuth();
        
        setStatus('success');
        toast.success('Successfully signed in with Google!');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } catch (err: any) {
        setStatus('error');
        setErrorMessage('Failed to complete authentication');
        toast.error('Failed to complete sign-in');
      }
    };

    handleCallback();
  }, [searchParams, router, checkAuth]);

  return (
    <div className="box xl:p-6 grid grid-cols-12 gap-4 xxxl:gap-6 items-center shadow-[0px_6px_30px_0px_rgba(0,0,0,0.04)]">
      <div className="col-span-12 lg:col-span-7">
        <div className="box bg-primary/5 dark:bg-bg3 lg:p-6 xl:p-8 border border-n30 dark:border-n500">
          <h3 className="h3 mb-4">Google Sign In</h3>
          
          {status === 'loading' && (
            <div className="text-center py-8">
              <IconLoader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
              <p className="text-lg mb-2">Completing sign in...</p>
              <p className="text-sm text-gray-500">Please wait while we authenticate your account</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center py-8">
              <IconCircleCheck className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h4 className="text-2xl font-semibold mb-2">Success!</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You have successfully signed in with Google.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to dashboard...
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center py-8">
              <IconCircleX className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h4 className="text-2xl font-semibold mb-2">Authentication Failed</h4>
              <p className="text-red-600 dark:text-red-400 mb-6">
                {errorMessage}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/auth/sign-in')}
                  className="btn-primary px-6"
                >
                  Back to Sign In
                </button>
                <button
                  onClick={() => {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.velocards.com/api/v1';
                    window.location.href = `${apiUrl}/auth/google`;
                  }}
                  className="btn-outline px-6"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="col-span-12 lg:col-span-5 flex justify-center items-center">
        <Image src="/images/auth.png" alt="img" width={533} height={560} />
      </div>
    </div>
  );
};

export default GoogleCallback;