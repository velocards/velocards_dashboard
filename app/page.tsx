"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { VeloCardsLogo } from "@/components/icons/VeloCardsLogo";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to sign in page
    router.push("/auth/sign-in");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <VeloCardsLogo width={120} height={80} className="mx-auto mb-4" />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}