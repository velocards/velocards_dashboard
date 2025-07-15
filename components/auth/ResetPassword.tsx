'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { IconEye, IconEyeOff, IconLock, IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { authApi } from '@/lib/api/auth';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password');

  // Password requirements
  const requirements = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /[a-z]/, text: 'One lowercase letter' },
    { regex: /[A-Z]/, text: 'One uppercase letter' },
    { regex: /[0-9]/, text: 'One number' },
    { regex: /[^a-zA-Z0-9]/, text: 'One special character' },
  ];

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link. Please request a new one.");
      router.push('/auth/forgot-password');
      return;
    }

    // Optionally validate token with API
    const validateToken = async () => {
      try {
        const response = await authApi.validateResetToken(token);
        
        if (response.data.valid) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
        }
      } catch (error) {
        // If validation endpoint fails, assume token might still be valid
        // The actual reset will fail if token is invalid
        setIsValidToken(true);
      }
    };

    validateToken();
  }, [token, router]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) return;

    setIsLoading(true);
    
    try {
      await authApi.resetPassword(token, data.password);
      
      setIsSuccess(true);
      toast.success("Password reset successfully!");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/sign-in');
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to reset password';
      
      if (error.response?.status === 404) {
        toast.error("This reset link is invalid or has expired. Please request a new one.");
        setTimeout(() => {
          router.push('/auth/forgot-password');
        }, 3000);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="box p-3 md:p-4 xl:p-6 max-w-md mx-auto">
        <div className="box bg-primary/5 dark:bg-bg3 lg:p-6 xl:p-8 border border-n30 dark:border-n500 text-center">
          <div className="mx-auto mb-4 bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center">
            <IconCircleCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="h3 mb-4">Password Reset Successful</h3>
          <p className="text-sm md:text-base mb-6">
            Your password has been reset successfully. You will be redirected to the login page in a few seconds.
          </p>
          <Link href="/auth/sign-in" className="btn-primary px-5 inline-block text-center">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div className="box p-3 md:p-4 xl:p-6 max-w-md mx-auto">
        <div className="box bg-primary/5 dark:bg-bg3 lg:p-6 xl:p-8 border border-n30 dark:border-n500 text-center">
          <div className="mx-auto mb-4 bg-red-100 dark:bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center">
            <IconCircleX className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="h3 mb-4">Invalid Link</h3>
          <p className="text-sm md:text-base mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link href="/auth/forgot-password" className="btn-primary px-5 inline-block text-center">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="box p-3 md:p-4 xl:p-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="box bg-primary/5 dark:bg-bg3 lg:p-6 xl:p-8 border border-n30 dark:border-n500">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-fit">
              <IconLock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="h3 mb-2">Reset your password</h3>
            <p className="text-sm md:text-base text-n500 dark:text-n400">
              Enter your new password below
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="md:text-lg font-medium block mb-4">
                New Password
              </label>
              <div className={`bg-n0 dark:bg-bg4 border ${
                errors.password ? 'border-red-500' : 'border-n30 dark:border-n500'
              } rounded-3xl px-3 md:px-6 py-2 md:py-3 mb-2 relative`}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-11/12 text-sm bg-transparent"
                  placeholder="Enter new password"
                  id="password"
                  {...register('password')}
                  disabled={isLoading}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute ltr:right-5 rtl:left-5 top-1/2 cursor-pointer -translate-y-1/2"
                >
                  {showPassword ? <IconEye /> : <IconEyeOff />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mb-3">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="md:text-lg font-medium block mb-4">
                Confirm Password
              </label>
              <div className={`bg-n0 dark:bg-bg4 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-n30 dark:border-n500'
              } rounded-3xl px-3 md:px-6 py-2 md:py-3 mb-2 relative`}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-11/12 text-sm bg-transparent"
                  placeholder="Confirm new password"
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  disabled={isLoading}
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute ltr:right-5 rtl:left-5 top-1/2 cursor-pointer -translate-y-1/2"
                >
                  {showConfirmPassword ? <IconEye /> : <IconEyeOff />}
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mb-3">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Password requirements */}
          {password && (
            <div className="mt-4 p-4 bg-n20 dark:bg-bg4 rounded-lg">
              <p className="text-sm font-medium mb-2">Password requirements:</p>
              {requirements.map((req, index) => {
                const isValid = req.regex.test(password);
                return (
                  <div key={index} className="flex items-center gap-2 text-sm mb-1">
                    {isValid ? (
                      <IconCircleCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <IconCircleX className="h-4 w-4 text-n400" />
                    )}
                    <span className={isValid ? 'text-green-600 dark:text-green-400' : 'text-n600 dark:text-n400'}>
                      {req.text}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4">
            <button 
              type="submit" 
              className="btn-primary px-5 w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
            
            <Link href="/auth/sign-in" className="text-primary text-sm hover:underline text-center">
              Back to sign in
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}