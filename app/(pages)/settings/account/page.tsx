import AccountOverview from "@/components/account/AccountOverview";
import PersonalDetails from "@/components/account/PersonalDetails";
import TierStatus from "@/components/account/TierStatus";

const AccountPage = () => {
  return (
    <div className="flex flex-col gap-4 xxl:gap-6">
      {/* Page Header */}
      <div className="box p-4 xl:p-6">
        <h2 className="h3">Account Overview</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account details, verification status, and tier progression
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 xxl:gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-4 xxl:space-y-6">
          {/* Account Overview Card */}
          <AccountOverview />
          
          {/* Personal Details Card */}
          <PersonalDetails />
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4">
          {/* Tier Status Card */}
          <TierStatus />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;