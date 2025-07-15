import OptionsHorizontal from "@/components/shared/OptionsHorizontal";
import Link from "next/link";
const productInfoData = [
  {
    id: 1,
    title: "Wallet",
    desc: "The best self-hosted wallet",
    icon: <i className="text-3xl las la-wallet"></i>,
  },
  {
    id: 2,
    title: "E-Commerce",
    desc: "Accept payment from anyone",
    icon: <i className="text-3xl las la-shopping-cart"></i>,
  },
  {
    id: 3,
    title: "Cloud",
    desc: "Build the future of payments",
    icon: <i className="text-3xl las la-cloud"></i>,
  },
  {
    id: 4,
    title: "Online Trading",
    desc: "Access our trading terminal",
    icon: <i className="text-3xl las la-globe"></i>,
  },
  {
    id: 5,
    title: "Exchange",
    desc: "Access to our exchange",
    icon: <i className="text-3xl las la-exchange-alt"></i>,
  },
  {
    id: 6,
    title: "Query & Transactions",
    desc: "Secure payments",
    icon: <i className="text-3xl las la-clipboard-list"></i>,
  },
  {
    id: 7,
    title: "Card",
    desc: "Spend funds, earn rewards",
    icon: <i className="text-3xl las la-credit-card"></i>,
  },
  {
    id: 8,
    title: "Intelligence",
    desc: "Power your fintech complance",
    icon: <i className="text-3xl las la-robot"></i>,
  },
  {
    id: 9,
    title: "Apps downloads",
    desc: "Our apps for web and mobile",
    icon: <i className="text-3xl las la-mobile"></i>,
  },
  {
    id: 10,
    title: "Loans & Credit",
    desc: "Applying for Loans or Credit Card",
    icon: <i className="text-3xl las la-coins"></i>,
  },
  {
    id: 11,
    title: "Digital Banking",
    desc: "Security Tips for Digital Transactions",
    icon: <i className="text-3xl las la-piggy-bank"></i>,
  },
  {
    id: 12,
    title: "Customer Support",
    desc: "Contacting Customer Support",
    icon: <i className="text-3xl las la-handshake"></i>,
  },
];

const ProductInfo = () => {
  return (
    <div className="box xl:p-8">
      <div className="flex justify-between items-center bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <h4 className="h4">Product Info</h4>
        <OptionsHorizontal />
      </div>
      <div className="grid grid-cols-12 gap-4 xxl:gap-6">
        {productInfoData.map(({ id, desc, icon, title }) => (
          <div
            key={id}
            className="col-span-12 md:col-span-6 xxl:col-span-4 box xl:p-6 gap-3 bg-primary/5 dark:bg-bg3 border border-n30 dark:border-n500 flex justify-between items-center">
            <Link
              href="#"
              className="flex gap-3 sm:gap-4 xxl:gap-6 items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px] shrink-0 flex items-center justify-center bg-n0 dark:bg-bg4 text-primary rounded-full shadow-[0px_6px_40px_0px_rgba(0,0,0,0.02)]">
                {icon}
              </div>
              <div>
                <p className="text-lg md:text-xl font-medium mb-1 sm:mb-2">
                  {title}
                </p>
                <span className="text-xs md:text-sm">{desc}</span>
              </div>
            </Link>
            <button className="w-10 h-10 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px] shrink-0 flex items-center justify-center bg-n0 dark:bg-bg4 rounded-full shadow-[0px_6px_40px_0px_rgba(0,0,0,0.02)]">
              <i className="las la-download text-2xl"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductInfo;
