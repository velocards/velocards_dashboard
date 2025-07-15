"use client";
import { Layout, useLayout } from "@/utils/LayoutContext";
import useDropdown from "@/utils/useDropdown";

export const layoutlist: Layout[] = ["vertical", "two-column", "hovered", "horizontal", "detached"];

const SelectLayout = () => {
  const { open, ref, toggleOpen } = useDropdown();
  const { layout, changeLayout } = useLayout();
  return (
    <div ref={ref} className="relative max-w-[232px] w-full max-sm:hidden z-[999]">
      <div onClick={toggleOpen} className={`bg-primary/5 dark:bg-bg3 border border-n30 dark:border-n500 cursor-pointer w-full rounded-[30px] py-1 xxl:py-1.5 flex items-center justify-between gap-2 px-4 xxl:px-6`}>
        <span className="flex items-center capitalize font-medium gap-2 select-none">
          <i className="las la-border-all text-primary text-3xl"></i>
          {layout}
        </span>
        <i className={`shrink-0 las text-lg la-angle-down ${open && "rotate-180"} duration-300`}></i>
      </div>
      <ul className={`absolute top-full bg-n0 dark:bg-bg4 duration-300 origin-top shadow-[0px_6px_30px_0px_rgba(0,0,0,0.08)] rounded-lg z-[9999] left-0 p-2 w-full ${open ? "opacity-100 scale-100 visible" : "opacity-0 scale-0 invisible"}`}>
        {layoutlist.map((item) => (
          <li
            onClick={() => {
              changeLayout(item);
              toggleOpen();
            }}
            className={`p-2 block select-none capitalize rounded-md hover:text-primary cursor-pointer duration-300 ${layout == item ? "bg-primary text-n0 hover:!text-n0" : ""}`}
            key={item}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectLayout;
