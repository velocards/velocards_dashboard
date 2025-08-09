'use client';

import { useState, useEffect } from 'react';
import { useTwoFactorStore } from '@/stores/twoFactorStore';
import TwoFactorSetup from '@/components/security/TwoFactorSetup';
import Modal from '@/components/shared/Modal';
import OptionsVertical from "@/components/shared/OptionsVertical";
import { IconShieldCheck, IconShieldOff, IconLoader2, IconHelp } from '@tabler/icons-react';
import { toast } from 'react-toastify';

const TwoFactor = () => {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  
  const {
    status,
    isLoading,
    checkStatus,
    disable2FA,
  } = useTwoFactorStore();

  useEffect(() => {
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnable = () => {
    setShowSetupModal(true);
  };

  const handleDisable = async () => {
    if (!disablePassword) {
      toast.error('Please enter your password');
      return;
    }

    try {
      await disable2FA(disablePassword);
      setShowDisableModal(false);
      setDisablePassword('');
      await checkStatus();
    } catch (error) {
      // Error handled in store
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <div className="box xl:p-8">
        <div className="flex justify-between items-center bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
          <h4 className="h4">Two-Factor Authentication</h4>
          <OptionsVertical />
        </div>

        {isLoading && !status ? (
          <div className="flex items-center justify-center py-8">
            <IconLoader2 className="animate-spin" size={32} />
          </div>
        ) : (
          <>
            {/* 2FA Status */}
            <div className="mb-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                status?.isEnabled 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {status?.isEnabled ? (
                  <>
                    <IconShieldCheck size={20} />
                    <span className="font-medium">2FA is Enabled</span>
                  </>
                ) : (
                  <>
                    <IconShieldOff size={20} />
                    <span className="font-medium">2FA is Disabled</span>
                  </>
                )}
              </div>
              {status?.lastUsed && (
                <p className="text-sm text-n600 mt-2">
                  Last used: {formatDate(status.lastUsed)}
                </p>
              )}
            </div>

            {/* Main Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Enable/Disable 2FA */}
              <div className="box p-4">
                <h5 className="font-semibold mb-2">Authenticator App</h5>
                <p className="text-sm text-n600 mb-4">
                  Use an authenticator app like Google Authenticator or Authy for secure login
                </p>
                {status?.isEnabled ? (
                  <button
                    onClick={() => setShowDisableModal(true)}
                    className="btn-outline-danger w-full"
                  >
                    Disable 2FA
                  </button>
                ) : (
                  <button
                    onClick={handleEnable}
                    className="btn-primary w-full"
                  >
                    Enable 2FA
                  </button>
                )}
              </div>

              {/* Lost Access Help */}
              <div className="box p-4">
                <h5 className="font-semibold mb-2">Lost Your Authenticator?</h5>
                <p className="text-sm text-n600 mb-4">
                  If you've lost access to your authenticator app, our support team can help you regain access to your account
                </p>
                <a
                  href="/support/contact"
                  className="btn-outline w-full flex items-center justify-center gap-2"
                >
                  <IconHelp size={18} />
                  Contact Support
                </a>
              </div>
            </div>

            {/* Important Note */}
            {status?.isEnabled && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Important:</strong> Keep your authenticator app installed and backed up. If you lose access to your authenticator, you'll need to contact support to regain access to your account.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Setup Modal */}
      <Modal
        open={showSetupModal}
        toggleOpen={() => setShowSetupModal(false)}
        width="max-w-3xl"
      >
        <h3 className="text-xl font-semibold mb-4">Setup Two-Factor Authentication</h3>
        <TwoFactorSetup
          onComplete={() => {
            setShowSetupModal(false);
            checkStatus();
            toast.success('Two-factor authentication has been enabled successfully!');
          }}
          onCancel={() => setShowSetupModal(false)}
        />
      </Modal>

      {/* Disable Modal */}
      <Modal
        open={showDisableModal}
        toggleOpen={() => setShowDisableModal(false)}
        width="max-w-md"
      >
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-4">Disable Two-Factor Authentication</h3>
          <p className="text-n600 mb-4">
            Enter your password to disable 2FA. This will make your account less secure.
          </p>
          <input
            type="password"
            value={disablePassword}
            onChange={(e) => setDisablePassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-n200 rounded-lg mb-4"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setShowDisableModal(false)}
              className="flex-1 btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleDisable}
              disabled={isLoading || !disablePassword}
              className="flex-1 btn-danger"
            >
              {isLoading ? 'Disabling...' : 'Disable 2FA'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TwoFactor;