"use client";
import cn from "@/utils/cn";
import useDropdown from "@/utils/useDropdown";

const MobileSearch = ({ btnClass }: { btnClass?: string }) => {
  const { open, ref, toggleOpen } = useDropdown();
  return (
    <div className="relative lg:hidden" ref={ref}>
      <button onClick={toggleOpen} className={cn("border select-none cursor-pointer bg-primary/5 dark:bg-bg3 border-n30  dark:border-n500 flex justify-center items-center gap-2 rounded-full w-10 h-10 md:w-12 md:h-12", btnClass)}>
        <i className="las la-search"></i>
      </button>
      <div className={cn("absolute flex gap-3 z-20 top-full invisible duration-300 origin-top min-w-max max-w-[250px] shadow-[0px_6px_30px_0px_rgba(0,0,0,0.08)] opacity-0 overflow-y-auto -left-[50px]  bg-n0 dark:bg-bg4 p-3 rounded-md ", { "flex visible opacity-100 translate-y-4": open }, { "invisible opacity-0 -translate-y-full": !open })}>
        <form onSubmit={(e) => e.preventDefault()} className={cn("bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 flex gap-3 rounded-[30px]  focus-within:border-primary p-1 xxl:p-2 items-center justify-between  w-full")}>
          <input type="text" placeholder="Search" className="bg-transparent ltr:pl-4 rtl:pr-4 py-1  w-full" />
          <button className="bg-primary shrink-0 rounded-full w-7 h-7 lg:w-8 lg:h-8 flex justify-center items-center text-n0">
            <i className="las la-search text-lg"></i>
          </button>
        </form>
      </div>
    </div>
  );
};
export default MobileSearch;
