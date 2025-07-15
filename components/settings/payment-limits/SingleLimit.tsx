import { useState } from "react";

const SingleLimit = ({ desc, limit, title, total }: { desc: string; limit: number; title: string; total: number }) => {
  const [value, setValue] = useState(limit);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const percentage = (value / total) * 100;

  return (
    <div className="bg-primary/5 grow dark:bg-bg3 border rounded-xl gap-4 flex-wrap border-n30 dark:border-n500 p-4 md:p-6 xl:px-8 flex items-center justify-between">
      <div>
        <p className="text-sm mb-2">{title}</p>
        <p className="font-medium text-xl">{desc}</p>
      </div>

      <div className="flex items-center max-sm:flex-wrap gap-4 grow sm:justify-end">
        <h5 className="text-xl font-medium whitespace-nowrap">
          <span>{formatCurrency(value)}</span> / <span className="text-primary">{formatCurrency(total)}</span>
        </h5>

        <div className="grow max-w-[203px] w-full relative">
          <div className="relative my-4">
            <div className="absolute h-2 top-2.5 bg-primary/20 rounded-full w-full" />
            <div className="absolute h-2 top-2.5 bg-primary rounded-full" style={{ width: `${percentage}%` }} />
            <input
              type="range"
              min={0}
              max={total}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full h-2 appearance-none bg-transparent accent-primary  cursor-pointer relative z-10"
              style={{
                WebkitAppearance: "none",
                appearance: "none",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleLimit;
