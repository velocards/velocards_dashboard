"use client";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { themeConfig } from "./themeConfig";
import { useEffect, useState } from "react";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const defaultTheme = themeConfig.theme || "light";
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <NextThemeProvider enableSystem={false} defaultTheme={defaultTheme} attribute="class">
      {children}
    </NextThemeProvider>
  );
};

export default ThemeProvider;
