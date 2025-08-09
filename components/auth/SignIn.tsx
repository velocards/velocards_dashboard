"use client";
import { IconEye, IconEyeOff, IconBrandGoogle } from "@tabler/icons-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/authStore";
import { useTwoFactorStore } from "@/stores/twoFactorStore";
import { tokenManager } from "@/lib/api/secureClient";
import CloudflareTurnstile, { TurnstileRef } from "./CloudflareTurnstile";
import AuthPageVisual from "./AuthPageVisual";
import TwoFactorVerification from "@/components/security/TwoFactorVerification";

// Form validation schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email({ message: "Invalid email address" }),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const SignIn = () => {
  const [showPass, setShowPass] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string>("");
  const { login, isLoading, error, clearError, requiresTwoFactor, pendingUser, clearPendingTwoFactor } = useAuthStore();
  const { verify2FA } = useTwoFactorStore();
  const [is2FALoading, setIs2FALoading] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileRef>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    if (!turnstileToken) {
      // Can't use toast, show inline error instead
      return;
    }

    try {
      clearError();
      setLoginError("");
      // Include captcha token with login data
      await login({ ...data, captchaToken: turnstileToken });
      
      // Don't redirect here - let the auth layout handle it
      // This prevents multiple redirects and loading states
    } catch (err: any) {
      // Email verification errors are handled by the auth store
      // Only handle other errors here
      const errorMessage = 
        err?.response?.data?.error?.message || 
        err?.response?.data?.message || 
        err?.message || 
        error || 
        'Login failed. Please check your credentials.';
      
      setLoginError(errorMessage);
      
      // Reset captcha on error
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
      setTurnstileToken(null);
    }
  };


  const handleGoogleSignIn = () => {
    // Redirect to backend Google OAuth endpoint
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.velocards.com/api/v1';
    window.location.href = `${apiUrl}/auth/google`;
  };
  
  const handleTwoFactorVerify = async (code: string, isBackupCode?: boolean) => {
    setIs2FALoading(true);
    setTwoFactorError(null);
    
    try {
      // Call the 2FA verification endpoint
      const result = await verify2FA(code, isBackupCode);
      
      // Store tokens if provided
      if (result.tokens?.accessToken) {
        tokenManager.setToken(result.tokens.accessToken);
      }
      
      // Update auth state
      useAuthStore.setState({
        user: result.user,
        isAuthenticated: true,
        requiresTwoFactor: false,
        pendingUser: null,
      });
      
      // Redirect handled by auth layout
    } catch (error: any) {
      setTwoFactorError(error?.message || 'Invalid verification code');
      throw error;
    } finally {
      setIs2FALoading(false);
    }
  };
  
  const handleCancelTwoFactor = () => {
    clearPendingTwoFactor();
    setTwoFactorError(null);
  };

  // Show 2FA verification if required
  if (requiresTwoFactor && pendingUser) {
    return (
      <div className="box p-3 sm:p-4 md:p-6 xl:p-8">
        <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-stretch">
          <div className="col-span-12 lg:col-span-7 xl:col-span-6 flex">
            <div className="box bg-primary/5 dark:bg-bg3 p-4 sm:p-6 lg:p-8 xl:p-10 border border-n30 dark:border-n500 w-full">
              <TwoFactorVerification
                onVerify={handleTwoFactorVerify}
                onCancel={handleCancelTwoFactor}
                isLoading={is2FALoading}
                error={twoFactorError}
              />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 xl:col-span-6 hidden lg:block">
            <AuthPageVisual />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="box p-3 sm:p-4 md:p-6 xl:p-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-stretch">
        <div className="col-span-12 lg:col-span-7 xl:col-span-6 flex">
          <div className="box bg-primary/5 dark:bg-bg3 p-4 sm:p-6 lg:p-8 xl:p-10 border border-n30 dark:border-n500 w-full">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Signing in...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <h3 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4">Welcome Back!</h3>
              <p className="mb-4 pb-4 sm:mb-6 sm:pb-6 bb-dashed text-sm sm:text-base">
                Sign in to your account and join us
              </p>
          
          {/* Show API error if any */}
          {(error || loginError) && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {loginError || error}
            </div>
          )}
          
          <label htmlFor="email" className="text-base sm:text-lg font-medium block mb-3 sm:mb-4">
            Enter Your Email ID
          </label>
          <input
            type="email"
            className={`w-full text-sm sm:text-base bg-n0 dark:bg-bg4 border ${
              errors.email ? 'border-red-500' : 'border-n30 dark:border-n500'
            } rounded-3xl px-4 sm:px-6 py-2.5 sm:py-3 mb-2`}
            placeholder="Enter Your Email"
            id="email"
            {...register("email")}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mb-3">{errors.email.message}</p>
          )}
          
          <label
            htmlFor="password"
            className="text-base sm:text-lg font-medium block mb-3 sm:mb-4 mt-3"
          >
            Enter Your Password
          </label>
          <div className={`bg-n0 dark:bg-bg4 border ${
            errors.password ? 'border-red-500' : 'border-n30 dark:border-n500'
          } rounded-3xl px-4 sm:px-6 py-2.5 sm:py-3 mb-2 relative`}>
            <input
              type={showPass ? "text" : "password"}
              className="w-11/12 text-sm sm:text-base bg-transparent"
              placeholder="Enter Your Password"
              id="password"
              {...register("password")}
              disabled={isLoading}
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute ltr:right-5 rtl:left-5 top-1/2 cursor-pointer -translate-y-1/2"
            >
              {showPass ? <IconEye /> : <IconEyeOff />}
            </span>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mb-3">{errors.password.message}</p>
          )}

          <Link href="/auth/forgot-password" className="flex justify-end text-primary">
            Forgot Password
          </Link>
          <p className="mt-3">
            Don&apos;t have an account?{" "}
            <Link className="text-primary" href="/auth/sign-up">
              Signup
            </Link>
          </p>
          
          {/* Cloudflare Turnstile */}
          <CloudflareTurnstile
            ref={turnstileRef}
            onVerify={(token) => setTurnstileToken(token)}
            onError={() => {
              // Can't use toast, error will be shown in form
              setTurnstileToken(null);
            }}
            onExpire={() => {
              setTurnstileToken(null);
            }}
          />
          
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3">
                <button 
                  type="submit" 
                  className="w-full sm:w-auto btn-primary px-6 py-2.5 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !turnstileToken}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
                
                <span className="text-gray-500 hidden sm:inline">or</span>
                
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 border border-n30 dark:border-n500 rounded-3xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <IconBrandGoogle className="w-5 h-5" />
                  <span>Sign in with Google</span>
                </button>
              </div>
            </form>
          )}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 xl:col-span-6 hidden lg:block">
          <AuthPageVisual />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
