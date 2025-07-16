import OptionsHorizontal from "@/components/shared/OptionsHorizontal";
import Link from "next/link";
const productInfoData = [
  {
    id: 1,
    title: "Virtual Cards",
    desc: "Create and manage virtual cards",
    icon: <i className="text-3xl las la-credit-card"></i>,
    slug: "virtual-cards",
  },
  {
    id: 2,
    title: "Crypto Deposits",
    desc: "Fund your account with crypto",
    icon: <i className="text-3xl las la-bitcoin"></i>,
    slug: "crypto-deposits",
  },
  {
    id: 3,
    title: "Account Balance",
    desc: "Manage your VeloCards balance",
    icon: <i className="text-3xl las la-wallet"></i>,
    slug: "account-balance",
  },
  {
    id: 4,
    title: "Card Creation",
    desc: "How to create new virtual cards",
    icon: <i className="text-3xl las la-plus-circle"></i>,
    slug: "card-creation",
  },
  {
    id: 5,
    title: "Transactions",
    desc: "View and manage transactions",
    icon: <i className="text-3xl las la-exchange-alt"></i>,
    slug: "transactions",
  },
  {
    id: 6,
    title: "KYC Verification",
    desc: "Complete identity verification",
    icon: <i className="text-3xl las la-user-check"></i>,
    slug: "kyc-verification",
  },
  {
    id: 7,
    title: "Tier System",
    desc: "Understand account tiers",
    icon: <i className="text-3xl las la-medal"></i>,
    slug: "account-tiers",
  },
  {
    id: 8,
    title: "Security",
    desc: "Keep your account secure",
    icon: <i className="text-3xl las la-shield-alt"></i>,
    slug: "security",
  },
  {
    id: 9,
    title: "Card BINs",
    desc: "Available BINs and features",
    icon: <i className="text-3xl las la-list-alt"></i>,
    slug: "card-bins",
  },
  {
    id: 10,
    title: "Fees & Limits",
    desc: "Understanding fees and limits",
    icon: <i className="text-3xl las la-dollar-sign"></i>,
    slug: "fees-and-limits",
  },
  {
    id: 11,
    title: "API Integration",
    desc: "Integrate VeloCards API",
    icon: <i className="text-3xl las la-code"></i>,
    slug: "api-integration",
  },
  {
    id: 12,
    title: "Customer Support",
    desc: "Get help from our team",
    icon: <i className="text-3xl las la-headset"></i>,
    slug: "/support/contact",
  },
];

const ProductInfo = () => {
  return (
    <div className="box xl:p-8">
      <div className="flex justify-between items-center bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <h4 className="h4">VeloCards Features</h4>
        <OptionsHorizontal />
      </div>
      <div className="grid grid-cols-12 gap-4 xxl:gap-6">
        {productInfoData.map(({ id, desc, icon, title, slug }) => (
          <div
            key={id}
            className="col-span-12 md:col-span-6 xxl:col-span-4 box xl:p-6 gap-3 bg-primary/5 dark:bg-bg3 border border-n30 dark:border-n500 flex justify-between items-center">
            <Link
              href={slug.startsWith('/') ? slug : `/support/help-center/${slug}`}
              className="flex gap-3 sm:gap-4 xxl:gap-6 items-center hover:text-primary transition-colors">
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
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px] shrink-0 flex items-center justify-center bg-primary/10 rounded-full">
              <i className="las la-arrow-right text-xl text-primary"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductInfo;
