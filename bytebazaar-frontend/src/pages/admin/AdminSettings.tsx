import { useState } from 'react';
import { Save, Bell, Shield, Mail, Globe } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: true,
    },
    security: {
      twoFactor: true,
      loginAlerts: true,
      deviceHistory: false,
    },
    email: {
      newsletter: true,
      updates: true,
      marketing: false,
    },
    site: {
      maintenance: false,
      registration: true,
      darkMode: false,
    },
  });

  const handleToggle = (category: string, setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting],
      },
    }));
  };

  const handleSave = () => {
    // In a real application, this would save to the backend
    console.log('Saving settings:', settings);
    // Add toast notification or feedback here
  };

  const SettingSection = ({ icon: Icon, title, category, settings }) => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center mb-4">
        <Icon className="w-6 h-6 text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={value}
                onChange={() => handleToggle(category, key)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingSection
          icon={Bell}
          title="Notifications"
          category="notifications"
          settings={settings.notifications}
        />
        <SettingSection
          icon={Shield}
          title="Security"
          category="security"
          settings={settings.security}
        />
        <SettingSection
          icon={Mail}
          title="Email Preferences"
          category="email"
          settings={settings.email}
        />
        <SettingSection
          icon={Globe}
          title="Site Settings"
          category="site"
          settings={settings.site}
        />
      </div>
    </div>
  );
} 