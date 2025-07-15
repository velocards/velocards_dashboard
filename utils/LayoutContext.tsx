"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { themeConfig } from "./themeConfig";

export type Layout = "vertical" | "horizontal" | "hovered" | "two-column" | "detached";
type Direction = "ltr" | "rtl";

interface LayoutContextType {
  layout: Layout;
  changeLayout: (newLayout: Layout) => void;
  dir: Direction;
  changeDir: (newDir: Direction) => void;
}

const LayoutContext = createContext<LayoutContextType | null>(null);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [dir, setDir] = useState<Direction>(() => {
    if (typeof window !== "undefined") {
      return (themeConfig.direction as Direction) || (localStorage.getItem("dir") as Direction) || "ltr";
    }
    return "ltr";
  });

  const [layout, setLayout] = useState<Layout>(() => {
    if (typeof window !== "undefined") {
      return (themeConfig.layout as Layout) || (localStorage.getItem("layout") as Layout) || "vertical";
    }
    return "vertical";
  });

  const changeDir = (newDir: Direction) => {
    setDir(newDir);
    localStorage.setItem("dir", newDir);
  };

  const changeLayout = (newLayout: Layout) => {
    setLayout(newLayout);
    localStorage.setItem("layout", newLayout);
  };

  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);

  const contextValue: LayoutContextType = {
    layout,
    changeLayout,
    dir,
    changeDir,
  };

  return <LayoutContext.Provider value={contextValue}>{children}</LayoutContext.Provider>;
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
