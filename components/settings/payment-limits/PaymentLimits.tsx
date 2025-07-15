"use client";
import OptionsHorizontal from "@/components/shared/OptionsHorizontal";
import SingleLimit from "./SingleLimit";
const paymentLimits = [
  {
    title: "Cash withdrawal",
    desc: "Amount spent and setup",
    total: 99,
    limit: 50,
  },
  {
    title: "Private Transaction",
    desc: "Amount spent and setup",
    total: 99,
    limit: 50,
  },
  {
    title: "Online Payment",
    desc: "Amount spent and setup",
    total: 99,
    limit: 50,
  },
];

const PaymentLimits = () => {
  return (
    <div className="box xl:p-8">
      <div className="flex justify-between items-center bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <h4 className="h4">Payment Limits</h4>
        <OptionsHorizontal />
      </div>
      <div className="flex flex-col gap-4 xxl:gap-6 bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        {paymentLimits.map((limit) => (
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

export default PaymentLimits;
