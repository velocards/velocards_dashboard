import TwoFactor from "@/components/settings/security/TwoFactor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Two-Factor Authentication | VeloCards",
  description: "Manage your two-factor authentication settings for enhanced account security",
};

const TwoFactorPage = () => {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h3 className="h3 mb-2">Two-Factor Authentication</h3>
          <p className="text-sm text-n500">
            Enhance your account security with two-factor authentication
          </p>
        </div>
      </div>
      
      <TwoFactor />
    </div>
  );
};

export default TwoFactorPage;