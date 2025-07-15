"use client";
import cn from "@/utils/cn";
import useDropdown from "@/utils/useDropdown";
import { IconChevronDown } from "@tabler/icons-react";
import { ReactNode } from "react";
type Props = {
  items: string[];
  selected?: string;
  setSelected: (item: string) => void;
  btnClass?: string;
  contentClass?: string;
  img?: ReactNode;
};
const Select = ({ items, selected = "Select Option", setSelected, btnClass, contentClass, img }: Props) => {
  const { open, ref, toggleOpen } = useDropdown();
  return (
    <div className="relative" ref={ref}>
      <div onClick={toggleOpen} className={cn("border select-none cursor-pointer bg-primary/5 dark:bg-bg3 border-n30 text-sm md:text-base dark:border-n500 flex gap-2 justify-between items-center rounded-xl px-3 py-1.5 sm:px-4 sm:py-2", btnClass)}>
        <div className="flex items-center gap-2 text-sm">
          {img}
          {selected}{" "}
        </div>
        <IconChevronDown size={20} className={`duration-300 ${open && "rotate-180"}`} />
      </div>
      <ul className={cn("absolute flex-col z-20 top-full invisible duration-300 origin-top min-w-max shadow-[0px_6px_30px_0px_rgba(0,0,0,0.08)] opacity-0 max-h-40 overflow-y-auto right-0  bg-n0 dark:bg-bg4 p-1 rounded-md ", { "flex visible opacity-100 scale-100": open }, { " invisible opacity-0 scale-0": !open }, contentClass)}>
        {items.map((item) => (
          <li
            onClick={() => {
              setSelected(item);
              toggleOpen();
            }}
            key={item}
            className={`px-4 py-2 cursor-pointer text-sm rounded-md duration-300 ${selected == item && "bg-primary/5 text-primary"}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Select;
