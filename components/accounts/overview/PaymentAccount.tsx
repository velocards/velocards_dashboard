"use client";
import Action from "@/components/dashboards/style-04/Action";
import Pagination from "@/components/shared/Pagination";
import SearchBar from "@/components/shared/SearchBar";
import Select from "@/components/shared/Select";
import useTable from "@/utils/useTable";
import { IconSelector } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { transactionsData } from "../bank-account/PaymentAccount";

enum TransactionStatus {
  Successful = "Successful",
  Pending = "Pending",
  Cancelled = "Cancelled",
}

const sortOptions = ["Recent", "Name", "Amount"];

const PaymentAccount = () => {
  const [selected, setSelected] = useState(sortOptions[0]);
  const { search, sortData, currentPage, deleteItem, endIndex, nextPage, paginate, prevPage, startIndex, tableData, totalData, totalPages } = useTable(transactionsData, 6);

  return (
    <div className="box col-span-12">
      <div className="flex justify-between items-center gap-4 flex-wrap bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <p className="font-medium">All Transactions</p>
        <div className="flex items-center gap-4 flex-wrap grow sm:justify-end">
          <SearchBar search={search} classes="bg-primary/5" />
          <div className="flex items-center gap-3 whitespace-nowrap">
            <span>Sort By : </span>
            <Select setSelected={setSelected} selected={selected} items={sortOptions} btnClass="rounded-[32px] lg:py-2.5" contentClass="w-full" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto mb-4 lg:mb-6">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-secondary/5 dark:bg-bg3">
              <th onClick={() => sortData("account")} className="text-start py-5 px-6 cursor-pointer min-w-[220px]">
                <div className="flex items-center gap-1">
                  Account Number <IconSelector size={18} />
                </div>
              </th>
              <th onClick={() => sortData("currency")} className="text-start py-5 min-w-[130px] cursor-pointer">
                <div className="flex items-center gap-1">
                  Currency <IconSelector size={18} />
                </div>
              </th>
              <th onClick={() => sortData("balance")} className="text-start py-5 min-w-[180px] cursor-pointer">
                <div className="flex items-center gap-1">
                  Account Balance <IconSelector size={18} />
                </div>
              </th>
              <th onClick={() => sortData("status")} className="text-start py-5 cursor-pointer min-w-[130px]">
                <div className="flex items-center gap-1">
                  Status <IconSelector size={18} />
                </div>
              </th>
              <th className="text-center p-5 ">Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(({ icon, account, balance, bank, currency, expire, id, status }, index) => (
              <tr key={id} className="even:bg-secondary/5 dark:even:bg-bg3">
                <td className="py-2 px-6">
                  <div className="flex items-center gap-3">
                    <Image src={icon} width={32} height={32} className="rounded-full" alt="payment medium icon" />
                    <div>
                      <p className="font-medium mb-1">{account}</p>
                      <span className="text-xs">Account Number</span>
                    </div>
                  </div>
                </td>
                <td className="py-2">
                  <div>
                    <p className="font-medium">{currency.short}</p>
                    <span className="text-xs">{currency.long}</span>
                  </div>
                </td>
                <td className="py-2">
                  <div>
                    <p className="font-medium">${balance.toLocaleString()}</p>
                    <span className="text-xs">Account Balance</span>
                  </div>
                </td>
                <td className="py-2">
                  <span
                    className={`block text-xs w-28 xxl:w-36 text-center rounded-[30px] dark:border-n500 border border-n30 py-2 ${status === TransactionStatus.Successful && "bg-primary/10 dark:bg-bg3 text-primary"} ${status === TransactionStatus.Cancelled && "bg-error/10 dark:bg-bg3 text-error"} ${
                      status == TransactionStatus.Pending && "bg-warning/10 dark:bg-bg3 text-warning"
                    }`}
                  >
                    {status}
                  </span>
                </td>
                <td className="py-2">
                  <div className="flex justify-center">
                    <Action onDelete={() => deleteItem(id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      </div>
      {tableData.length > 1 && <Pagination totalPages={totalPages} currentPage={currentPage} nextPage={nextPage} startIndex={startIndex} endIndex={endIndex} prevPage={prevPage} total={totalData} goToPage={(page: number) => paginate(page)} />}
    </div>
  );
};

export default PaymentAccount;
