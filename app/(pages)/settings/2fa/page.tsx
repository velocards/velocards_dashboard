import TwoFactor from "@/components/settings/security/TwoFactor";

const TwoFactorPage = () => {
  return (
    <div className="flex flex-col gap-4 xxl:gap-6">
      {/* Page Header */}
      <div className="box p-4 xl:p-6">
        <h2 className="h3">Two-Factor Authentication</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Enhance your account security with two-factor authentication using an authenticator app
        </p>
      </div>

      {/* 2FA Component */}
      <TwoFactor />
    </div>
  );
};

export default TwoFactorPage;