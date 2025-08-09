'use client';

import { useState, useEffect } from 'react';
import { useTwoFactorStore } from '@/stores/twoFactorStore';
import { IconShieldCheck, IconCopy, IconDownload, IconLoader2 } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import QRCode from 'qrcode';

interface TwoFactorSetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  
  const { 
    setupData, 
    isLoading, 
    error, 
    initiateSetup, 
    enable2FA, 
    clearError,
    clearSetupData 
  } = useTwoFactorStore();

  // Generate QR code when setup data is available
  useEffect(() => {
    if (setupData?.qrCode) {
      // The QR code is already base64 encoded from backend
      setQrCodeDataUrl(setupData.qrCode);
    }
  }, [setupData]);

  // Start setup when component mounts
  useEffect(() => {
    initiateSetup();
    
    return () => {
      clearSetupData();
      clearError();
    };
  }, []);

  const handleCopySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      toast.success('Secret key copied to clipboard');
    }
  };

  const handleCopyBackupCodes = () => {
    if (setupData?.backupCodes) {
      const codesText = setupData.backupCodes.join('\n');
      navigator.clipboard.writeText(codesText);
      toast.success('Backup codes copied to clipboard');
    }
  };

  const handleDownloadBackupCodes = () => {
    if (setupData?.backupCodes) {
      const codesText = setupData.backupCodes.join('\n');
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
    }
  };

  const handleVerifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    try {
      await enable2FA(verificationCode, password);
      setStep(3);
      setShowBackupCodes(true);
    } catch (error) {
      // Error is handled in store
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-n300'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-n200'}`}>
            1
          </div>
          <span className="ml-2 text-sm font-medium">Setup Authenticator</span>
        </div>
        <div className={`h-px flex-1 mx-4 ${step >= 2 ? 'bg-primary' : 'bg-n200'}`} />
        <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-n300'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-n200'}`}>
            2
          </div>
          <span className="ml-2 text-sm font-medium">Verify & Enable</span>
        </div>
        <div className={`h-px flex-1 mx-4 ${step >= 3 ? 'bg-primary' : 'bg-n200'}`} />
        <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-n300'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-n200'}`}>
            3
          </div>
          <span className="ml-2 text-sm font-medium">Save Backup Codes</span>
        </div>
      </div>

      {/* Step 1: Setup Authenticator */}
      {step === 1 && setupData && (
        <div className="box p-6">
          <h3 className="text-xl font-semibold mb-4">Setup Authenticator App</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* QR Code */}
            <div className="flex flex-col items-center">
              <p className="text-sm text-n500 mb-4">
                Scan this QR code with your authenticator app
              </p>
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="2FA QR Code" 
                  className="w-48 h-48 border-2 border-n200 rounded-lg p-2 bg-white"
                />
              ) : (
                <div className="w-48 h-48 border-2 border-n200 rounded-lg flex items-center justify-center">
                  <IconLoader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
            </div>

            {/* Manual Entry */}
            <div>
              <p className="text-sm text-n500 mb-4">
                Or enter this code manually in your app:
              </p>
              <div className="bg-n100 dark:bg-n800 rounded-lg p-4 mb-4">
                <code className="text-xs break-all">{setupData.secret}</code>
                <button
                  onClick={handleCopySecret}
                  className="mt-2 flex items-center gap-2 text-primary hover:text-primary-dark text-sm"
                >
                  <IconCopy size={16} />
                  Copy Secret Key
                </button>
              </div>
              
              <div className="space-y-2 text-sm text-n600">
                <p className="font-medium">Recommended apps:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Google Authenticator</li>
                  <li>Microsoft Authenticator</li>
                  <li>Authy</li>
                  <li>1Password</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={onCancel}
              className="btn-outline px-6"
            >
              Cancel
            </button>
            <button
              onClick={() => setStep(2)}
              className="btn-primary px-6"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Verify & Enable */}
      {step === 2 && (
        <div className="box p-6">
          <h3 className="text-xl font-semibold mb-4">Verify & Enable 2FA</h3>
          
          <p className="text-n600 mb-6">
            Enter the 6-digit code from your authenticator app and your password to enable 2FA.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-2 border border-n200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-n200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(1)}
              className="btn-outline px-6"
              disabled={isLoading}
            >
              Back
            </button>
            <button
              onClick={handleVerifyAndEnable}
              className="btn-primary px-6 flex items-center gap-2"
              disabled={isLoading || !verificationCode || !password}
            >
              {isLoading ? (
                <>
                  <IconLoader2 className="animate-spin" size={20} />
                  Verifying...
                </>
              ) : (
                <>
                  <IconShieldCheck size={20} />
                  Enable 2FA
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Backup Codes */}
      {step === 3 && showBackupCodes && setupData?.backupCodes && (
        <div className="box p-6">
          <div className="flex items-center gap-3 mb-4">
            <IconShieldCheck className="text-green-500" size={32} />
            <h3 className="text-xl font-semibold">2FA Enabled Successfully!</h3>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Important:</strong> Save these backup codes in a secure place. Each code can only be used once for account recovery if you lose access to your authenticator app.
            </p>
          </div>

          <div className="bg-n100 dark:bg-n800 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-2">
              {setupData.backupCodes.map((code, index) => (
                <div key={index} className="font-mono text-sm py-1">
                  {index + 1}. {code}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={handleCopyBackupCodes}
              className="flex-1 btn-outline flex items-center justify-center gap-2"
            >
              <IconCopy size={20} />
              Copy Codes
            </button>
            <button
              onClick={handleDownloadBackupCodes}
              className="flex-1 btn-outline flex items-center justify-center gap-2"
            >
              <IconDownload size={20} />
              Download Codes
            </button>
          </div>

          <button
            onClick={handleComplete}
            className="w-full btn-primary"
          >
            Complete Setup
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !setupData && (
        <div className="box p-8 flex flex-col items-center justify-center">
          <IconLoader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-n600">Loading setup data...</p>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;