"use client";
import Link from "next/link";
import { VeloCardsLogo } from "@/components/icons/VeloCardsLogo";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <VeloCardsLogo width={100} height={70} className="mb-8" />
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-md">
        The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      <Link 
        href="/dashboard" 
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
