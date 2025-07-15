"use client";
import cn from "@/utils/cn";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
type Props = {
  toggleOpen: () => void;
  open: boolean;
  children: ReactNode;
  height?: string;
  width?: string;
};
const Modal = ({ children, toggleOpen, open, height, width }: Props) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [open]);
  return createPortal(
    <div onClick={toggleOpen} className={cn("inset-0 fixed flex items-center z-[99] bg-n900/80 opacity-0 invisible duration-500 overflow-y-auto ", { "visible opacity-100": open })}>
      <div onClick={(e) => e.stopPropagation()} className={cn("absolute left-1/2 min-h-[350px] duration-300 max-w-[710px] my-10 modal scale-75 w-[95%] -translate-x-1/2 box xl:p-8 opacity-0 overflow-y-auto max-h-[90vh]", { "scale-100 opacity-100 my-10": open }, width)}>
        <div className="relative">
          <button onClick={toggleOpen} className="absolute top-0 ltr:right-0 rtl:left-0">
            <i className="las la-times"></i>
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
