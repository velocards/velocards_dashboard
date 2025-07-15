import "@/public/fonts/css/line-awesome.min.css";
import "@/public/scss/style.scss";
import { LayoutProvider } from "@/utils/LayoutContext";
import ThemeProvider from "@/utils/ThemeProvider";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Next13NProgress } from "nextjs13-progress";
import "react-toastify/ReactToastify.min.css";
import "hint.css/hint.min.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VeloCards - Virtual Cards for Modern Digital Payments | by DigiStreets",
  description: "VeloCards by DigiStreets - Secure virtual credit cards for online shopping, subscriptions, and digital payments. Create unlimited cards instantly.",
  keywords: ["Virtual Cards", "Credit Cards", "Online Payments", "Digital Banking", "FinTech", "VeloCards", "DigiStreets", "Secure Payments"],
  icons: {
    icon: "/images/velocards-logo.png",
    shortcut: "/images/velocards-logo.png",
    apple: "/images/velocards-logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className={`${inter.className} text-n500 dark:text-n30`}>
        <ThemeProvider>
          <LayoutProvider>
            <Next13NProgress color="#20B757" height={3} />
            {children}
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
