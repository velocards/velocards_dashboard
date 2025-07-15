'use client';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';

interface CloudflareTurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  action?: 'login' | 'register' | 'forgot-password';
}

export interface TurnstileRef {
  reset: () => void;
}

const CloudflareTurnstile = forwardRef<TurnstileRef, CloudflareTurnstileProps>(
  ({ onVerify, onError, onExpire, action = 'login' }, ref) => {
    const turnstileRef = useRef<TurnstileInstance>(null);
    
    // Get site key from environment variable
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
    
    useImperativeHandle(ref, () => ({
      reset: () => {
        turnstileRef.current?.reset();
      }
    }));
    
    // Development mode - auto-verify if no site key
    useEffect(() => {
      if (!siteKey && process.env.NODE_ENV === 'development') {
        // Simulate successful verification in development
        setTimeout(() => {
          onVerify('development-token');
        }, 1000);
      }
    }, [siteKey, onVerify]);
    
    if (!siteKey) {
      // In development, show a placeholder
      if (process.env.NODE_ENV === 'development') {
        return (
          <div className="mt-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-lg text-sm">
              ⚠️ Cloudflare Turnstile (Development Mode)
            </div>
          </div>
        );
      }
      
      console.warn('Cloudflare Turnstile site key is not configured');
      return null;
    }
    
    return (
      <div className="mt-4">
        <Turnstile
          ref={turnstileRef}
          siteKey={siteKey}
          onSuccess={onVerify}
          onError={onError}
          onExpire={onExpire}
          options={{
            theme: 'light',
            size: 'normal',
            action: action,
          }}
        />
      </div>
    );
  }
);

CloudflareTurnstile.displayName = 'CloudflareTurnstile';

export default CloudflareTurnstile;