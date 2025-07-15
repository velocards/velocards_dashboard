import { useLayout } from "@/utils/LayoutContext";
import cn from "@/utils/cn";
import { useTheme } from "next-themes";
import { Dispatch, SetStateAction } from "react";
import { layoutlist } from "../topbar/SelectLayout";

type customizerTypes = {
  customizerOpen: boolean;
  setCustomizerOpen: Dispatch<SetStateAction<boolean>>;
};
const Customizer = ({ customizerOpen, setCustomizerOpen }: customizerTypes) => {
  const { theme, setTheme } = useTheme();
  const { dir, changeDir, layout, changeLayout } = useLayout();

  return (
    <>
      <button onClick={() => setCustomizerOpen(true)} className="fixed ltr:right-4 rtl:left-4 z-50 top-1/2 bg-primary text-n0 w-10 h-10 rounded-full flex items-center justify-center">
        <i className="las la-cog animate-spin-slow"></i>
      </button>
      <div
        onClick={() => setCustomizerOpen(false)}
        className={cn("z-[60] duration-500", {
          "fixed inset-0 bg-n900 bg-opacity-20": customizerOpen,
        })}
      >
        <aside onClick={(e) => e.stopPropagation()} className={`w-[280px] xxxl:w-[336px] shadow-sm z-[52] ${customizerOpen ? "translate-x-0 visible" : "ltr:translate-x-full rtl:-translate-x-full invisible"} duration-300 fixed ltr:right-0 rtl:left-0 h-full bg-n0 dark:bg-bg4 top-0`}>
          <div className="p-4 flex justify-between items-center border-b border-n30 dark:border-n500">
            <div>
              <h5 className="h5 mb-2">Theme customizer</h5>
              <p className="text-sm">Customize & Preview in Real Time</p>
            </div>
            <button onClick={() => setCustomizerOpen(false)}>
              <i className="las la-times"></i>
            </button>
          </div>
          <div className="p-4 border-b border-n30 dark:border-n500">
            <span className="mb-3 text-n60 block text-sm">Themeing</span>
            <h6 className="h6 mb-3">Mode</h6>
            <div className="flex gap-4">
              <button onClick={() => setTheme("light")} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg", { "bg-primary text-n0": theme == "light" }, { "bg-transparent border border-n500": theme == "dark" })}>
                <i className="las la-sun"></i>
                <span>Light </span>
              </button>
              <button onClick={() => setTheme("dark")} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg", { "bg-primary": theme == "dark" }, { "bg-transparent border border-n30": theme == "light" })}>
                <i className="las la-moon"></i>
                <span>Dark </span>
              </button>
            </div>
          </div>
          <div className="p-4 border-b border-n30 dark:border-n500">
            <span className="mb-3 text-n60 block text-sm">Layout</span>
            <h6 className="h6 mb-3">Direction</h6>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => changeDir("ltr")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg",
                  { "bg-primary text-n0": dir == "ltr" },
                  {
                    "bg-transparent border border-n30 dark:border-n500": dir == "rtl",
                  },
                )}
              >
                <span>LTR</span>
              </button>
              <button
                onClick={() => changeDir("rtl")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg",
                  { "bg-primary text-n0": dir == "rtl" },
                  {
                    "bg-transparent border border-n30 dark:border-n500": dir == "ltr",
                  },
                )}
              >
                <span>RTL</span>
              </button>
            </div>
            <h6 className="h6 mb-3">Sidebar</h6>
            <div className="flex gap-4 flex-wrap">
              {layoutlist.map((singleLayout) => (
                <button onClick={() => changeLayout(singleLayout)} className={cn("border border-n30 dark:border-n500 rounded-lg px-4 py-2", { "bg-primary text-n0": layout == singleLayout })} key={singleLayout}>
                  {singleLayout}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Customizer;
