"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { IconBrandGoogle, IconLink, IconUnlink } from "@tabler/icons-react";
import { apiClient } from "@/lib/api/client";
import Link from "next/link";

interface LinkedProvider {
  provider: string;
  linked: boolean;
  email?: string;
  name?: string;
}

const ConnectedAccounts = () => {
  const [providers, setProviders] = useState<LinkedProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch linked providers
  const fetchProviders = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/auth/linked-providers');
      setProviders(response.data.data.providers || []);
    } catch (error) {
      console.error('Failed to fetch linked providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const googleProvider = providers.find(p => p.provider === 'google');
  const linkedCount = providers.filter(p => p.linked).length;

  return (
    <div className="box p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Connected Accounts</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {linkedCount} account{linkedCount !== 1 ? 's' : ''} connected
          </p>
        </div>
        <Link 
          href="/settings/profile" 
          className="text-primary hover:text-primary/80 transition-colors text-sm"
        >
          Manage
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                  <div className="h-3 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Google Account */}
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${
            googleProvider?.linked 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              googleProvider?.linked 
                ? 'bg-white dark:bg-gray-700' 
                : 'bg-gray-200 dark:bg-gray-700'
            }`}>
              <IconBrandGoogle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Google</p>
              {googleProvider?.linked ? (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {googleProvider.email || 'Connected'}
                </p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Not connected
                </p>
              )}
            </div>
            {googleProvider?.linked ? (
              <IconLink className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
              <IconUnlink className="w-4 h-4 text-gray-400" />
            )}
          </div>

          {/* More providers can be added here */}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex gap-2">
          <i className="las la-info-circle text-blue-600 dark:text-blue-400 text-lg flex-shrink-0"></i>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">Why connect accounts?</p>
            <ul className="space-y-0.5 ml-3 list-disc">
              <li>Faster sign-in</li>
              <li>Enhanced security</li>
              <li>Account recovery options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedAccounts;