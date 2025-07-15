"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AccountBalance = () => {
  const [isDetailsRevealed, setIsDetailsRevealed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // Dummy card data
  const cards = [
    {
      id: 1,
      nickname: "Shopping Card",
      maskedPan: "**** **** **** 4821",
      balance: 1250.00,
      spent: 750.00,
      limit: 2000.00,
      expiryMonth: "08",
      expiryYear: "26",
      type: "Virtual",
      status: "active"
    },
    {
      id: 2,
      nickname: "Travel Card",
      maskedPan: "**** **** **** 3967",
      balance: 3500.00,
      spent: 1500.00,
      limit: 5000.00,
      expiryMonth: "12",
      expiryYear: "25",
      type: "Virtual",
      status: "active"
    },
    {
      id: 3,
      nickname: "Business Expenses",
      maskedPan: "**** **** **** 5234",
      balance: 800.00,
      spent: 2200.00,
      limit: 3000.00,
      expiryMonth: "03",
      expiryYear: "27",
      type: "Virtual",
      status: "frozen"
    }
  ];

  const [selectedCard, setSelectedCard] = useState(cards[0]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const freezeCard = () => {
    console.log('Freeze card:', selectedCard.id);
    closeDropdown();
  };

  const updateLimit = () => {
    console.log('Update limit for:', selectedCard.id);
    closeDropdown();
  };

  const viewTransactions = () => {
    console.log('View transactions for:', selectedCard.id);
    router.push(`/cards/card-details?cardId=${selectedCard.id}`);
    closeDropdown();
  };

  const deleteCard = () => {
    console.log('Delete card:', selectedCard.id);
    closeDropdown();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isDropdownOpen]);

  return (
    <div className="box col-span-12 md:col-span-5 xxl:col-span-4 flex flex-col">
      <div className="flex flex-wrap justify-between items-center gap-3 pb-4 lg:pb-6 mb-4 lg:mb-6 bb-dashed">
        <p className="font-medium">Card Manager</p>
        <select 
          value={selectedCard.id}
          onChange={(e) => {
            const card = cards.find(c => c.id === parseInt(e.target.value));
            if (card) setSelectedCard(card);
          }}
          className="px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {cards.map((card) => (
            <option key={card.id} value={card.id}>
              {card.nickname} ({card.maskedPan.slice(-4)})
            </option>
          ))}
        </select>
      </div>
      
      {/* Glassmorphism Credit Card */}
      <div className="relative flex-1 overflow-hidden rounded-2xl">
        {/* Background geometric pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
          {/* Floating geometric shapes */}
          <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rotate-45 opacity-90"></div>
          <div className="absolute top-1/3 right-20 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rotate-12 opacity-80"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 -rotate-30 opacity-85"></div>
          <div className="absolute bottom-10 right-10 w-28 h-28 bg-gradient-to-br from-orange-400 to-red-500 rotate-60 opacity-90"></div>
          
          {/* Hexagon pattern */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 opacity-70" style={{clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'}}></div>
          </div>
          
          {/* Triangle accents */}
          <div className="absolute top-20 left-1/3 w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[60px] border-b-yellow-400 opacity-80"></div>
          <div className="absolute bottom-1/3 right-1/4 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-t-[50px] border-t-pink-400 opacity-75"></div>
        </div>
        
        <div className="relative h-full min-h-[300px]">
          {/* Shapes touching the card border for 3D effect */}
          <div className="absolute -top-4 left-1/4 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rotate-45 z-20"></div>
          <div className="absolute -bottom-3 right-1/3 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rotate-12 z-20"></div>
          <div className="absolute top-1/2 -left-3 w-6 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-r-lg z-20"></div>
          <div className="absolute top-1/3 -right-4 w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-l-full z-20"></div>
          
          {/* Main card */}
          <div 
            className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-white/30 to-white/10 dark:from-gray-800/30 dark:to-gray-800/10 backdrop-blur-sm p-8 flex flex-col justify-between border-2 border-white/50 dark:border-gray-600/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] dark:hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.3)] transition-all duration-300 before:absolute before:inset-0 before:rounded-2xl before:shadow-[inset_0_2px_10px_rgba(255,255,255,0.6),inset_0_-2px_10px_rgba(0,0,0,0.1)] dark:before:shadow-[inset_0_2px_10px_rgba(255,255,255,0.2),inset_0_-2px_10px_rgba(0,0,0,0.3)] after:absolute after:inset-0 after:rounded-2xl after:ring-1 after:ring-white/30 after:ring-offset-2 after:ring-offset-transparent"
          >
          {/* Glass effect overlay with highlights */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-700/10 dark:to-gray-700/5"></div>
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/40"></div>
          <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-white/60 to-transparent dark:via-white/30"></div>
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-black/30"></div>
          <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-black/10 to-transparent dark:via-black/30"></div>
          
          {/* Card content */}
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Virtual Card</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{selectedCard.nickname}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${selectedCard.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <span className="text-gray-600 dark:text-gray-400 text-xs capitalize">{selectedCard.status}</span>
                </div>
                {/* Card Controls - Dropdown Menu */}
                <div className="dropdown-container relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown();
                    }}
                    className="p-2 rounded-md bg-white/20 dark:bg-gray-800/20 backdrop-blur-md hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-200 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5"
                  >
                    <i className="las la-ellipsis-v text-lg text-gray-700 dark:text-gray-300"></i>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-full top-0 mr-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-white/30 dark:border-gray-600/30 z-50 backdrop-blur-md">
                      <div className="py-1">
                        <button
                          onClick={freezeCard}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                          <i className={`las ${selectedCard.status === 'active' ? 'la-snowflake' : 'la-sun'} text-primary`}></i>
                          {selectedCard.status === 'active' ? 'Freeze Card' : 'Unfreeze Card'}
                        </button>
                        <button
                          onClick={updateLimit}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                          <i className="las la-chart-line text-primary"></i>
                          Update Limit
                        </button>
                        <button
                          onClick={viewTransactions}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                          <i className="las la-list text-blue-600"></i>
                          View Transactions
                        </button>
                        <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                        <button
                          onClick={deleteCard}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
                        >
                          <i className="las la-trash text-red-600"></i>
                          Delete Card
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-end">
              <div className="space-y-3">
                <div>
                  <p className="text-gray-900 dark:text-gray-100 font-mono text-lg tracking-wider">
                    {isDetailsRevealed 
                      ? '4532 1234 5678 ' + selectedCard.maskedPan.slice(-4)
                      : selectedCard.maskedPan.replace(/\*/g, '•')
                    }
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">Balance</p>
                  <p className="text-gray-900 dark:text-gray-100 font-semibold text-xl">
                    ${selectedCard.balance.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Expires</p>
                <p className="text-gray-900 dark:text-gray-100 font-mono mb-3">
                  {selectedCard.expiryMonth}/{selectedCard.expiryYear}
                </p>
                {/* Reveal Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDetailsRevealed(!isDetailsRevealed);
                  }}
                  className="bg-white/20 hover:bg-white/30 dark:bg-gray-800/20 dark:hover:bg-gray-800/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 text-gray-900 dark:text-gray-100 border border-white/30 dark:border-gray-600/30"
                >
                  <i className={`las ${isDetailsRevealed ? 'la-eye-slash' : 'la-eye'} text-lg`}></i>
                  <span>{isDetailsRevealed ? 'Hide Number' : 'Reveal Number'}</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Card design elements */}
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AccountBalance;