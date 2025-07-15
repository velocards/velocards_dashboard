"use client";
import Select from "@/components/shared/Select";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
const options = ["Visa", "Payoneer", "Mastercard"];

const cardDetails = {
  "Card Type": "Visa",
  "Card Holder": "Felecia Brown",
  Expires: "12/27",
  "Card Number": "325 541 565 546",
  "Total Balance": "99,245.54 USD",
  "Total Debt": "9,546.45 USD",
};

const AccountDetails = () => {
  const [selectedCard, setSelectedCard] = useState(options[0]);
  return (
    <div className="box col-span-12 md:col-span-5 xxl:col-span-4">
      <div className="bb-dashed pb-4 mb-4 lg:mb-6 lg:pb-6 flex justify-between items-center">
        <h4 className="h4">Account Details</h4>
        <Select items={options} setSelected={setSelectedCard} selected={selectedCard} btnClass="rounded-[30px]" contentClass="w-full min-w-max" img={<Image src="/images/mastercard.png" width={20} height={20} alt="img" />} />
      </div>
      <div className="bb-dashed pb-4 mb-4 lg:mb-6 lg:pb-6 flex flex-col">
        <div className="bg-primary p-4 lg:px-6 lg:py-5 rounded-xl text-n0 relative overflow-hidden after:absolute after:rounded-full after:w-[300px] after:h-[300px] after:bg-[#FFC861] after:top-[40%] after:ltr:left-[65%] after:rtl:right-[65%] mb-6 lg:mb-8">
          <div className="flex justify-between items-start mb-14">
            <div>
              <p className="text-xs mb-1">Current Balance</p>
              <h4 className="h4">80,700.00 USD</h4>
            </div>
            <Image src="/images/visa-sm.png" width={45} height={16} className="w-auto h-auto" alt="visa icon" />
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="mb-1">Felecia Brown</p>
              <p className="text-xs">•••• •••• •••• 8854</p>
            </div>
            <p className="text-n700 relative z-[1]">12/27</p>
          </div>
        </div>
        <ul className="flex flex-col gap-4">
          {Object.entries(cardDetails).map(([key, value]) => (
            <li key={key} className="flex justify-between">
              <span>{key}:</span> <span className="font-medium">{value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-lg font-medium mb-6">Active card</p>
        <div className="border border-primary border-dashed bg-primary/5 justify-between dark:bg-bg3 rounded-lg p-3 flex items-center gap-4 mb-6 lg:mb-8">
          <div className="grow flex items-center gap-4">
            <Image src="/images/card-sm-1.png" width={60} height={40} alt="card" />
            <div>
              <p className="font-medium mb-1">John Snow - Metal</p>
              <span className="text-xs">**4291 - Exp: 12/26</span>
            </div>
          </div>
          <p>= 10,000 BTC</p>
        </div>
        <Link href="#" className="text-primary font-semibold flex items-center gap-2  mb-6 lg:mb-8 bb-dashed pb-6">
          More Card <i className="las la-arrow-right"></i>
        </Link>
        <div className="flex gap-4 lg:gap-6">
          <Link href="#" className="btn-primary flex justify-center w-full lg:py-2.5">
            Pay Debt
          </Link>
          <Link href="#" className="btn-outline flex justify-center w-full lg:py-2.5">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
