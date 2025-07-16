"use client";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { IconUser, IconMail, IconPhone, IconMapPin, IconEdit } from "@tabler/icons-react";

const PersonalDetails = () => {
  const { user } = useAuthStore();

  const InfoItem = ({ icon, label, value, isVerified = false }: { 
    icon: React.ReactNode; 
    label: string; 
    value: string | null | undefined;
    isVerified?: boolean;
  }) => (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        <p className="font-medium mt-1">
          {value || 'Not provided'}
          {isVerified && value && (
            <span className="ml-2 text-green-600 dark:text-green-400 text-sm">
              <i className="las la-check-circle"></i> Verified
            </span>
          )}
        </p>
      </div>
    </div>
  );

  return (
    <div className="box p-6 xl:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Personal Details</h3>
        <Link 
          href="/settings/profile" 
          className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm"
        >
          <IconEdit className="w-4 h-4" />
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <InfoItem 
          icon={<IconUser className="w-5 h-5 text-primary" />}
          label="Full Name"
          value={user?.firstName && user?.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user?.firstName || user?.lastName || null
          }
          isVerified={user?.kycStatus === 'approved'}
        />

        {/* Email */}
        <InfoItem 
          icon={<IconMail className="w-5 h-5 text-primary" />}
          label="Email Address"
          value={user?.email}
          isVerified={user?.emailVerified}
        />

        {/* Phone */}
        <InfoItem 
          icon={<IconPhone className="w-5 h-5 text-primary" />}
          label="Phone Number"
          value={user?.phone}
        />
      </div>

      {/* Security Notice */}
      {user?.kycStatus === 'approved' && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <i className="las la-shield-alt text-blue-600 dark:text-blue-400 text-xl"></i>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Personal Information Protected
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Your personal details are locked after KYC verification for security. Contact support if you need to make changes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalDetails;