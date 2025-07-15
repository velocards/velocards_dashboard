"use client";
import Select from "@/components/shared/Select";
import Pagination from "@/components/shared/Pagination";
import SearchBar from "@/components/shared/SearchBar";
import useTable from "@/utils/useTable";
import Link from "next/link";
import { useState } from "react";
const privacyRules = [
  {
    id: 1,
    title: "Data Collection",
    desc: "Clearly state what types of personal information you collect from users (e.g., name, email, address). ",
  },
  {
    id: 2,
    title: "Purpose of Data Collection",
    desc: "Specify the purpose for collecting user data, whether it's for account creation, transactions, or communication.",
  },
  {
    id: 3,
    title: "Consent",
    desc: "Clearly outline how and when users give their consent for data collection, and provide an opt-in mechanism.",
  },
  {
    id: 4,
    title: "Children's Privacy",
    desc: "Specify if your service is intended for users under a certain age and outline how you handle the data of minors.",
  },
  {
    id: 5,
    title: "Cookies",
    desc: "Explain your use of cookies, including the types of cookies, their purpose, and how users can manage preferences.",
  },
  {
    id: 6,
    title: "Information Security",
    desc: "Detail the security measures in place to protect user data from unauthorized access or breaches.",
  },
  {
    id: 7,
    title: "Data Storage Duration",
    desc: "Specify how long user data will be retained and the criteria used to determine the retention period.",
  },
  {
    id: 8,
    title: "User Access",
    desc: "Explain how users can access, correct, or delete their personal information and the process for making such requests.",
  },
  {
    id: 9,
    title: "Third-Party Sharing",
    desc: "Clarify if and how user data is shared with third parties, and provide the names or categories of such parties.",
  },
  {
    id: 10,
    title: "Marketing Communications",
    desc: "Outline how users can opt in or out of marketing communications and how frequently they can expect to receive.",
  },
  {
    id: 11,
    title: "Data Transfer",
    desc: "If applicable, explain how user data is transferred internationally and the safeguards in place for such transfers.",
  },
  {
    id: 12,
    title: "Legal Basis for Processing",
    desc: "Specify the legal basis for processing user data, such as consent, contract, or legitimate interests.",
  },
  {
    id: 13,
    title: "Changes to Privacy Policy",
    desc: "Notify users of any changes to the privacy policy and provide a timeline for when changes will take effect.",
  },
  {
    id: 14,
    title: "Contact Information",
    desc: "Provide contact details for users to reach out with privacy-related concerns or inquiries.",
  },
  {
    id: 15,
    title: "Analytics",
    desc: "If using analytics tools, disclose the types of data collected and how it's used to improve the user experience.",
  },
  {
    id: 16,
    title: "Social Media Integration",
    desc: "Explain if and how social media plugins or integrations collect and process user data.",
  },
  {
    id: 17,
    title: "User-Generated Content",
    desc: "Detail how user-generated content is moderated and any associated privacy considerations.",
  },
  {
    id: 18,
    title: "Payment Information",
    desc: "If applicable, outline how payment information is processed, stored, and secured.",
  },
  {
    id: 19,
    title: "Automated Decision-Making",
    desc: "Disclose if automated decision-making processes, including profiling, are used and their implications for users.",
  },
  {
    id: 20,
    title: "Data Breach Notification",
    desc: "Outline the procedures in place for notifying users in the event of a data breach.",
  },
  {
    id: 21,
    title: "Data Collection",
    desc: "Clearly state what types of personal information you collect from users (e.g., name, email, address). ",
  },
  {
    id: 22,
    title: "Purpose of Data Collection",
    desc: "Specify the purpose for collecting user data, whether it's for account creation, transactions, or communication.",
  },
  {
    id: 23,
    title: "Consent",
    desc: "Clearly outline how and when users give their consent for data collection, and provide an opt-in mechanism.",
  },
  {
    id: 24,
    title: "Children's Privacy",
    desc: "Specify if your service is intended for users under a certain age and outline how you handle the data of minors.",
  },
  {
    id: 25,
    title: "Cookies",
    desc: "Explain your use of cookies, including the types of cookies, their purpose, and how users can manage preferences.",
  },
  {
    id: 26,
    title: "Information Security",
    desc: "Detail the security measures in place to protect user data from unauthorized access or breaches.",
  },
  {
    id: 27,
    title: "Data Storage Duration",
    desc: "Specify how long user data will be retained and the criteria used to determine the retention period.",
  },
  {
    id: 28,
    title: "User Access",
    desc: "Explain how users can access, correct, or delete their personal information and the process for making such requests.",
  },
  {
    id: 29,
    title: "Third-Party Sharing",
    desc: "Clarify if and how user data is shared with third parties, and provide the names or categories of such parties.",
  },
  {
    id: 30,
    title: "Marketing Communications",
    desc: "Outline how users can opt in or out of marketing communications and how frequently they can expect to receive.",
  },
  {
    id: 31,
    title: "Data Transfer",
    desc: "If applicable, explain how user data is transferred internationally and the safeguards in place for such transfers.",
  },
  {
    id: 32,
    title: "Legal Basis for Processing",
    desc: "Specify the legal basis for processing user data, such as consent, contract, or legitimate interests.",
  },
  {
    id: 33,
    title: "Changes to Privacy Policy",
    desc: "Notify users of any changes to the privacy policy and provide a timeline for when changes will take effect.",
  },
  {
    id: 34,
    title: "Contact Information",
    desc: "Provide contact details for users to reach out with privacy-related concerns or inquiries.",
  },
  {
    id: 35,
    title: "Analytics",
    desc: "If using analytics tools, disclose the types of data collected and how it's used to improve the user experience.",
  },
  {
    id: 36,
    title: "Social Media Integration",
    desc: "Explain if and how social media plugins or integrations collect and process user data.",
  },
  {
    id: 37,
    title: "User-Generated Content",
    desc: "Detail how user-generated content is moderated and any associated privacy considerations.",
  },
  {
    id: 38,
    title: "Payment Information",
    desc: "If applicable, outline how payment information is processed, stored, and secured.",
  },
  {
    id: 39,
    title: "Automated Decision-Making",
    desc: "Disclose if automated decision-making processes, including profiling, are used and their implications for users.",
  },
  {
    id: 40,
    title: "Data Breach Notification",
    desc: "Outline the procedures in place for notifying users in the event of a data breach.",
  },
  {
    id: 41,
    title: "Data Collection",
    desc: "Clearly state what types of personal information you collect from users (e.g., name, email, address). ",
  },
  {
    id: 42,
    title: "Purpose of Data Collection",
    desc: "Specify the purpose for collecting user data, whether it's for account creation, transactions, or communication.",
  },
  {
    id: 43,
    title: "Consent",
    desc: "Clearly outline how and when users give their consent for data collection, and provide an opt-in mechanism.",
  },
  {
    id: 44,
    title: "Children's Privacy",
    desc: "Specify if your service is intended for users under a certain age and outline how you handle the data of minors.",
  },
  {
    id: 45,
    title: "Cookies",
    desc: "Explain your use of cookies, including the types of cookies, their purpose, and how users can manage preferences.",
  },
  {
    id: 46,
    title: "Information Security",
    desc: "Detail the security measures in place to protect user data from unauthorized access or breaches.",
  },
  {
    id: 47,
    title: "Data Storage Duration",
    desc: "Specify how long user data will be retained and the criteria used to determine the retention period.",
  },
  {
    id: 48,
    title: "User Access",
    desc: "Explain how users can access, correct, or delete their personal information and the process for making such requests.",
  },
  {
    id: 49,
    title: "Third-Party Sharing",
    desc: "Clarify if and how user data is shared with third parties, and provide the names or categories of such parties.",
  },
  {
    id: 50,
    title: "Marketing Communications",
    desc: "Outline how users can opt in or out of marketing communications and how frequently they can expect to receive.",
  },
];
const sortOptions = ["Recent", "Name", "Amount"];
const PrivacyPolicy = () => {
  const [selected, setSelected] = useState(sortOptions[0]);
  const { search, sortData, currentPage, endIndex, nextPage, totalData, paginate, prevPage, startIndex, tableData, totalPages, handleFilter } = useTable(privacyRules, 15);
  return (
    <div className="box xl:p-8">
      <div className="flex justify-between flex-wrap gap-5 items-center bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <h4 className="h4">Privacy Policy Rules</h4>
        <div className="flex items-center gap-4 flex-wrap grow sm:justify-end">
          <SearchBar search={search} classes="bg-primary/5 dark:bg-bg3" />
          <div className="flex items-center gap-3 whitespace-nowrap">
            <span>Sort By : </span>
            <Select setSelected={setSelected} selected={selected} items={sortOptions} btnClass="rounded-[32px] lg:py-2.5" contentClass="w-full" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 xxl:gap-6 bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        {tableData.map(({ id, desc, title }) => (
          <div key={id} className="col-span-12 md:col-span-6 xxl:col-span-4 box xl:p-6 bg-primary/5 dark:bg-bg3 border border-n30 dark:border-n500 ">
            <Link href="#" className="h5 mb-4 block">
              {title}
            </Link>
            <p className="text-sm mb-6">{desc}</p>
            <button className="flex items-center gap-2 text-primary">
              <span className="font-semibold">Download</span>
              <span className="w-7 h-7 flex items-center justify-center shrink-0 bg-n0 dark:bg-bg4 rounded-full shadow-[0px_6px_30px_0px_rgba(0,0,0,0.08)]">
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

export default PrivacyPolicy;
