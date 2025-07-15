"use client";
import cn from "@/utils/cn";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useCardStore } from "@/stores/cardStore";
import AddCard from "./AddCard";

// Fallback dummy BIN data for when API is not available
const fallbackBinOptions = [
  { id: 1, bin: "4532", bank: "Visa - Chase Bank", country: "USA", popularUse: "Online Shopping" },
  { id: 2, bin: "5425", bank: "Mastercard - Bank of America", country: "USA", popularUse: "Travel & Hotels" },
  { id: 3, bin: "4716", bank: "Visa - Wells Fargo", country: "USA", popularUse: "Subscription Services" },
  { id: 4, bin: "5524", bank: "Mastercard - Citibank", country: "USA", popularUse: "International Purchases" },
  { id: 5, bin: "4024", bank: "Visa - Capital One", country: "USA", popularUse: "Gaming Platforms" },
  { id: 6, bin: "5424", bank: "Mastercard - HSBC", country: "UK", popularUse: "European Services" },
  { id: 7, bin: "4000", bank: "Visa - Standard", country: "International", popularUse: "General Purpose" },
];

const PopularCards = () => {
  const [openModal, setOpenModal] = useState(false);
  
  // Get real card programs from the store
  const { programs, fetchPrograms, isLoading: programsLoading } = useCardStore();
  
  // Fetch programs on component mount
  useEffect(() => {
    fetchPrograms();
  }, []);
  
  // Transform real programs data into component format
  const binOptions = useMemo(() => {
    if (programs.length === 0) {
      return fallbackBinOptions;
    }
    
    // Helper function to determine card type and popular use case
    const getCardTypeAndUse = (bin: string) => {
      const firstDigit = bin.charAt(0);
      let cardType = '';
      let popularUse = '';
      
      // Determine card type based on BIN
      if (firstDigit === '4') {
        cardType = 'Visa';
      } else if (['5', '2'].includes(firstDigit)) {
        cardType = 'Mastercard';
      } else if (firstDigit === '3') {
        cardType = 'American Express';
      } else {
        cardType = 'Unknown';
      }
      
      // Assign popular use cases based on BIN patterns
      const binNumber = parseInt(bin);
      if (binNumber >= 428800 && binNumber <= 428899) {
        popularUse = 'Online Shopping';
      } else if (binNumber >= 486500 && binNumber <= 486599) {
        popularUse = 'Travel & Hotels';
      } else if (binNumber >= 512600 && binNumber <= 512699) {
        popularUse = 'Subscription Services';
      } else if (binNumber >= 512900 && binNumber <= 512999) {
        popularUse = 'International Purchases';
      } else if (binNumber >= 513900 && binNumber <= 513999) {
        popularUse = 'Gaming Platforms';
      } else if (binNumber >= 517700 && binNumber <= 517799) {
        popularUse = 'E-commerce';
      } else if (binNumber >= 537000 && binNumber <= 537199) {
        popularUse = 'General Purpose';
      } else {
        popularUse = 'Multi-purpose';
      }
      
      return { cardType, popularUse };
    };
    
    return programs.map((program) => {
      const { cardType, popularUse } = getCardTypeAndUse(program.bin);
      
      return {
        id: program.programId,
        bin: program.bin,
        bank: `${cardType} - ${program.name}`,
        country: 'USA', // All programs appear to be US-based
        popularUse: popularUse,
        programId: program.programId,
        name: program.name,
        description: program.description
      };
    });
  }, [programs]);
  
  const [selectedBin, setSelectedBin] = useState(fallbackBinOptions[0]);
  
  // Update selected bin when binOptions change
  useEffect(() => {
    if (binOptions.length > 0 && selectedBin.id === fallbackBinOptions[0].id) {
      setSelectedBin(binOptions[0]);
    }
  }, [binOptions, selectedBin.id]);
  return (
    <>
      <div className="box">
        <div className="bb-dashed border-secondary/20 mb-4 pb-4">
          <h4 className="h4">Popular BINs</h4>
        </div>
        
        <div className="flex flex-col xl:flex-row gap-4 xxl:gap-6">
          {/* Glassmorphism Card Section - Standard credit card proportions */}
          <div className="w-full xl:flex-shrink-0 xl:w-[475px]">
            <div className="relative overflow-hidden rounded-2xl h-[300px]">
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
              </div>
              
              <div className="relative h-full">
                {/* Shapes touching the card border for 3D effect */}
                <div className="absolute -top-4 left-1/4 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rotate-45 z-20"></div>
                <div className="absolute -bottom-3 right-1/3 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rotate-12 z-20"></div>
                <div className="absolute top-1/2 -left-3 w-6 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-r-lg z-20"></div>
                <div className="absolute top-1/3 -right-4 w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-l-full z-20"></div>
                
                {/* Main card */}
                <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-white/30 to-white/10 dark:from-gray-800/30 dark:to-gray-800/10 backdrop-blur-sm p-8 flex flex-col justify-between border-2 border-white/50 dark:border-gray-600/50 shadow-2xl">
                  {/* Glass effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-700/10 dark:to-gray-700/5"></div>
                  
                  {/* Card content */}
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Selected BIN</p>
                        <p className="text-gray-900 dark:text-gray-100 font-bold text-2xl">{selectedBin.bin}</p>
                      </div>
                      <div className="text-right">
                        <Image 
                          src={selectedBin.bin.startsWith('4') ? "/images/visa-sm.png" : "/images/mastercard.png"} 
                          width={selectedBin.bin.startsWith('4') ? 48 : 40} 
                          height={selectedBin.bin.startsWith('4') ? 17 : 40} 
                          alt="card brand" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Issuing Bank</p>
                        <p className="text-gray-900 dark:text-gray-100 font-semibold">{selectedBin.bank}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Country</p>
                        <p className="text-gray-900 dark:text-gray-100 font-semibold">{selectedBin.country}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Card Number Preview</p>
                        <p className="text-gray-900 dark:text-gray-100 font-mono text-lg">
                          {selectedBin.bin} •••• •••• ••••
                        </p>
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
          
          {/* Remaining space container for dropdown and table */}
          <div className="w-full xl:flex-1 flex flex-col lg:flex-row gap-4 xxl:gap-6 min-w-0">
            {/* Middle Section - BIN Selection Dropdown - 40% */}
            <div className="w-full lg:w-2/5">
              <div className="bg-secondary/5 dark:bg-bg3 rounded-xl p-4 h-[300px] flex flex-col justify-between">
              <div>
                <label className="block text-sm font-medium mb-2">Select BIN</label>
                <select 
                  value={selectedBin.id}
                  onChange={(e) => {
                    const bin = binOptions.find(b => b.id === parseInt(e.target.value));
                    if (bin) setSelectedBin(bin);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  {binOptions.map((bin) => (
                    <option key={bin.id} value={bin.id}>
                      {bin.bin} - {bin.bank}
                    </option>
                  ))}
                </select>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 text-xs">Type</span>
                    <span className="font-medium text-xs">{selectedBin.bin.startsWith('4') ? 'Visa' : 'Mastercard'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 text-xs">Country</span>
                    <span className="font-medium text-xs">{selectedBin.country}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setOpenModal(true)}
                className="w-full px-4 py-2.5 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
              >
                <i className="las la-plus"></i>
                <span>Add New Card</span>
              </button>
              </div>
            </div>
            
            {/* Right Section - BIN Table - 60% */}
            <div className="w-full lg:w-3/5">
              <div className="bg-secondary/5 dark:bg-bg3 rounded-xl overflow-hidden h-[300px] flex flex-col">
              <div className="flex-shrink-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      <th className="text-left py-3 px-4 text-sm font-medium">BIN</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Popular Use</th>
                      <th className="text-center py-3 px-4 text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div className="flex-1 overflow-y-auto">
                <table className="w-full">
                  <tbody>
                    {binOptions.map((bin) => (
                      <tr 
                        key={bin.id} 
                        className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedBin.id === bin.id ? 'bg-primary/5' : ''}`}
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-sm">{bin.bin}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{bin.bin.startsWith('4') ? 'Visa' : 'Mastercard'}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{bin.popularUse}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setSelectedBin(bin)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                              selectedBin.id === bin.id 
                                ? 'bg-primary text-white' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {selectedBin.id === bin.id ? 'Selected' : 'Select'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddCard open={openModal} toggleOpen={() => setOpenModal(false)} />
    </>
  );
};

export default PopularCards;
