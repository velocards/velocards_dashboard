"use client";
import Pagination from "@/components/shared/Pagination";
import SearchBar from "@/components/shared/SearchBar";
import Select from "@/components/shared/Select";
import useTable from "@/utils/useTable";
import Link from "next/link";
import { useState } from "react";
const articleList = [
  {
    id: 1,
    title: "How to Open a Bank Account",
    desc: "Learn the step-by-step process of opening a bank account with us, including the required documents ",
    topic: "Create Account",
  },
  {
    id: 2,
    title: "Digital Banking Security Best Practices",
    desc: "Explore essential tips and practices to ensure the security of your online and mobile banking activities",
    topic: "Security",
  },
  {
    id: 3,
    title: "Understanding Credit Scores",
    desc: "Demystify credit scores and their impact on your financial health. Learn how to interpret your credit report ",
    topic: "Scores",
  },
  {
    id: 4,
    title: "What You Need to Know",
    desc: "Know the signs of fraudulent activity and understand the steps to report it. Learn how we prioritize your security ",
    topic: "Reporting Fraud",
  },
  {
    id: 5,
    title: "Contacting Customer Support",
    desc: "Find the various channels through which you can reach our customer support team for assistance. ",
    topic: "Your Guide",
  },
  {
    id: 6,
    title: "Choosing the Right Savings Account",
    desc: "Explore the features and benefits of different savings account options to help you make an informed decision that aligns",
    topic: "Savings Account",
  },
  {
    id: 7,
    title: "Demystifying Overdraft Fees",
    desc: "Understand how overdraft fees work, how to avoid them, and what to do if you find yourself in an overdraft situation.",
    topic: "Fees",
  },
  {
    id: 8,
    title: "Investment Basics for Beginners",
    desc: "A beginner's guide to understanding different investment options, risk factors, and potential returns.",
    topic: "Investment",
  },
  {
    id: 9,
    title: "Credit Card Usage Tips and Tricks",
    desc: "Learn how to maximize the benefits of your credit card while maintaining responsible usage habits.",
    topic: "Tips",
  },
  {
    id: 10,
    title: "Home Loan Application Process",
    desc: "A detailed walkthrough of the home loan application process, including documentation and eligibility criteria.",
    topic: "Home Loan",
  },
  {
    id: 11,
    title: "Traveling with Your Debit/Credit Card",
    desc: "Tips and precautions for using your cards while traveling to ensure a secure and hassle-free experience.",
    topic: "Traveling Card",
  },
  {
    id: 12,
    title: "The Importance of Emergency Funds",
    desc: "Understand why having an emergency fund is crucial for financial stability and how to build one.",
    topic: "Imergency Funds",
  },
  {
    id: 13,
    title: "Understanding Credit Scores",
    desc: "Demystify credit scores and their impact on your financial health. Learn how to interpret your credit report ",
    topic: "Scores",
  },
  {
    id: 14,
    title: "What You Need to Know",
    desc: "Know the signs of fraudulent activity and understand the steps to report it. Learn how we prioritize your security ",
    topic: "Reporting Fraud",
  },
  {
    id: 15,
    title: "Contacting Customer Support",
    desc: "Find the various channels through which you can reach our customer support team for assistance. ",
    topic: "Your Guide",
  },
  {
    id: 16,
    title: "Choosing the Right Savings Account",
    desc: "Explore the features and benefits of different savings account options to help you make an informed decision that aligns",
    topic: "Savings Account",
  },
  {
    id: 17,
    title: "Demystifying Overdraft Fees",
    desc: "Understand how overdraft fees work, how to avoid them, and what to do if you find yourself in an overdraft situation.",
    topic: "Fees",
  },
  {
    id: 18,
    title: "Investment Basics for Beginners",
    desc: "A beginner's guide to understanding different investment options, risk factors, and potential returns.",
    topic: "Investment",
  },
  {
    id: 19,
    title: "Credit Card Usage Tips and Tricks",
    desc: "Learn how to maximize the benefits of your credit card while maintaining responsible usage habits.",
    topic: "Tips",
  },
  {
    id: 20,
    title: "Credit Card Usage Tips and Tricks",
    desc: "Learn how to maximize the benefits of your credit card while maintaining responsible usage habits.",
    topic: "Tips",
  },
  {
    id: 21,
    title: "Traveling with Your Debit/Credit Card",
    desc: "Tips and precautions for using your cards while traveling to ensure a secure and hassle-free experience.",
    topic: "Traveling Card",
  },
  {
    id: 22,
    title: "The Importance of Emergency Funds",
    desc: "Understand why having an emergency fund is crucial for financial stability and how to build one.",
    topic: "Imergency Funds",
  },
  {
    id: 23,
    title: "Understanding Credit Scores",
    desc: "Demystify credit scores and their impact on your financial health. Learn how to interpret your credit report ",
    topic: "Scores",
  },
  {
    id: 24,
    title: "What You Need to Know",
    desc: "Know the signs of fraudulent activity and understand the steps to report it. Learn how we prioritize your security ",
    topic: "Reporting Fraud",
  },
  {
    id: 25,
    title: "Contacting Customer Support",
    desc: "Find the various channels through which you can reach our customer support team for assistance. ",
    topic: "Your Guide",
  },
  {
    id: 26,
    title: "Choosing the Right Savings Account",
    desc: "Explore the features and benefits of different savings account options to help you make an informed decision that aligns",
    topic: "Savings Account",
  },
  {
    id: 27,
    title: "Demystifying Overdraft Fees",
    desc: "Understand how overdraft fees work, how to avoid them, and what to do if you find yourself in an overdraft situation.",
    topic: "Fees",
  },
  {
    id: 28,
    title: "Investment Basics for Beginners",
    desc: "A beginner's guide to understanding different investment options, risk factors, and potential returns.",
    topic: "Investment",
  },
  {
    id: 29,
    title: "Credit Card Usage Tips and Tricks",
    desc: "Learn how to maximize the benefits of your credit card while maintaining responsible usage habits.",
    topic: "Tips",
  },
  {
    id: 30,
    title: "Credit Card Usage Tips and Tricks",
    desc: "Learn how to maximize the benefits of your credit card while maintaining responsible usage habits.",
    topic: "Tips",
  },
];
const sortOptions = ["Recent", "Name", "Amount"];
const HelpArticles = () => {
  const [selected, setSelected] = useState(sortOptions[0]);
  const { search, sortData, currentPage, endIndex, nextPage, totalData, paginate, prevPage, startIndex, tableData, totalPages } = useTable(articleList, 12);

  return (
    <div className="box xl:p-8">
      <div className="flex justify-between flex-wrap items-center gap-4 bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <h4 className="h4">Popular Help Articles</h4>
        <div className="flex items-center gap-4 flex-wrap grow sm:justify-end">
          <SearchBar search={search} classes="bg-primary/5 dark:bg-bg3" />
          <div className="flex items-center gap-3 whitespace-nowrap">
            <span>Sort By : </span>
            <Select setSelected={setSelected} selected={selected} items={sortOptions} btnClass="rounded-[32px] lg:py-2.5" contentClass="w-full" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 xxl:gap-6 bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        {tableData.map(({ id, desc, title, topic }) => (
          <div key={id} className="col-span-12 md:col-span-6 xxl:col-span-4 box xl:p-6 bg-primary/5 dark:bg-bg3 border border-n30 dark:border-n500 ">
            <p className="font-medium mb-3 text-secondary">{topic}</p>
            <Link href="#" className="h5 mb-4 block">
              {title}
            </Link>
            <p className="text-sm mb-6">{desc}</p>
            <button className="flex items-center gap-2 text-primary">
              <span className="font-semibold">Download</span>
              <span className="w-7 h-7 shrink-0 bg-n0 dark:bg-bg4 flex items-center justify-center rounded-full shadow-[0px_6px_30px_0px_rgba(0,0,0,0.08)]">
                <i className="las la-download text-lg"></i>
              </span>
            </button>
          </div>
        ))}
      </div>
      {!tableData.length && (
        <div className="text-center py-10">
          <div className="text-center mx-auto max-w-[500px] max-md:flex flex-col items-center">
            <div className="px-5 lg:px-14 xl:px-24 mb-5">
              <i className="las text-primary la-search text-7xl"></i>
            </div>
            <h3 className="h3 mb-3 lg:mb-6">No matching results</h3>
            <p>Looks like we couldn&nbsp;t find any matching results for your search terms. Try other search terms.</p>
          </div>
        </div>
      )}
      {tableData.length > 0 && <Pagination totalPages={totalPages} currentPage={currentPage} nextPage={nextPage} startIndex={startIndex} endIndex={endIndex} prevPage={prevPage} total={totalData} goToPage={(page: number) => paginate(page)} />}
    </div>
  );
};

export default HelpArticles;
