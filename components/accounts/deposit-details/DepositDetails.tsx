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

const DepositDetails = () => {
  const [selectedCard, setSelectedCard] = useState(options[0]);
  return (
    <div className="box col-span-12 md:col-span-5 lg:col-span-4">
      <div className="bb-dashed border-secondary/30 pb-4 mb-4 lg:mb-6 lg:pb-6 flex justify-between items-center">
        <h4 className="h4">Deposit Details</h4>
        <Select items={options} setSelected={setSelectedCard} selected={selectedCard} btnClass="rounded-[30px]" contentClass="w-full min-w-max" img={<Image src="/images/mastercard.png" width={20} height={20} alt="img" />} />
      </div>
      <div className="grid grid-cols-12 xxl:divide-x rtl:divide-x-reverse divide-secondary/30 divide-dashed items-center gap-y-6">
        <div className="col-span-12 md:col-span-6 xxl:col-span-4 md:ltr:pr-6 xxxl:ltr:pr-10 md:rtl:pl-6 xxxl:rtl:pl-10">
          <div className="bg-secondary p-4 lg:px-6 lg:py-5 rounded-xl text-n0 relative overflow-hidden after:absolute after:rounded-full after:w-[300px] after:h-[300px] after:bg-[#FFC861] after:top-[50%] after:ltr:left-[55%] sm:ltr:after:left-[65%] after:rtl:right-[55%] sm:rtl:after:right-[65%]">
            <div className="flex justify-between items-start mb-4 md:mb-8 lg:mb-10 xxxl:mb-14">
              <div>
                <p className="text-xs mb-1">Current Balance</p>
                <h4 className="h4">80,700.00 USD</h4>
              </div>
              <Image src="/images/visa-sm.png" width={45} height={16} alt="visa icon" />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <Image width={45} height={45} src="/images/mastercard.png" alt="card icon" />
                <p className="mb-1 mt-1 md:mt-3">Felecia Brown</p>
                <p className="text-xs">•••• •••• •••• 8854</p>
              </div>
              <p className="text-n700 relative z-[1]">12/27</p>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 xxl:col-span-4 md:pl-6 xxl:px-6 xxxl:px-10">
          <ul className="flex flex-col gap-4">
            {Object.entries(cardDetails).map(([key, value]) => (
              <li key={key} className="flex justify-between">
                <span>{key}:</span> <span className="font-medium">{value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-12 md:col-span-6 xxl:col-span-4 xxl:ltr:pl-6 xxxl:ltr:pl-10 xxl:rtl:pr-6 xxxl:rtl:pr-10">
          <p className="text-lg font-medium mb-6">Active card</p>
          <div className="border border-primary border-dashed bg-primary/5 rounded-lg p-3 flex items-center gap-4 mb-6 lg:mb-8">
            <Image src="/images/card-sm-1.png" width={60} height={40} alt="card" />
            <div>
              <p className="font-medium mb-1">John Snow - Metal</p>
              <span className="text-xs">**4291 - Exp: 12/26</span>
            </div>
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
    </div>
  );
};

export default DepositDetails;
