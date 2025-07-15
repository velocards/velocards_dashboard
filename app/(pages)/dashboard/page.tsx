import IncomeExpenseChart from "@/components/dashboards/style-04/IncomeExpenseChart";
// import LatestTransactions from "@/components/dashboards/style-04/LatestTransactions";
import CardTransactions from "@/components/transactions/style-01/CardTransactions";
import Statistics from "@/components/dashboards/style-04/Statistics";
// import TransactionAccount from "@/components/dashboards/style-04/TransactionAccount";
import YourDeposits from "@/components/transactions/style-01/YourDeposits";
import DepositsOverview from "@/components/dashboards/style-04/DepositsOverview";
import YourCards from "@/components/accounts/bank-account/YourCards";
import KYCBanner from "@/components/shared/KYCBanner";
import MonthlyRenewalNotification from "@/components/shared/MonthlyRenewalNotification";

const DashboardPage = () => {
  return (
    <>
      {/* KYC Banner for Unverified Users */}
      <KYCBanner />
      
      {/* Monthly Renewal Notification */}
      <MonthlyRenewalNotification />
      
      <div className="grid grid-cols-12 gap-4 xxl:gap-6">
        <Statistics />
        <div className="col-span-12 lg:col-span-6">
          <DepositsOverview />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <IncomeExpenseChart />
        </div>
        <div className="col-span-12">
          <YourCards />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <YourDeposits />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <CardTransactions />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
