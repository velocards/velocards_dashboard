"use client";
import cn from "@/utils/cn";

const SearchBar = ({ search, classes }: { search: (term: string) => void; classes?: string }) => {
  return (
    <form onSubmit={(e) => e.preventDefault()} className={cn("bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 flex gap-3 rounded-[30px]  focus-within:border-primary p-1 xxl:p-2 items-center justify-between max-w-[200px] xxl:max-w-[319px] w-full", classes)}>
      <input type="text" placeholder="Search" onChange={(e) => search(e.target.value)} className="bg-transparent text-sm ltr:pl-4 rtl:pr-4 py-1  w-full" />
      <button className="bg-primary shrink-0 rounded-full w-7 h-7 lg:w-8 lg:h-8 flex justify-center items-center text-n0">
        <i className="las la-search text-lg"></i>
      </button>
    </form>
  );
};

export default SearchBar;
