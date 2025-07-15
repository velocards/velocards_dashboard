"use client";
import useTable from "@/utils/useTable";
import { IconSelector } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

// Blockchain explorer URLs
const getBlockchainExplorerUrl = (currency: string, txHash: string) => {
  const explorers: Record<string, string> = {
    'BTC': 'https://blockstream.info/tx/',
    'ETH': 'https://etherscan.io/tx/',
    'USDT': 'https://etherscan.io/tx/',
    'USDC': 'https://etherscan.io/tx/',
  };
  return explorers[currency] ? `${explorers[currency]}${txHash}` : null;
};

const transactionsData = [
  {
    id: 1,
    type: "crypto",
    title: "BTC Deposit",
    icon: "/images/usa.png",
    time: "Jun 23, 10:30 AM",
    amount: "+$1,250.00",
    deductions: "$25.00",
    status: "completed",
    cryptoAmount: "0.025 BTC",
    currency: "BTC",
    transactionHash: "1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890"
  },
  {
    id: 2,
    type: "crypto",
    title: "ETH Deposit",
    icon: "/images/euro-sm.png",
    time: "Jun 23, 09:15 AM",
    amount: "+$850.00",
    deductions: "$17.00",
    status: "completed",
    cryptoAmount: "0.35 ETH",
    currency: "ETH",
    transactionHash: "0x9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef"
  },
  {
    id: 3,
    type: "crypto",
    title: "USDT Deposit",
    icon: "/images/usa-sm.png",
    time: "Jun 22, 11:45 PM",
    amount: "+$500.00",
    deductions: "$10.00",
    status: "pending",
    cryptoAmount: "500 USDT",
    currency: "USDT",
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
  },
  {
    id: 4,
    type: "crypto",
    title: "BTC Deposit",
    icon: "/images/usa.png",
    time: "Jun 22, 06:20 PM",
    amount: "+$2,100.00",
    deductions: "$42.00",
    status: "completed",
    cryptoAmount: "0.042 BTC",
    currency: "BTC",
    transactionHash: "2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab"
  },
  {
    id: 5,
    type: "crypto",
    title: "USDC Deposit",
    icon: "/images/usa-sm.png",
    time: "Jun 22, 02:30 PM",
    amount: "+$750.00",
    deductions: "$15.00",
    status: "completed",
    cryptoAmount: "750 USDC",
    currency: "USDC",
    transactionHash: "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd"
  },
  {
    id: 6,
    type: "crypto",
    title: "ETH Deposit",
    icon: "/images/euro-sm.png",
    time: "Jun 21, 08:15 PM",
    amount: "+$1,600.00",
    deductions: "$32.00",
    status: "completed",
    cryptoAmount: "0.65 ETH",
    currency: "ETH",
    transactionHash: "0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
  },
  {
    id: 7,
    type: "crypto",
    title: "BTC Deposit",
    icon: "/images/usa.png",
    time: "Jun 21, 03:45 PM",
    amount: "+$425.00",
    deductions: "$8.50",
    status: "pending",
    cryptoAmount: "0.0085 BTC",
    currency: "BTC",
    transactionHash: "5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12"
  },
  {
    id: 8,
    type: "crypto",
    title: "USDT Deposit",
    icon: "/images/usa-sm.png",
    time: "Jun 21, 11:30 AM",
    amount: "+$1,000.00",
    deductions: "$20.00",
    status: "completed",
    cryptoAmount: "1000 USDT",
    currency: "USDT",
    transactionHash: "0x6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234"
  },
];

const TransactionAccount = () => {
  const { sortData, tableData } = useTable(transactionsData);
  return (
    <div className="box">
      <div className="bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <p className="font-medium">Your Deposits</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-secondary/5 dark:bg-bg3">
              <th onClick={() => sortData("title")} className="text-start py-5 px-6 cursor-pointer min-w-[280px]">
                <div className="flex items-center gap-1">
                  Transaction Details
                  <IconSelector size={18} />
                </div>
              </th>
              <th onClick={() => sortData("amount")} className="text-start py-5 cursor-pointer">
                <div className="flex items-center gap-1">
                  Amount
                  <IconSelector size={18} />
                </div>
              </th>
              <th onClick={() => sortData("deductions")} className="text-start py-5 cursor-pointer">
                <div className="flex items-center gap-1">
                  Charges
                  <IconSelector size={18} />
                </div>
              </th>
              <th onClick={() => sortData("status")} className="text-center py-5 px-2 cursor-pointer min-w-[170px]">
                <div className="flex items-center justify-center gap-1">
                  Status
                  <IconSelector size={18} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(({ id, title, amount, icon, time, deductions, status, cryptoAmount, currency, transactionHash }) => (
              <tr key={id} className="even:bg-secondary/5 dark:even:bg-bg3">
                <td className="py-2 px-6">
                  <div className="flex items-center gap-3">
                    <Image src={icon} width={40} height={28} className="rounded" alt="crypto icon" />
                    <div>
                      <p className="font-medium mb-1">{title}</p>
                      <span className="text-xs text-gray-500">{time}</span>
                      <div className="text-xs text-gray-400 mt-1">{cryptoAmount}</div>
                    </div>
                  </div>
                </td>
                <td className="py-2">
                  <p className="font-medium text-green-600">{amount}</p>
                  <span className="text-xs text-gray-500">{cryptoAmount}</span>
                </td>
                <td className="py-2">
                  <p className={`font-medium ${deductions === '-' ? 'text-gray-400' : 'text-red-600'}`}>
                    {deductions}
                  </p>
                  <span className="text-xs text-gray-500">Platform fee</span>
                </td>
                <td className="py-2 w-[15%] text-center">
                  {transactionHash ? (
                    <a
                      href={getBlockchainExplorerUrl(currency, transactionHash) || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 min-w-[150px] overflow-hidden ${
                        status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200'
                          : status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200'
                      }`}
                    >
                      <span className="transition-opacity duration-200 group-hover:opacity-0">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          View in Explorer
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </span>
                      </span>
                    </a>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-[150px] justify-center ${
                      status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link className="text-primary font-semibold inline-flex gap-1 items-center mt-6 group" href="/transaction/your-deposits/">
        View All Deposits <i className="las la-arrow-right group-hover:pl-2 duration-300"></i>
      </Link>
    </div>
  );
};

export default TransactionAccount;