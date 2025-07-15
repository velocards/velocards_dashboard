type ThemeConfig = {
  layout: "vertical" | "horizontal" | "hovered" | "two-column" | "detached" | null;
  direction: "ltr" | "rtl" | null;
  theme: "light" | "dark" | null;
  customizer: boolean;
};

export const themeConfig: ThemeConfig = {
  layout: "detached", // Set default layout to detached
  direction: "ltr", // Set default direction to LTR
  theme: "dark", // Set default theme to dark mode
  customizer: false, // Disable the floating customizer button
};
