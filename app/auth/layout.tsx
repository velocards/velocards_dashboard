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
import VeloCardsLoader from "@/components/shared/VeloCardsLoader";

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
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard/");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return <VeloCardsLoader />;
  }

  // Show loading overlay while redirecting authenticated users
  if (isAuthenticated) {
    return <VeloCardsLoader message="Redirecting to dashboard..." />;
  }

  return (
    <div className="relative min-h-screen bg-secondary/5 dark:bg-bg3 overflow-hidden">
      {/* Abstract shapes - hidden on smaller screens, scaled down on medium screens */}
      <Image 
        src={ellipse1} 
        className="absolute top-16 md:top-5 right-10 w-auto h-auto hidden lg:block lg:scale-75 xl:scale-100 opacity-60 xl:opacity-100" 
        alt="ellipse" 
      />
      <Image 
        src={ellipse2} 
        className="absolute bottom-6 left-0 sm:left-32 w-auto h-auto hidden lg:block lg:scale-75 xl:scale-100 opacity-60 xl:opacity-100" 
        alt="ellipse" 
      />
      
      {/* Logo - responsive positioning */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-[10]">
        <VeloCardsLogoWithText showTagline={true} className="scale-90 sm:scale-100" />
      </div>
      
      {/* Main content - better padding and max-width */}
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="relative z-[2] w-full max-w-[1200px] mx-auto py-20 sm:py-16">{children}</div>
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
