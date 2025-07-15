"use client";
import React, { useState } from "react";
import { useInvoiceStore } from "@/stores/invoiceStore";
import type { InvoiceStatus, InvoiceType, InvoiceFilters } from "@/types/invoice";

const InvoiceFiltersComponent = () => {
  const { filters, setFilters, clearFilters } = useInvoiceStore();
  
  const [localFilters, setLocalFilters] = useState<InvoiceFilters>({
    type: filters.type,
    from: filters.from,
    to: filters.to
  });

  const typeOptions: { value: InvoiceType | ""; label: string }[] = [
    { value: "", label: "All Types" },
    { value: "card_transaction", label: "Card Transaction" },
    { value: "crypto_deposit", label: "Crypto Deposit" },
    { value: "crypto_withdrawal", label: "Crypto Withdrawal" },
    { value: "monthly_fee", label: "Monthly Fee" },
    { value: "card_creation_fee", label: "Card Creation Fee" },
    { value: "deposit_fee", label: "Deposit Fee" },
    { value: "manual", label: "Manual Invoice" },
    { value: "consolidated", label: "Consolidated Invoice" }
  ];

  const handleFilterChange = (key: keyof InvoiceFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const applyFilters = () => {
    const cleanedFilters: InvoiceFilters = {
      page: 1 // Reset to first page when applying filters
    };
    
    if (localFilters.type) cleanedFilters.type = localFilters.type;
    if (localFilters.from) cleanedFilters.from = localFilters.from;
    if (localFilters.to) cleanedFilters.to = localFilters.to;
    
    setFilters(cleanedFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    clearFilters();
  };

  const hasActiveFilters = () => {
    return !!(localFilters.type || localFilters.from || localFilters.to);
  };

  return (
    <div className="box col-span-12 mb-6">
      <div className="flex flex-wrap gap-4 justify-between items-start bb-dashed mb-4 pb-4">
        <h4 className="h5">Filter Invoices</h4>
        {hasActiveFilters() && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-primary hover:text-primary-dark"
          >
            Clear Filters
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Type
          </label>
          <select
            value={localFilters.type || ""}
            onChange={(e) => handleFilterChange("type", e.target.value as InvoiceType || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date From Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            From Date
          </label>
          <input
            type="date"
            value={localFilters.from || ""}
            onChange={(e) => handleFilterChange("from", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Date To Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            To Date
          </label>
          <input
            type="date"
            value={localFilters.to || ""}
            onChange={(e) => handleFilterChange("to", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default InvoiceFiltersComponent;