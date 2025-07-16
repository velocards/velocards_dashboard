"use client";
import Image from "next/image";
import { useState } from "react";

interface CardTransactionsChartProps {
  isDetailsRevealed: boolean;
}

const CardTransactionsChart = ({ isDetailsRevealed }: CardTransactionsChartProps) => {
  const cardNumber = "4356 7890 1234 4821";
  const maskedCardNumber = "**** **** **** 4821";
  
  // Dummy transactions for the selected card
  const [transactions] = useState([
    {
      id: 1,
      merchant: "Amazon Prime",
      amount: "-$125.99",
      status: "completed",
      date: "Dec 23, 9:15 AM",
      category: "E-commerce",
      icon: "/images/amazon.png"
    },
    {
      id: 2,
      merchant: "Netflix",
      amount: "-$15.99",
      status: "completed",
      date: "Dec 22, 8:30 PM",
      category: "Entertainment",
      icon: "/images/netflix.png"
    },
    {
      id: 3,
      merchant: "Starbucks",
      amount: "-$34.50",
      status: "pending",
      date: "Dec 22, 8:45 AM",
      category: "Food & Beverage",
      icon: "/images/starbucks.png"
    },
    {
      id: 4,
      merchant: "Uber Eats",
      amount: "-$67.80",
      status: "completed",
      date: "Dec 21, 7:00 PM",
      category: "Food Delivery",
      icon: "/images/uber.png"
    },
    {
      id: 5,
      merchant: "Spotify",
      amount: "-$9.99",
      status: "completed",
      date: "Dec 21, 11:00 AM",
      category: "Subscription",
      icon: "/images/spotify.png"
    },
    {
      id: 6,
      merchant: "Apple Store",
      amount: "-$299.00",
      status: "completed",
      date: "Dec 20, 4:30 PM",
      category: "Electronics",
      icon: "/images/apple.png"
    },
    {
      id: 7,
      merchant: "Target",
      amount: "-$156.43",
      status: "completed",
      date: "Dec 20, 2:20 PM",
      category: "Retail",
      icon: "/images/target.png"
    },
    {
      id: 8,
      merchant: "Shell Gas Station",
      amount: "-$45.00",
      status: "failed",
      date: "Dec 19, 5:15 PM",
      category: "Gas Station",
      icon: "/images/shell.png"
    }
  ]);

  return (
    <div className="box overflow-x-hidden mb-4 xxl:mb-6">
      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-3 pb-4 lg:pb-6 mb-4 lg:mb-6 bb-dashed">
        <h4 className="text-xl sm:text-2xl font-semibold">Card Transactions</h4>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2">
          <i className="las la-credit-card text-primary text-base sm:text-lg"></i>
          <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 font-mono">
            {isDetailsRevealed ? cardNumber : maskedCardNumber}
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary/5 dark:bg-bg3">
              <th className="text-start py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm">Merchant</th>
              <th className="text-start py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm hidden md:table-cell">Category</th>
              <th className="text-start py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm">Amount</th>
              <th className="text-start py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm">Status</th>
              <th className="text-start py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm hidden lg:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-secondary/5 dark:hover:bg-bg3 transition-colors">
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Image 
                      src="/images/visa.png" 
                      width={24} 
                      height={24} 
                      alt={tx.merchant} 
                      className="rounded w-6 h-6 sm:w-8 sm:h-8"
                    />
                    <div className="min-w-0">
                      <span className="font-medium text-sm sm:text-base block truncate">{tx.merchant}</span>
                      <span className="text-[10px] sm:text-xs text-gray-500 lg:hidden">{tx.date}</span>
                    </div>
                  </div>
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-4 hidden md:table-cell">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{tx.category}</span>
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  <span className="font-semibold text-red-600 text-sm sm:text-base">{tx.amount}</span>
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                    tx.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : tx.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-4 hidden lg:table-cell">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{tx.date}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button className="text-primary font-semibold inline-flex gap-1 items-center mt-6 group">
        View All Card Transactions <i className="las la-arrow-right group-hover:pl-2 duration-300"></i>
      </button>
    </div>
  );
};

export default CardTransactionsChart;
