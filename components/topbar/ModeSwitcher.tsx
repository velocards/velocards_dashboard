"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ModeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const handleThemeSwitch = () => {
    theme == "light" ? setTheme("dark") : setTheme("light");
  };
  return (
    <button aria-label="dark mode switch" onClick={handleThemeSwitch} className={`w-10 h-10 md:w-12 shrink-0 md:h-12 rounded-full bg-primary/5 dark:bg-bg3 border border-n30 dark:border-n500`}>
      {theme == "light" ? <i className="las la-moon text-2xl"></i> : <i className="las la-sun text-2xl"></i>}
    </button>
  );
};

export default ModeSwitcher;
