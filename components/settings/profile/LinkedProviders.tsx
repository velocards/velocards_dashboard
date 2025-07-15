'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { IconBrandGoogle, IconLink, IconUnlink } from '@tabler/icons-react';
import { apiClient } from '@/lib/api/client';

interface LinkedProvider {
  provider: string;
  linked: boolean;
  email?: string;
  name?: string;
}

const LinkedProviders = () => {
  const [providers, setProviders] = useState<LinkedProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLinking, setIsLinking] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);

  // Fetch linked providers
  const fetchProviders = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/auth/linked-providers');
      setProviders(response.data.data.providers || []);
    } catch (error) {
      console.error('Failed to fetch linked providers:', error);
      toast.error('Failed to load linked providers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleLinkGoogle = () => {
    setIsLinking(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.velocards.com/api/v1';
    window.location.href = `${apiUrl}/auth/google?action=link`;
  };

  const handleUnlinkGoogle = async () => {
    if (!confirm('Are you sure you want to unlink your Google account?')) {
      return;
    }

    try {
      setIsUnlinking(true);
      await apiClient.delete('/auth/google/link');
      toast.success('Google account unlinked successfully');
      await fetchProviders();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to unlink Google account');
    } finally {
      setIsUnlinking(false);
    }
  };

  const googleProvider = providers.find(p => p.provider === 'google');

  return (
    <div className="box col-span-12 lg:col-span-6">
      <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
        <h4 className="h4">Linked Accounts</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Connect your social accounts for easier sign-in
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div>
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                    <div className="h-3 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
                <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Google Provider */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm">
                <IconBrandGoogle className="w-6 h-6" />
              </div>
              <div>
                <h6 className="font-medium">Google</h6>
                {googleProvider?.linked ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {googleProvider.email || 'Connected'}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Not connected
                  </p>
                )}
              </div>
            </div>
            
            {googleProvider?.linked ? (
              <button
                onClick={handleUnlinkGoogle}
                disabled={isUnlinking}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
              >
                <IconUnlink className="w-4 h-4" />
                {isUnlinking ? 'Unlinking...' : 'Unlink'}
              </button>
            ) : (
              <button
                onClick={handleLinkGoogle}
                disabled={isLinking}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors disabled:opacity-50"
              >
                <IconLink className="w-4 h-4" />
                {isLinking ? 'Linking...' : 'Link'}
              </button>
            )}
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex gap-3">
              <i className="las la-info-circle text-blue-600 dark:text-blue-400 text-xl mt-0.5"></i>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Why link accounts?</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Sign in faster with one click</li>
                  <li>No need to remember passwords</li>
                  <li>Enhanced security with OAuth providers</li>
                  <li>Automatic email verification for new accounts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedProviders;