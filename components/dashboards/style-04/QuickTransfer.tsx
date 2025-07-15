"use client";
import OptionsHorizontal from "@/components/shared/OptionsHorizontal";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const QuickTransfer = () => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="box mb-4 xxl:mb-6">
      <div className="bb-dashed pb-4 mb-4 lg:mb-6 lg:pb-6 flex justify-between items-center">
        <p className="font-medium">Quick Transfer</p>
        <OptionsHorizontal />
      </div>
      <div className="bb-dashed pb-4 mb-4 lg:mb-6 lg:pb-6 flex flex-col">
        <div
          className={`box border border-n30 dark:border-n500 bg-primary/5 dark:bg-bg3 xl:p-3 xxl:p-4  ${
            flipped ? "order-3" : "order-1"
          }`}
        >
          <div className="flex justify-between gap-3 bb-dashed items-center text-sm mb-4 pb-4">
            <p>Spend</p>
            <p>Balance : 10,000 USD</p>
          </div>
          <div className="flex justify-between items-center text-xl gap-4 font-medium">
            <input
              type="number"
              className="w-20 bg-transparent"
              placeholder="0.00"
            />
            <p className="shrink-0">$ USD</p>
          </div>
        </div>
        <button
          onClick={() => setFlipped((prev) => !prev)}
          className="p-2 border order-2 border-n30 dark:border-n500 self-center -my-4 relative z-[2] rounded-lg bg-n0 dark:bg-bg4 text-primary"
        >
          <i className="las la-exchange-alt rotate-90"></i>
        </button>
        <div
          className={`box border border-n30 dark:border-n500 bg-primary/5 dark:bg-bg3 xl:p-3 xxl:p-4  ${
            flipped ? "order-1" : "order-3"
          }`}
        >
          <div className="flex justify-between gap-3 bb-dashed items-center text-sm mb-4 pb-4">
            <p>Receive</p>
            <p>Balance : 10,000 USD</p>
          </div>
          <div className="flex justify-between items-center text-xl gap-4 font-medium">
            <input
              type="number"
              className="w-20 bg-transparent"
              placeholder="0.00"
            />
            <p className="shrink-0">€ EURO</p>
          </div>
        </div>
      </div>
      <div>
        <p className="text-lg font-medium mb-6">Payment Method</p>
        <div className="border border-primary border-dashed bg-primary/5 rounded-lg p-3 flex items-center gap-4 mb-6 lg:mb-8">
          <Image
            src="/images/card-sm-1.png"
            width={60}
            height={40}
            alt="card"
          />
          <div>
            <p className="font-medium mb-1">John Snow - Metal</p>
            <span className="text-xs">**4291 - Exp: 12/26</span>
          </div>
        </div>
        <Link href="#" className="btn-primary flex justify-center w-full">
          Sent Now
        </Link>
      </div>
    </div>
  );
};

export default QuickTransfer;
