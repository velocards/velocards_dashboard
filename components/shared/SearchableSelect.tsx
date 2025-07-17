"use client";
import cn from "@/utils/cn";
import useDropdown from "@/utils/useDropdown";
import { IconChevronDown, IconSearch } from "@tabler/icons-react";
import { ReactNode, useState, useEffect, useRef } from "react";

type Props = {
  items: string[];
  selected?: string;
  setSelected: (item: string) => void;
  btnClass?: string;
  contentClass?: string;
  img?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
};

const SearchableSelect = ({ 
  items, 
  selected = "Select Option", 
  setSelected, 
  btnClass, 
  contentClass, 
  img,
  placeholder = "Type to search...",
  disabled = false
}: Props) => {
  const { open, ref, toggleOpen } = useDropdown();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter items based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = items.filter(item => 
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchTerm, items]);

  // Handle keyboard input when dropdown is open
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore special keys
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      
      // Handle escape
      if (e.key === 'Escape') {
        toggleOpen();
        return;
      }
      
      // Handle backspace
      if (e.key === 'Backspace') {
        e.preventDefault();
        setSearchTerm(prev => prev.slice(0, -1));
        return;
      }
      
      // Handle normal character input
      if (e.key.length === 1) {
        e.preventDefault();
        setSearchTerm(prev => prev + e.key);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, toggleOpen]);

  return (
    <div className="relative" ref={ref}>
      <div 
        onClick={() => !disabled && toggleOpen()} 
        className={cn(
          "border select-none cursor-pointer bg-primary/5 dark:bg-bg3 border-n30 text-sm md:text-base dark:border-n500 flex gap-2 justify-between items-center rounded-xl px-3 py-1.5 sm:px-4 sm:py-2", 
          btnClass,
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex items-center gap-2 text-sm">
          {img}
          {selected}
        </div>
        <IconChevronDown size={20} className={`duration-300 ${open && "rotate-180"}`} />
      </div>
      
      <div className={cn(
        "absolute flex-col z-20 top-full invisible duration-300 origin-top min-w-max shadow-[0px_6px_30px_0px_rgba(0,0,0,0.08)] opacity-0 right-0 bg-n0 dark:bg-bg4 rounded-md", 
        { "flex visible opacity-100 scale-100": open }, 
        { "invisible opacity-0 scale-0": !open }, 
        contentClass
      )}>
        {/* Search Display */}
        <div className="p-2 border-b border-n30 dark:border-n500">
          <div className="relative">
            <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-n300 dark:text-n400" />
            <div className="w-full pl-10 pr-3 py-2 text-sm bg-n10 dark:bg-bg3 border border-n30 dark:border-n500 rounded-lg">
              {searchTerm ? (
                <span className="text-gray-900 dark:text-gray-100">{searchTerm}</span>
              ) : (
                <span className="text-gray-400 dark:text-gray-500">{placeholder}</span>
              )}
              {searchTerm && (
                <span className="animate-pulse">|</span>
              )}
            </div>
          </div>
        </div>

        {/* Items List */}
        <ul className="max-h-60 overflow-y-auto p-1">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                onClick={() => {
                  setSelected(item);
                  toggleOpen();
                }}
                key={item}
                className={cn(
                  "px-4 py-2 cursor-pointer text-sm rounded-md duration-300 hover:bg-primary/10",
                  selected === item && "bg-primary/5 text-primary"
                )}
              >
                {item}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-n400 dark:text-n500 text-center">
              No results found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchableSelect;