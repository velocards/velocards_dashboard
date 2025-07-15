"use client";
import OptionsHorizontal from "@/components/shared/OptionsHorizontal";
import SingleLimit from "./SingleLimit";
const transactionsLimitsData = [
  {
    title: "One-time purchase in store",
    desc: "Account Limits",
    total: 99,
    limit: 50,
  },
  {
    title: "One-time purchase online",
    desc: "Account Limits",
    total: 99,
    limit: 50,
  },
  {
    title: "One-time p2p transfer",
    desc: "Account Limits",
    total: 99,
    limit: 50,
  },
];

const TransactionsLimits = () => {
  return (
    <div className="box xl:p-8">
      <div className="flex justify-between items-center bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <h4 className="h4">Transaction Limits</h4>
        <OptionsHorizontal />
      </div>
      <div className="flex flex-col gap-4 xxl:gap-6 bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        {transactionsLimitsData.map((limit) => (
          <SingleLimit key={limit.title} {...limit} />
        ))}
      </div>
      <div className="flex gap-4 xl:gap-6">
        <button className="btn-primary">Save Changes</button>
        <button className="btn-outline">Cancel</button>
      </div>
    </div>
  );
};

export default TransactionsLimits;
