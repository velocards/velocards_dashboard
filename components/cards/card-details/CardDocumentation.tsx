"use client";
import Pagination from "@/components/shared/Pagination";
import SearchBar from "@/components/shared/SearchBar";
import Select from "@/components/shared/Select";
import useTable from "@/utils/useTable";
import { useState } from "react";
const documentations = [
  {
    id: 1,
    type: "Credit Card Agreement",
    title: "Interest Rates",
  },
  {
    id: 2,
    type: "Terms and Conditions",
    title: "Annual Fees",
  },
  {
    id: 3,
    type: "Cardholder Agreement",
    title: "Billing and Payment",
  },
  {
    id: 4,
    type: "Card Issuance Form",
    title: "Personal Information",
  },
  {
    id: 5,
    type: "Lost or Stolen Reporting ",
    title: "Incident Details",
  },
  {
    id: 6,
    type: "Credit Card Statement",
    title: "Transaction Details",
  },
  {
    id: 7,
    type: "Activation Instructions",
    title: "Activation Steps",
  },
  {
    id: 8,
    type: "Privacy Policy",
    title: "Data Protection",
  },
  {
    id: 9,
    type: "Security Guidelines",
    title: "User Authentication",
  },
  {
    id: 10,
    type: "Rewards Program",
    title: "Earning Points",
  },
  {
    id: 11,
    type: "Fee Schedule",
    title: "Charges and Penalties",
  },
  {
    id: 12,
    type: "Dispute Resolution",
    title: "Claims Process",
  },
  {
    id: 13,
    type: "Mobile App Guide",
    title: "App Features",
  },
  {
    id: 14,
    type: "Loan Agreement",
    title: "Repayment Terms",
  },
  {
    id: 15,
    type: "Insurance Coverage",
    title: "Policy Details",
  },
  {
    id: 16,
    type: "Online Banking",
    title: "Account Management",
  },
  {
    id: 17,
    type: "Travel Assistance",
    title: "Emergency Support",
  },
  {
    id: 18,
    type: "Investment Options",
    title: "Portfolio Management",
  },
  {
    id: 19,
    type: "Health and Safety Guidelines",
    title: "Wellness Measures",
  },
  {
    id: 20,
    type: "Employee Handbook",
    title: "Work Policies",
  },
  {
    id: 21,
    type: "Customer Feedback Form",
    title: "Survey Questions",
  },
  {
    id: 22,
    type: "Social Media Policy",
    title: "Online Conduct",
  },
];
const options = ["Recent", "Name", "Amount"];
const CardDocumentation = () => {
  const [selected, setSelected] = useState(options[0]);
  const { search, sortData, currentPage, deleteItem, endIndex, nextPage, paginate, prevPage, startIndex, tableData, totalData, totalPages } = useTable(documentations, 8);
  return (
    <div className="box">
      <div className="flex flex-wrap gap-4  justify-between items-center bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <h4 className="h4">Card Documentations</h4>
        <div className="flex items-center flex-wrap grow sm:justify-end gap-4">
          <SearchBar search={search} classes="bg-primary/5" />
          <div className="flex items-center gap-3 whitespace-nowrap">
            <span>Sort By : </span>
            <Select setSelected={setSelected} selected={selected} items={options} btnClass="rounded-[32px] lg:py-2.5" contentClass="w-full" />
          </div>
        </div>
      </div>
      <div className="overflow-y-auto mb-3">
        <table className="w-full whitespace-nowrap mb-6">
          <thead>
            <tr className="bg-secondary/5">
              <th className="p-5 text-start w-[45%]">Document Type</th>
              <th className="p-5 text-start w-[45%]">Additional Titles/Sections</th>
              <th className="p-5 text-start">Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(({ title, type }) => (
              <tr key={title} className="hover:bg-secondary/5 dark:hover:bg-bg3 duration-500 border-b border-n30 dark:border-n500">
                <td className="p-5">{title}</td>
                <td className="p-5">{type}</td>
                <td className="p-5">
                  <button>
                    <i className="las la-download"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tableData.length > 0 && <Pagination totalPages={totalPages} currentPage={currentPage} nextPage={nextPage} startIndex={startIndex} endIndex={endIndex} prevPage={prevPage} total={totalData} goToPage={(page: number) => paginate(page)} />}
    </div>
  );
};

export default CardDocumentation;
