'use client';

import { useState } from 'react';
import { IconShieldCheck, IconLoader2, IconKey } from '@tabler/icons-react';
import { toast } from 'react-toastify';

interface TwoFactorVerificationProps {
  onVerify: (code: string, isBackupCode?: boolean) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const TwoFactorVerification: React.FC<TwoFactorVerificationProps> = ({
  onVerify,
  onCancel,
  isLoading = false,
  error
}) => {
  const [code, setCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (useBackupCode) {
      // Backup codes are 8 characters
      if (code.length !== 8) {
        toast.error('Please enter a valid 8-character backup code');
        return;
      }
    } else {
      // TOTP codes are 6 digits
      if (code.length !== 6 || !/^\d+$/.test(code)) {
        toast.error('Please enter a valid 6-digit code');
        return;
      }
    }

    await onVerify(code, useBackupCode);
  };

  const handleCodeChange = (value: string) => {
    if (useBackupCode) {
      // Allow alphanumeric for backup codes
      setCode(value.toUpperCase().slice(0, 8));
    } else {
      // Only allow digits for TOTP
      setCode(value.replace(/\D/g, '').slice(0, 6));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="box p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <IconShieldCheck className="text-primary" size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Two-Factor Authentication</h2>
        <p className="text-n600 text-center mb-6">
          {useBackupCode 
            ? 'Enter one of your backup codes to continue'
            : 'Enter the 6-digit code from your authenticator app'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {useBackupCode ? 'Backup Code' : 'Verification Code'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder={useBackupCode ? 'ABCD1234' : '000000'}
                maxLength={useBackupCode ? 8 : 6}
                autoComplete="one-time-code"
                autoFocus
                className="w-full px-4 py-3 text-center text-lg font-mono border border-n200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <IconKey className="absolute left-3 top-1/2 -translate-y-1/2 text-n400" size={20} />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !code}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <IconLoader2 className="animate-spin" size={20} />
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setUseBackupCode(!useBackupCode);
              setCode('');
            }}
            className="w-full text-sm text-primary hover:text-primary-dark"
          >
            {useBackupCode 
              ? 'Use authenticator app instead'
              : 'Use backup code instead'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full text-sm text-n600 hover:text-n800"
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default TwoFactorVerification;