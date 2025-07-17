"use client";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { IconShieldCheck, IconAlertCircle, IconCircleCheck, IconClock } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import KycModal from "@/components/kyc/KycModal";

const AccountOverview = () => {
  const { user } = useAuthStore();
  const { userStatistics, fetchUserStatistics } = useUserStore();
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  
  useEffect(() => {
    fetchUserStatistics();
  }, []);
  
  const getVerificationStatus = () => {
    if (!user) return { icon: null, text: "Unknown", color: "gray" };
    
    if (user.emailVerified) {
      return {
        icon: <IconCircleCheck className="w-5 h-5" />,
        text: "Verified",
        color: "green"
      };
    } else {
      return {
        icon: <IconAlertCircle className="w-5 h-5" />,
        text: "Unverified",
        color: "red"
      };
    }
  };

  const getKycStatus = () => {
    if (!user) return { icon: null, text: "Unknown", color: "gray" };
    
    switch (user.kycStatus) {
      case 'approved':
        return {
          icon: <IconShieldCheck className="w-5 h-5" />,
          text: "KYC Verified",
          color: "green"
        };
      case 'pending':
        return {
          icon: <IconClock className="w-5 h-5" />,
          text: "KYC Pending",
          color: "yellow"
        };
      case 'rejected':
        return {
          icon: <IconAlertCircle className="w-5 h-5" />,
          text: "KYC Rejected",
          color: "red"
        };
      default:
        return {
          icon: <IconAlertCircle className="w-5 h-5" />,
          text: "KYC Required",
          color: "orange"
        };
    }
  };

  const emailStatus = getVerificationStatus();
  const kycStatus = getKycStatus();

  return (
    <>
    <div className="box p-6 xl:p-8">
      <h3 className="text-xl font-semibold mb-6">Account Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account ID */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Account ID</p>
          <p className="font-medium font-mono text-sm">
            {user?.id ? `#${user.id.slice(0, 8).toUpperCase()}` : 'N/A'}
          </p>
        </div>

        {/* Member Since */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Member Since</p>
          <p className="font-medium">
            {user?.createdAt 
              ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })
              : 'N/A'
            }
          </p>
        </div>

        {/* Email Verification Status */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Email Verification</p>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
            ${emailStatus.color === 'green' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
            }`}>
            {emailStatus.icon}
            {emailStatus.text}
          </div>
        </div>

        {/* KYC Status */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">KYC Status</p>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
            ${kycStatus.color === 'green' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
              : kycStatus.color === 'yellow'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
              : kycStatus.color === 'red'
              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
              : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
            }`}>
            {kycStatus.icon}
            {kycStatus.text}
          </div>
          {user?.kycStatus !== 'approved' && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Complete KYC to access unlimited cards and higher limits
            </p>
          )}
        </div>

        {/* Account Type */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Account Type</p>
          <p className="font-medium capitalize">
            {userStatistics?.accountInfo?.currentTier || 'Unverified'}
          </p>
        </div>

        {/* Total Cards */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Cards</p>
          <p className="font-medium">
            {userStatistics?.accountInfo?.activeCardsCount || 0} Cards
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t dark:border-gray-700">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          {user?.kycStatus !== 'approved' && (
            <button 
              onClick={() => setIsKycModalOpen(true)}
              className="btn-primary text-sm px-4 py-2"
            >
              <i className="las la-id-card mr-2"></i>
              Complete KYC
            </button>
          )}
          {user?.emailVerified && user?.kycStatus === 'approved' && (
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
              <IconCircleCheck className="w-4 h-4" />
              Your account is fully verified
            </p>
          )}
        </div>
      </div>
    </div>
    
    
    {/* KYC Modal */}
    <KycModal 
      isOpen={isKycModalOpen} 
      onClose={() => setIsKycModalOpen(false)} 
    />
    </>
  );
};

export default AccountOverview;