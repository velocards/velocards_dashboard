"use client";
import Link from "next/link";

const MessageBtn = ({ isWhite }: { isWhite?: boolean }) => {
  return (
    <Link
      href="/private/chat"
      className={`w-10 h-10 md:w-12 md:h-12 max-[420px]:hidden shrink-0 flex items-center justify-center rounded-full relative bg-primary/5 dark:bg-bg3 border border-n30 dark:border-n500`}>
      <i className="lab la-facebook-messenger"></i>
      <span className="absolute w-5 h-5 text-n0 flex items-center justify-center rounded-full text-xs bg-primary -top-1 -right-1">
        3
      </span>
    </Link>
  );
};

export default MessageBtn;
