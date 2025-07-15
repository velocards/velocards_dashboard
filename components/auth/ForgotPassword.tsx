'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { IconArrowLeft, IconMail } from '@tabler/icons-react';
import { authApi } from '@/lib/api/auth';
import CloudflareTurnstile, { TurnstileRef } from './CloudflareTurnstile';
import { toast } from 'react-toastify';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileRef>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    if (!turnstileToken) {
      toast.error('Please complete the security verification');
      return;
    }

    setIsLoading(true);
    
    try {
      await authApi.forgotPassword(data.email, turnstileToken);
      
      // Always show success for security
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success("If an account exists with that email, a password reset link has been sent.");
    } catch (error: any) {
      // For security, always show the same message
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success("If an account exists with that email, a password reset link has been sent.");
      
      // Reset captcha on error
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="box p-3 md:p-4 xl:p-6 max-w-md mx-auto">
        <div className="box bg-primary/5 dark:bg-bg3 lg:p-6 xl:p-8 border border-n30 dark:border-n500 text-center">
          <div className="mx-auto mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
            <IconMail className="h-8 w-8 text-primary" />
          </div>
          <h3 className="h3 mb-4">Check your email</h3>
          <p className="text-sm md:text-base mb-4">
            If an account exists with the email<br />
            <span className="font-medium text-n700 dark:text-n200">{submittedEmail}</span><br />
            we've sent a password reset link.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              If you have an account, please check your email and click on the link to reset your password. 
              The link will expire in 1 hour.
            </p>
          </div>
          
          <p className="text-sm text-n500 dark:text-n400 mb-6">
            Don't see the email? Check your spam folder or request a new link.
          </p>
          
          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={() => setIsSubmitted(false)}
              className="btn-primary w-full flex items-center justify-center"
            >
              Request new link
            </button>
            <Link href="/auth/sign-in" className="text-primary text-sm hover:underline text-center">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="box p-3 md:p-4 xl:p-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="box bg-primary/5 dark:bg-bg3 lg:p-6 xl:p-8 border border-n30 dark:border-n500">
          <Link 
            href="/auth/sign-in" 
            className="inline-flex items-center text-sm text-n500 dark:text-n400 hover:text-primary mb-4"
          >
            <IconArrowLeft className="h-4 w-4 mr-1" />
            Back to sign in
          </Link>
          
          <h3 className="h3 mb-4 text-center">Forgot password?</h3>
          <p className="md:mb-6 md:pb-6 mb-4 pb-4 bb-dashed text-sm md:text-base text-center">
            Enter your email address and we'll send you a password reset link
          </p>
          
          <label htmlFor="email" className="md:text-lg font-medium block mb-4">
            Enter Your Email
          </label>
          <input
            type="email"
            className={`w-full text-sm bg-n0 dark:bg-bg4 border ${
              errors.email ? 'border-red-500' : 'border-n30 dark:border-n500'
            } rounded-3xl px-3 md:px-6 py-2 md:py-3 mb-2`}
            placeholder="name@example.com"
            id="email"
            {...register("email")}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mb-3">{errors.email.message}</p>
          )}
          
          {/* Cloudflare Turnstile */}
          <CloudflareTurnstile
            ref={turnstileRef}
            action="forgot-password"
            onVerify={(token) => setTurnstileToken(token)}
            onError={() => {
              setTurnstileToken(null);
              toast.error('Security verification failed. Please try again.');
            }}
            onExpire={() => {
              setTurnstileToken(null);
            }}
          />
          
          <div className="mt-8">
            <button 
              type="submit" 
              className="btn-primary px-5 w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !turnstileToken}
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}