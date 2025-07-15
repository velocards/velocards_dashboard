'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { authApi } from '@/lib/api/auth';
import { IconCircleCheck, IconCircleX, IconLoader2 } from '@tabler/icons-react';

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      setErrorMessage('No verification token provided');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await authApi.verifyEmail(token);
        setVerificationStatus('success');
        toast.success('Email verified successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/sign-in');
        }, 3000);
      } catch (error: any) {
        setVerificationStatus('error');
        const message = error.response?.data?.error?.message || 'Verification failed';
        setErrorMessage(message);
        toast.error(message);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="box xl:p-6 grid grid-cols-12 gap-4 xxxl:gap-6 items-center shadow-[0px_6px_30px_0px_rgba(0,0,0,0.04)]">
      <div className="col-span-12 lg:col-span-7">
        <div className="box bg-primary/5 dark:bg-bg3 lg:p-6 xl:p-8 border border-n30 dark:border-n500">
          <h3 className="h3 mb-4">Email Verification</h3>
          
          {verificationStatus === 'loading' && (
            <div className="text-center py-8">
              <IconLoader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
              <p className="text-lg mb-2">Verifying your email...</p>
              <p className="text-sm text-gray-500">Please wait while we verify your email address</p>
            </div>
          )}
          
          {verificationStatus === 'success' && (
            <div className="text-center py-8">
              <IconCircleCheck className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h4 className="text-2xl font-semibold mb-2">Email Verified!</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your email has been successfully verified. You can now login to your account.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Redirecting to login page in 3 seconds...
              </p>
              <Link href="/auth/sign-in" className="btn-primary px-6">
                Go to Login
              </Link>
            </div>
          )}
          
          {verificationStatus === 'error' && (
            <div className="text-center py-8">
              <IconCircleX className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h4 className="text-2xl font-semibold mb-2">Verification Failed</h4>
              <p className="text-red-600 dark:text-red-400 mb-6">
                {errorMessage}
              </p>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  The verification link may have expired or is invalid.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/sign-up" className="btn-primary px-6">
                    Sign Up Again
                  </Link>
                  <Link href="/auth/sign-in" className="btn-outline px-6">
                    Go to Login
                  </Link>
                </div>
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

export default VerifyEmail;