"use client";
import { useState } from "react";

const Switch = ({
  isChecked = false,
  label,
}: {
  isChecked?: boolean;
  label: string;
}) => {
  const [checked, setChecked] = useState(isChecked);
  return (
    <div className="flex items-center justify-center">
      <label htmlFor={label} className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id={label}
            onChange={() => setChecked(!checked)}
            defaultChecked={checked}
            className="sr-only"
          />
          <div
            className={`block ${
              checked ? "bg-primary" : "bg-primary/20"
            } w-14 h-8 rounded-full`}></div>
          <div
            className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
              checked && "translate-x-full"
            }`}></div>
        </div>
      </label>
    </div>
  );
};

export default Switch;
