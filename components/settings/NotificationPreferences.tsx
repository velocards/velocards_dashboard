"use client";
import { useEffect, useState } from "react";
// import { useNotificationStore } from "@/stores/notificationStore"; // Not needed for now
// import Switch from "@/components/shared/Switch"; // Using regular checkboxes instead

// Define NotificationSettings type locally
interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  email: boolean;
  enableBanners: boolean;
  enableIcons: boolean;
  autoExpireMinutes: number;
  dismissalPersistence: 'session' | 'permanent' | 'custom';
  persistPreferences: 'session' | 'permanent' | 'custom';
  types: {
    news: { enabled: boolean; minPriority: string };
    updates: { enabled: boolean; minPriority: string };
    maintenance: { enabled: boolean; minPriority: string };
    features: { enabled: boolean; minPriority: string };
    promotions: { enabled: boolean; minPriority: string };
  };
}

const NotificationPreferences = () => {
  // Mock settings since the notification store doesn't have settings
  const defaultSettings: NotificationSettings = {
    enabled: true,
    sound: true,
    desktop: false,
    email: true,
    enableBanners: true,
    enableIcons: true,
    autoExpireMinutes: 60,
    dismissalPersistence: 'session',
    persistPreferences: 'session',
    types: {
      news: { enabled: true, minPriority: 'low' },
      updates: { enabled: true, minPriority: 'medium' },
      maintenance: { enabled: true, minPriority: 'high' },
      features: { enabled: true, minPriority: 'low' },
      promotions: { enabled: false, minPriority: 'low' },
    }
  };
  
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(defaultSettings);
  
  // Mock updateSettings function
  const updateSettings = (updates: Partial<NotificationSettings>) => {
    console.log('Updating settings:', updates);
    // In a real implementation, this would save to backend
  };

  // Component is using local state only for now

  const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateSettings({ [key]: value });
  };

  const handleTypeSettingChange = (
    type: keyof NotificationSettings['types'], 
    setting: 'enabled' | 'minPriority', 
    value: any
  ) => {
    const newTypes = {
      ...localSettings.types,
      [type]: {
        ...localSettings.types[type],
        [setting]: value
      }
    };
    const newSettings = { ...localSettings, types: newTypes };
    setLocalSettings(newSettings);
    updateSettings({ types: newTypes });
  };

  const priorityOptions = [
    { value: 'low', label: 'Low', description: 'All notifications' },
    { value: 'medium', label: 'Medium', description: 'Important notifications' },
    { value: 'high', label: 'High', description: 'Urgent notifications only' },
    { value: 'critical', label: 'Critical', description: 'Emergency notifications only' },
  ];

  const persistenceOptions = [
    { value: 'session', label: 'Session', description: 'Reset when browser closes' },
    { value: 'permanent', label: 'Permanent', description: 'Remember across sessions' },
    { value: 'custom', label: 'Custom', description: 'Per-notification settings' },
  ];

  return (
    <div className="space-y-8">
      {/* General Settings */}
      <div className="box p-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          General Notification Settings
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Enable Banner Notifications</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Show notification banners at the top of pages</p>
            </div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={localSettings.enableBanners}
                onChange={(e) => handleSettingChange('enableBanners', e.target.checked)}
                className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary"
              />
              <span>Enable Banners</span>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Enable Icon Notifications</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Show notification icons in the top bar</p>
            </div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={localSettings.enableIcons}
                onChange={(e) => handleSettingChange('enableIcons', e.target.checked)}
                className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary"
              />
              <span>Enable Icons</span>
            </label>
          </div>

          <div>
            <label className="block font-medium text-gray-900 dark:text-gray-100 mb-2">
              Auto-expire after (hours)
            </label>
            <input
              type="number"
              min="1"
              max="168"
              value={Math.round(localSettings.autoExpireMinutes / 60)}
              onChange={(e) => handleSettingChange('autoExpireMinutes', parseInt(e.target.value) * 60)}
              className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Notifications will automatically disappear after this time
            </p>
          </div>

          <div>
            <label className="block font-medium text-gray-900 dark:text-gray-100 mb-3">
              Dismissal Persistence
            </label>
            <div className="space-y-2">
              {persistenceOptions.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="persistence"
                    value={option.value}
                    checked={localSettings.dismissalPersistence === option.value}
                    onChange={(e) => handleSettingChange('dismissalPersistence', e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{option.label}</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div className="box p-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Notification Types
        </h3>

        <div className="space-y-8">
          {Object.entries(localSettings.types).map(([type, typeSettings]) => (
            <div key={type} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {type} Notifications
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {type === 'renewal' && 'Monthly card renewal reminders and alerts'}
                    {type === 'kyc' && 'Account verification and KYC related notifications'}
                    {type === 'security' && 'Security alerts and authentication notifications'}
                    {type === 'transaction' && 'Transaction confirmations and alerts'}
                    {type === 'system' && 'System updates and maintenance notifications'}
                  </p>
                </div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={typeSettings.enabled}
                    onChange={(e) => handleTypeSettingChange(type as keyof NotificationSettings['types'], 'enabled', e.target.checked)}
                    className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary"
                  />
                  <span>Enable {type}</span>
                </label>
              </div>

              {typeSettings.enabled && (
                <div>
                  <label className="block font-medium text-gray-900 dark:text-gray-100 mb-3 text-sm">
                    Minimum Priority Level
                  </label>
                  <div className="space-y-2">
                    {priorityOptions.map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name={`${type}-priority`}
                          value={option.value}
                          checked={typeSettings.minPriority === option.value}
                          onChange={(e) => handleTypeSettingChange(type as keyof NotificationSettings['types'], 'minPriority', e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{option.label}</span>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <div className="box p-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Notification Preview
        </h3>
        
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                <i className="las la-calendar-alt text-lg text-blue-600"></i>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Sample Renewal Notification</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your monthly fees are due in 3 days</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This is how notifications will appear based on your current settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;