"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IconMail, IconArrowLeft } from "@tabler/icons-react";
import { authApi } from "@/lib/api/auth";

export default function VerifyRequiredPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      router.push("/auth/sign-in");
    }
  }, [email, router]);

  const handleResendVerification = async () => {
    console.log('🔄 Resend verification clicked for email:', email);
    setIsResending(true);
    setResendMessage(null);
    
    try {
      console.log('📧 Sending verification email...');
      await authApi.resendVerification(email);
      console.log('✅ Verification email sent successfully');
      setResendMessage({ 
        type: 'success', 
        text: 'Verification email sent! Please check your inbox.' 
      });
    } catch (error: any) {
      console.error('❌ Failed to resend verification:', error);
      console.error('❌ Error details:', error.response?.data);
      setResendMessage({ 
        type: 'error', 
        text: error.response?.data?.error?.message || 'Failed to send verification email' 
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 pt-20 md:pt-32">
      <div className="max-w-lg w-full">
        <div className="box p-6 md:p-8">
          {/* Icon */}
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconMail className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>

          {/* Title */}
          <h1 className="text-xl md:text-2xl font-bold text-center mb-3">
            Email Verification Required
          </h1>

          {/* Alert Message */}
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Account not verified
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>
                    Your account needs to be verified before you can access the dashboard. 
                    Please check your email and click the verification link.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Display */}
          <div className="text-center mb-4">
            <p className="text-gray-600 dark:text-gray-400 mb-1 text-sm">
              We sent a verification email to:
            </p>
            <p className="text-base md:text-lg font-medium text-primary">
              {decodeURIComponent(email)}
            </p>
          </div>

          {/* Help Text */}
          <p className="text-xs md:text-sm text-gray-500 text-center mb-6">
            Didn't receive the email? Check your spam folder or request a new one.
          </p>

          {/* Resend Message */}
          {resendMessage && (
            <div className={`mb-4 p-2 rounded-lg text-sm text-center ${
              resendMessage.type === 'success' 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            }`}>
              {resendMessage.text}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="btn-primary w-full py-2.5 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Sending..." : "Resend Verification Email"}
            </button>

            <Link
              href="/auth/sign-in"
              className="btn-outline w-full py-2.5 flex items-center justify-center gap-2"
            >
              <IconArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>

          {/* Footer Links */}
          <div className="mt-4 text-center text-xs">
            <p className="text-gray-500">
              Need help?{" "}
              <Link href="/support" className="text-primary hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}