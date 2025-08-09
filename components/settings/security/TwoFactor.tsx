'use client';

import { useState, useEffect } from 'react';
import { useTwoFactorStore } from '@/stores/twoFactorStore';
import TwoFactorSetup from '@/components/security/TwoFactorSetup';
import Modal from '@/components/shared/Modal';
import OptionsVertical from "@/components/shared/OptionsVertical";
import { IconShieldCheck, IconShieldOff, IconLoader2, IconRefresh, IconDevices, IconDownload } from '@tabler/icons-react';
import { toast } from 'react-toastify';

const TwoFactor = () => {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [regeneratePassword, setRegeneratePassword] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  
  const {
    status,
    sessions,
    isLoading,
    checkStatus,
    disable2FA,
    regenerateBackupCodes,
    getSessions,
    revokeSession,
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

  const handleRegenerateBackupCodes = async () => {
    if (!regeneratePassword) {
      toast.error('Please enter your password');
      return;
    }

    try {
      const codes = await regenerateBackupCodes(regeneratePassword);
      setBackupCodes(codes);
      setRegeneratePassword('');
    } catch (error) {
      // Error handled in store
    }
  };

  const handleDownloadBackupCodes = () => {
    if (backupCodes.length === 0) return;
    
    const codesText = backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'velocards-2fa-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Backup codes downloaded');
  };

  const handleShowSessions = async () => {
    await getSessions();
    setShowSessionsModal(true);
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

              {/* Backup Codes */}
              <div className="box p-4">
                <h5 className="font-semibold mb-2">Backup Codes</h5>
                <p className="text-sm text-n600 mb-4">
                  Generate recovery codes for account access if you lose your device
                </p>
                <button
                  onClick={() => setShowBackupCodesModal(true)}
                  disabled={!status?.isEnabled}
                  className="btn-outline w-full flex items-center justify-center gap-2"
                >
                  <IconRefresh size={18} />
                  Regenerate Codes
                </button>
              </div>

              {/* Active Sessions */}
              <div className="box p-4">
                <h5 className="font-semibold mb-2">Active Sessions</h5>
                <p className="text-sm text-n600 mb-4">
                  View and manage devices currently logged into your account
                </p>
                <button
                  onClick={handleShowSessions}
                  className="btn-outline w-full flex items-center justify-center gap-2"
                >
                  <IconDevices size={18} />
                  Manage Sessions
                </button>
              </div>

              {/* Account Recovery */}
              <div className="box p-4">
                <h5 className="font-semibold mb-2">Account Recovery</h5>
                <p className="text-sm text-n600 mb-4">
                  Configure recovery options if you lose access to your 2FA device
                </p>
                <button
                  className="btn-outline w-full"
                  disabled
                >
                  Configure Recovery
                </button>
              </div>
            </div>
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

      {/* Backup Codes Modal */}
      <Modal
        open={showBackupCodesModal}
        toggleOpen={() => setShowBackupCodesModal(false)}
        width="max-w-lg"
      >
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-4">Backup Recovery Codes</h3>
          {backupCodes.length === 0 ? (
            <>
              <p className="text-n600 mb-4">
                Enter your password to generate new backup codes. This will invalidate any existing codes.
              </p>
              <input
                type="password"
                value={regeneratePassword}
                onChange={(e) => setRegeneratePassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-n200 rounded-lg mb-4"
              />
              <button
                onClick={handleRegenerateBackupCodes}
                disabled={isLoading || !regeneratePassword}
                className="w-full btn-primary"
              >
                {isLoading ? 'Generating...' : 'Generate New Codes'}
              </button>
            </>
          ) : (
            <>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Save these codes in a secure place. Each code can only be used once.
                </p>
              </div>
              <div className="bg-n100 dark:bg-n800 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="font-mono text-sm py-1">
                      {index + 1}. {code}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleDownloadBackupCodes}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <IconDownload size={18} />
                Download Codes
              </button>
            </>
          )}
        </div>
      </Modal>

      {/* Sessions Modal */}
      <Modal
        open={showSessionsModal}
        toggleOpen={() => setShowSessionsModal(false)}
        width="max-w-2xl"
      >
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-4">Active Sessions</h3>
          <p className="text-sm text-n600 mb-4">
            These devices are currently logged into your account. Revoke any sessions you don't recognize.
          </p>
          {sessions.length === 0 ? (
            <p className="text-center text-n600 py-4">No active sessions found</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="box p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{session.userAgent}</p>
                      <p className="text-sm text-n600">IP: {session.ipAddress}</p>
                      <p className="text-sm text-n600">
                        Last active: {formatDate(session.lastActivity)}
                      </p>
                      <p className="text-sm text-n600">
                        Created: {formatDate(session.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => revokeSession(session.id)}
                      className="btn-outline-danger btn-sm"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default TwoFactor;
