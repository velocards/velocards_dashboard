import HelpArticles from "@/components/support/help-center/HelpArticles";
import Hero from "@/components/support/help-center/Hero";
import ProductInfo from "@/components/support/help-center/ProductInfo";

const HelpCenterPage = () => {
  return (
    <div>
      <div className="flex flex-col gap-4 xxl:gap-6">
        <Hero />
        <ProductInfo />
        <HelpArticles />
      </div>
    </div>
  );
};

export default HelpCenterPage;
