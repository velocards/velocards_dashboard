"use client";
import Footer from "@/components/shared/Footer";
import Sidebar from "@/components/sidebar/Sidebar";
import Topbar from "@/components/topbar/Topbar";
import cn from "@/utils/cn";
import { ReactNode, useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import EmailVerificationBanner from "@/components/shared/EmailVerificationBanner";
import NotificationModal from "@/components/modals/NotificationModal";

export default function TestLayout({ children }: { children: ReactNode }) {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // Only check auth once when component mounts
    checkAuth();
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/sign-in");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <section className="topbar-container z-10">
        <Topbar setSidebarIsOpen={setSidebarIsOpen} sidebarIsOpen={sidebarIsOpen} />
        <Sidebar sidebarIsOpen={sidebarIsOpen} setSidebarIsOpen={setSidebarIsOpen} />
      </section>
      <div className={cn("main-content", sidebarIsOpen && "has-sidebar")}>
        <div className="main-inner">
          <EmailVerificationBanner />
          {children}
        </div>
      </div>
      <Footer />
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
      />
      <NotificationModal />
    </>
  );
}
