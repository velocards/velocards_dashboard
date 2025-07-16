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
import VeloCardsLoader from "@/components/shared/VeloCardsLoader";

export default function TestLayout({ children }: { children: ReactNode }) {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check auth status when component mounts
    checkAuth();
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/sign-in");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return <VeloCardsLoader />;
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
