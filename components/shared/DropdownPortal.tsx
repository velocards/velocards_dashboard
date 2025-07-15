"use client";
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface DropdownPortalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  children: React.ReactNode;
}

export default function DropdownPortal({ isOpen, onClose, triggerRef, children }: DropdownPortalProps) {
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = 300; // Approximate height
      const windowHeight = window.innerHeight;
      
      // Calculate position
      let top = rect.bottom + 4;
      let left = rect.right - 192; // 192px is the dropdown width (w-48)
      
      // If dropdown would go off bottom of screen, position it above
      if (top + dropdownHeight > windowHeight) {
        top = rect.top - dropdownHeight - 4;
      }
      
      // Ensure it doesn't go off the left edge
      if (left < 8) {
        left = 8;
      }
      
      setPosition({ top, left });
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      className="fixed w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[9999]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {children}
    </div>,
    document.body
  );
}