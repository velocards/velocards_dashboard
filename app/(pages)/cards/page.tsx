import YourCards from "@/components/accounts/bank-account/YourCards";
import PopularCards from "@/components/cards/card-overview/PopularCards";

const CardsPage = () => {
  return (
    <div>
      <div className="flex flex-col gap-4 xxl:gap-6">
        <PopularCards />
        <YourCards />
      </div>
    </div>
  );
};

export default CardsPage;