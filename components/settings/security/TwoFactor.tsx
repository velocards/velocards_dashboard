'use client';

import { IconShieldOff } from '@tabler/icons-react';

const TwoFactor = () => {
  return (
    <div className="box">
      <h3 className="text-2xl font-semibold bb-dashed mb-4 pb-4">
        Two Factor Authentication
      </h3>
      
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <IconShieldOff size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Two-factor authentication is currently unavailable
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This feature is being updated and will be available soon
          </p>
        </div>
      </div>
    </div>
  );
};

export default TwoFactor;