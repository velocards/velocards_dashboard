"use client";
import { ReactNode } from "react";

interface ResponsiveTableProps {
  children: ReactNode;
  className?: string;
}

const ResponsiveTable = ({ children, className = "" }: ResponsiveTableProps) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="min-w-[800px]">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveTable;