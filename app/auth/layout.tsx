"use client";
import ellipse1 from "@/public/images/ellipse1.png";
import ellipse2 from "@/public/images/ellipse2.png";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { ToastContainer } from "react-toastify";
import { VeloCardsLogoWithText } from "@/components/icons/VeloCardsLogo";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // For auth pages, check auth status once
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    // Add a small delay to prevent flashing
    if (!isLoading && isAuthenticated) {
      const timer = setTimeout(() => {
        router.push("/dashboard/");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-secondary/5 dark:bg-bg3">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render auth pages if authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-secondary/5 dark:bg-bg3">
      <Image src={ellipse1} className="absolute top-16 md:top-5 right-10 w-auto h-auto" alt="ellipse" />
      <Image src={ellipse2} className="absolute bottom-6 left-0 sm:left-32 w-auto h-auto" alt="ellipse" />
      <div className="absolute top-0 left-0 p-6 lg:p-8 z-[10]">
        <VeloCardsLogoWithText showTagline={true} />
      </div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative z-[2] max-w-[1416px] mx-auto px-3 pb-10">{children}</div>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}
