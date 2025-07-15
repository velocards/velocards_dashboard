"use client";
import { TransactionStatus } from "@/components/accounts/bank-account/PaymentAccount";
import Pagination from "@/components/shared/Pagination";
import SearchBar from "@/components/shared/SearchBar";
import Select from "@/components/shared/Select";
import Action from "@/components/transactions/style-01/Action";
import useDropdown from "@/utils/useDropdown";
import useTable from "@/utils/useTable";
import { IconSelector } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import DetailsModal from "./DetailsModal";

export const latestTransactions = [
  {
    id: 1,
    title: "Hooli INV-79820",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 1121212,
    
  },
  {
    id: 2,
    title: "Initech INV-24792",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Cancelled,
    amount: 8921212,
    
  },
  {
    id: 3,
    title: "Bluth Company INV-84732",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Pending,
    amount: 2141212,
    
  },

  {
    id: 7,
    title: "DOGE Yearly Return Invest.",
    icon: "/images/payoneer.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Payoneer",
    invoice: "#521452",
    status: TransactionStatus.Cancelled,
    amount: 782332,
    
  },
  {
    id: 8,
    title: "Globex Corporation INV-24398",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 8521212,
    
  },
  {
    id: 9,
    title: "Trade Corp INV-24398",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 8521212,
    
  },
  {
    id: 10,
    title: "Minhaz Corporation INV-24398",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 8521212,
    
  },
  {
    id: 11,
    title: "Hooli INV-795580",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 1121212,
    
  },
  {
    id: 4,
    title: "Salaries",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 2521212,
    
  },
  {
    id: 5,
    title: "Massive Dynamic INV-90874",
    icon: "/images/visa.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Visa",
    invoice: "#521452",
    status: TransactionStatus.Pending,
    amount: 554100,
    
  },
  {
    id: 6,
    title: "Jack Collingwood Card reload",
    icon: "/images/payoneer.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Payoneer",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 1420012,
    
  },
  {
    id: 12,
    title: "Initech INV-200212",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Cancelled,
    amount: 8921212,
    
  },
  {
    id: 13,
    title: "Bluth Company INV-84124",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Pending,
    amount: 2141212,
    
  },

  {
    id: 18,
    title: "Globex Inc INV-239801",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 8521212,
    
  },
  {
    id: 19,
    title: "Hooli INV-000121",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 1121212,
    
  },
  {
    id: 20,
    title: "Maven INV-200112",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Cancelled,
    amount: 8921212,
    
  },
  {
    id: 21,
    title: "Gravity IVM-0132",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Pending,
    amount: 2141212,
    
  },
  {
    id: 14,
    title: "Salaries",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 2521212,
    
  },
  {
    id: 15,
    title: "Massive Dynamic INV-001244",
    icon: "/images/visa.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Visa",
    invoice: "#521452",
    status: TransactionStatus.Pending,
    amount: 554100,
    
  },
  {
    id: 16,
    title: "Jack Ma Card reload",
    icon: "/images/payoneer.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Payoneer",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 1420012,
    
  },
  {
    id: 17,
    title: "DOGE Monthly Invest.",
    icon: "/images/payoneer.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Payoneer",
    invoice: "#521452",
    status: TransactionStatus.Cancelled,
    amount: 782332,
    
  },
  {
    id: 22,
    title: "Solar Company 0124",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 2521212,
    
  },
  {
    id: 23,
    title: "Massive ERV-90874",
    icon: "/images/visa.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Visa",
    invoice: "#521452",
    status: TransactionStatus.Pending,
    amount: 554100,
    
  },
  {
    id: 24,
    title: "Jack MA Card reload",
    icon: "/images/payoneer.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Payoneer",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 1420012,
    
  },
  {
    id: 25,
    title: "DOGE Yearly Invest 01.",
    icon: "/images/payoneer.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Payoneer",
    invoice: "#521452",
    status: TransactionStatus.Cancelled,
    amount: 782332,
    
  },
  {
    id: 26,
    title: "Globex Corporation IGV-00198",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 8521212,
    
  },
  {
    id: 27,
    title: "Trade Corp IRU-24398",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 8521212,
    
  },
  {
    id: 28,
    title: "Minhaz Corporation RVV-24398",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 8521212,
    
  },
  {
    id: 29,
    title: "Hooli INR-732080",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 1121212,
    
  },
  {
    id: 30,
    title: "Initech INE-200212",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Cancelled,
    amount: 8921212,
    
  },
  {
    id: 31,
    title: "Bluth Company ISV-84124",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Pending,
    amount: 2141212,
    
  },
  {
    id: 32,
    title: "Salaries INR - 3423",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 2521212,
    
  },
  {
    id: 33,
    title: "Massive Dynamic PPV-001244",
    icon: "/images/visa.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Visa",
    invoice: "#521452",
    status: TransactionStatus.Pending,
    amount: 554100,
    
  },
  {
    id: 34,
    title: "Jack Ma Card Renewal 23",
    icon: "/images/payoneer.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Payoneer",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 1420012,
    
  },
  {
    id: 35,
    title: "DOGE Monthly Invest 342",
    icon: "/images/payoneer.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Payoneer",
    invoice: "#521452",
    status: TransactionStatus.Cancelled,
    amount: 782332,
    
  },
  {
    id: 36,
    title: "Globex Inc IAA-22201",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 8521212,
    
  },
  {
    id: 37,
    title: "Salaries IRF - 234",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 2521212,
    
  },
  {
    id: 38,
    title: "Massive Dynamic IFF-001244",
    icon: "/images/visa.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Visa",
    invoice: "#521452",
    status: TransactionStatus.Pending,
    amount: 554100,
    
  },
  {
    id: 39,
    title: "Jack Ma RTR- 213",
    icon: "/images/payoneer.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Payoneer",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 1420012,
    
  },
  {
    id: 40,
    title: "DOGE Monthly Invest - 42F",
    icon: "/images/payoneer.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Payoneer",
    invoice: "#521452",
    status: TransactionStatus.Cancelled,
    amount: 782332,
    
  },
  {
    id: 41,
    title: "Globex Inc ENV-23301",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 8521212,
    
  },
  {
    id: 42,
    title: "Hooli IRE-7980",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 1121212,
    
  },
  {
    id: 43,
    title: "Initech ENV-292",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Cancelled,
    amount: 8921212,
    
  },
  {
    id: 44,
    title: "Bluth Company ANV-8472",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Pending,
    amount: 2141212,
    
  },
  {
    id: 45,
    title: "Salaries Hero - 432",
    icon: "/images/paypal.png",
    time: "11 Aug, 24. 10:36 am",
    medium: "Paypal",
    invoice: "#521452",
    status: TransactionStatus.Successful,
    amount: 2521212,
    
  },
];
const options = ["Recent", "Name", "Amount"];
const LatestTransactions = () => {
  const [selected, setSelected] = useState(options[0]);
  const { open, toggleOpen } = useDropdown();

  const { search, sortData, currentPage, deleteItem, endIndex, nextPage, paginate, prevPage, startIndex, tableData, totalData, totalPages } = useTable(latestTransactions, 12);

  return (
    <div className="box col-span-12 lg:col-span-6">
      <div className="flex flex-wrap gap-4  justify-between items-center bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <h4 className="h4">All Transactions</h4>
        <div className="flex items-center gap-4 flex-wrap grow sm:justify-end">
          <div className="flex items-center gap-3 whitespace-nowrap">
            <span>Sort By : </span>
            <Select setSelected={setSelected} selected={selected} items={options} btnClass="rounded-[32px] lg:py-2.5" contentClass="w-full" />
          </div>
          <SearchBar search={search} classes="bg-primary/5" />
        </div>
      </div>
      <div className="overflow-x-auto mb-4 lg:mb-6">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-secondary/5 dark:bg-bg3">
              <th onClick={() => sortData("title")} className="text-start py-5 px-6 min-w-[310px] cursor-pointer">
                <div className="flex items-center gap-1">
                  Charge <IconSelector size={18} />
                </div>
              </th>
              <th onClick={() => sortData("amount")} className="text-start py-5 min-w-[130px] cursor-pointer">
                <div className="flex items-center gap-1">
                  Amount <IconSelector size={18} />
                </div>
              </th>
              <th onClick={() => sortData("medium")} className="text-start py-5 min-w-[100px] cursor-pointer">
                <div className="flex items-center gap-1">
                  Type <IconSelector size={18} />
                </div>
              </th>
              <th onClick={() => sortData("status")} className="text-start py-5 cursor-pointer">
                <div className="flex items-center gap-1">
                  Status <IconSelector size={18} />
                </div>
              </th>
              <th className="text-start py-5 min-w-[100px]">Date</th>
              <th className="text-center p-5 ">Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(({ id, title, amount, icon, medium, time, invoice, status }, index) => (
              <tr key={id} className="even:bg-secondary/5 dark:even:bg-bg3">
                <td className="py-2 px-6">
                  <div className="flex items-center gap-3">
                    <Image src={icon} width={32} height={32} className="rounded-full" alt="payment medium icon" />
                    <div>
                      <p className="font-medium mb-1">{title}</p>
                      <span className="text-xs text-gray-500">{medium}</span>
                    </div>
                  </div>
                </td>
                <td className="py-2">
                  <p className="font-medium">${amount.toLocaleString()}</p>
                </td>
                <td className="py-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {medium}
                  </span>
                </td>
                <td className="py-2">
                  <span
                    className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium min-w-[80px] ${status === TransactionStatus.Successful && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"} ${status === TransactionStatus.Cancelled && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"} ${
                      status == TransactionStatus.Pending && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {status}
                  </span>
                </td>
                <td className="py-2">
                  <span className="text-sm text-gray-600">{time}</span>
                </td>
                <td className="py-2">
                  <div className="flex justify-center">
                    <Action onDelete={() => deleteItem(title)} showDetails={toggleOpen} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tableData.length < 1 && (
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
      <DetailsModal open={open} toggleOpen={toggleOpen} />
    </div>
  );
};

export default LatestTransactions;
