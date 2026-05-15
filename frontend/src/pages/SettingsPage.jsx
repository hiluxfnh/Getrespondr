import React, { useState } from 'react';
import { Settings, Save, ChevronRight, ShieldCheck, Users, UserCog, Clock3 } from 'lucide-react';
import { useAuth } from '../firebase/auth';

export default function SettingsPage() {
  const { user, requestRole } = useAuth();
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    platformName: 'GetRespondr',
    language: 'English (US)',
    timeZone: '(UTC+05:30) Asia/Kolkata',
    timeFormat: '24hour',
    dateFormat: 'DD/MMM, YYYY',
    itemsPerPage: '10',
    distanceUnit: 'Kilometers (km)',
    temperatureUnit: 'Celsius (°C)',
    windSpeedUnit: 'Kilometers per hour (km/h)',
    precipitationUnit: 'Millimeters (mm)',
    defaultMapView: 'Cluster View',
    defaultZoomLevel: '12',
    mapTheme: 'Light',
    showHeatmap: true,
    autoRefresh: true,
    maintenanceMode: false,
    allowPublicReports: true,
    requireEmailVerification: true,
    automaticBackups: true,
    backupFrequency: 'Daily',
    backupTime: '02:00 AM',
    retentionPeriod: '30 Days',
  });

  const [saveMessage, setSaveMessage] = useState('');

  const menuItems = [
    { id: 'general', label: 'General', desc: 'General settings and preferences', icon: 'wrench' },
    { id: 'profile', label: 'Profile', desc: 'Manage your profile information', icon: 'user' },
    { id: 'organization', label: 'Organization', desc: 'Organization and team settings', icon: 'building' },
    { id: 'users', label: 'Users & Roles', desc: 'Manage users and permissions', icon: 'users' },
    { id: 'notifications', label: 'Notifications', desc: 'Notification preferences', icon: 'bell' },
    { id: 'system', label: 'System', desc: 'System configuration', icon: 'settings' },
    { id: 'integrations', label: 'Integrations', desc: 'Third-party integrations', icon: 'link' },
    { id: 'security', label: 'Security', desc: 'Security and access control', icon: 'shield' },
    { id: 'audit', label: 'Audit Logs', desc: 'View system audit logs', icon: 'log' },
    { id: 'billing', label: 'Billing', desc: 'Subscription and billing', icon: 'credit' },
    { id: 'backup', label: 'Backup & Restore', desc: 'Data backup and restore', icon: 'database' },
  ];

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleRoleRequest = async (role) => {
    try {
      const result = await requestRole(role);
      if (result.status === 'approved') {
        setSaveMessage(`${role} access granted.`);
      } else if (result.status === 'pending') {
        setSaveMessage('Coordinator request submitted for super admin approval.');
      } else {
        setSaveMessage('You already have this role.');
      }
      setActiveSection('users');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage(error.message);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const ToggleSwitch = ({ name, checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
              <p className="text-slate-600 text-sm mt-1">Manage your account, preferences, and system configurations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 p-5 text-slate-800 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Access Requests</h2>
              <p className="text-sm text-slate-600">
                Keep a normal account by default. Request Volunteer or Responder access for immediate activation, or request Coordinator access for super admin approval.
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                <Clock3 className="h-3.5 w-3.5" />
                {user?.roleRequest ? `Pending request: ${user.roleRequest}` : 'No active role request.'}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleRoleRequest('Volunteer')}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <Users className="h-4 w-4" />
                Request Volunteer
              </button>
              <button
                type="button"
                onClick={() => handleRoleRequest('Responder')}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                <UserCog className="h-4 w-4" />
                Request Responder
              </button>
              <button
                type="button"
                onClick={() => handleRoleRequest('Coordinator')}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <ShieldCheck className="h-4 w-4" />
                Request Coordinator
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {/* Left Sidebar Menu */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
              <nav className="divide-y divide-slate-200">
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left px-4 py-4 transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <p className={`font-medium text-sm ${activeSection === item.id ? 'text-blue-600' : 'text-slate-900'}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-3">
            {activeSection === 'general' && (
              <div className="bg-white rounded-lg shadow border border-slate-200 p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">General Settings</h2>
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
                <p className="text-slate-600 text-sm mb-8">Configure basic system settings and preferences.</p>

                {saveMessage && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm">
                    {saveMessage}
                  </div>
                )}

                {/* General Settings Section */}
                <div className="mb-12">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">General</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Platform Name</label>
                      <input
                        type="text"
                        name="platformName"
                        value={settings.platformName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <p className="text-xs text-slate-500 mt-1">This name will be displayed across the platform.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Language</label>
                      <select
                        name="language"
                        value={settings.language}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                      <p className="text-xs text-slate-500 mt-1">Select the default language.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Time Zone</label>
                      <select
                        name="timeZone"
                        value={settings.timeZone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option>(UTC+05:30) Asia/Kolkata</option>
                        <option>(UTC-08:00) America/Los_Angeles</option>
                        <option>(UTC-05:00) America/New_York</option>
                        <option>(UTC+00:00) Europe/London</option>
                      </select>
                      <p className="text-xs text-slate-500 mt-1">Set the default time zone for your organization.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Time Format</label>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="timeFormat"
                            value="12hour"
                            checked={settings.timeFormat === '12hour'}
                            onChange={handleChange}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-slate-700">12 Hour (AM/PM)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="timeFormat"
                            value="24hour"
                            checked={settings.timeFormat === '24hour'}
                            onChange={handleChange}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-slate-700">24 Hour</span>
                        </label>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Choose your preferred time format.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Date Format</label>
                      <select
                        name="dateFormat"
                        value={settings.dateFormat}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option>DD/MMM, YYYY</option>
                        <option>MM/DD/YYYY</option>
                        <option>YYYY-MM-DD</option>
                        <option>DD-MM-YYYY</option>
                      </select>
                      <p className="text-xs text-slate-500 mt-1">Choose your preferred date format.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Items Per Page</label>
                      <select
                        name="itemsPerPage"
                        value={settings.itemsPerPage}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                      </select>
                      <p className="text-xs text-slate-500 mt-1">Set default number of items to display in tables.</p>
                    </div>
                  </div>
                </div>

                {/* Default Units Section */}
                <div className="border-t border-slate-200 pt-12 mb-12">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">Default Units</h3>
                  <p className="text-slate-600 text-sm mb-6">Set default units for measurements.</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Distance</label>
                      <select
                        name="distanceUnit"
                        value={settings.distanceUnit}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option>Kilometers (km)</option>
                        <option>Miles (mi)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Temperature</label>
                      <select
                        name="temperatureUnit"
                        value={settings.temperatureUnit}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option>Celsius (°C)</option>
                        <option>Fahrenheit (°F)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Wind Speed</label>
                      <select
                        name="windSpeedUnit"
                        value={settings.windSpeedUnit}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option>Kilometers per hour (km/h)</option>
                        <option>Miles per hour (mph)</option>
                        <option>Meters per second (m/s)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Precipitation</label>
                      <select
                        name="precipitationUnit"
                        value={settings.precipitationUnit}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option>Millimeters (mm)</option>
                        <option>Inches (in)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Map Preferences */}
                <div className="border-t border-slate-200 pt-12 mb-12">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">Map Preferences</h3>
                  <p className="text-slate-600 text-sm mb-6">Configure default map settings.</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Default Map View</label>
                      <select
                        name="defaultMapView"
                        value={settings.defaultMapView}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option>Cluster View</option>
                        <option>Satellite View</option>
                        <option>Heat Map View</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Default Zoom Level</label>
                      <select
                        name="defaultZoomLevel"
                        value={settings.defaultZoomLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option>8</option>
                        <option>10</option>
                        <option>12</option>
                        <option>14</option>
                        <option>16</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Map Theme</label>
                      <select
                        name="mapTheme"
                        value={settings.mapTheme}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option>Light</option>
                        <option>Dark</option>
                        <option>Satellite</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Show Incident Heatmap</label>
                      <div className="flex items-center gap-4">
                        <ToggleSwitch name="showHeatmap" checked={settings.showHeatmap} onChange={handleChange} />
                        <span className="text-sm text-slate-600">Display heatmap on the map</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Preferences */}
                <div className="border-t border-slate-200 pt-12 mb-12">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">System Preferences</h3>
                  <p className="text-slate-600 text-sm mb-6">Configure system-wide preferences.</p>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Auto Refresh Data</p>
                        <p className="text-sm text-slate-600 mt-1">Automatically refresh data in real-time</p>
                      </div>
                      <ToggleSwitch name="autoRefresh" checked={settings.autoRefresh} onChange={handleChange} />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Maintenance Mode</p>
                        <p className="text-sm text-slate-600 mt-1">Enable maintenance mode</p>
                      </div>
                      <ToggleSwitch name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Allow Public Reports</p>
                        <p className="text-sm text-slate-600 mt-1">Allow citizens to submit reports</p>
                      </div>
                      <ToggleSwitch name="allowPublicReports" checked={settings.allowPublicReports} onChange={handleChange} />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Require Email Verification</p>
                        <p className="text-sm text-slate-600 mt-1">Require email verification for new users</p>
                      </div>
                      <ToggleSwitch name="requireEmailVerification" checked={settings.requireEmailVerification} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* Backup Settings */}
                <div className="border-t border-slate-200 pt-12">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">Backup Settings</h3>
                    <button className="border border-slate-300 hover:border-slate-400 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                      Backup Now
                    </button>
                  </div>
                  <p className="text-slate-600 text-sm mb-6">Configure automatic data backup settings.</p>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Automatic Backups</p>
                        <p className="text-sm text-slate-600 mt-1">Enable automatic system backups</p>
                      </div>
                      <ToggleSwitch name="automaticBackups" checked={settings.automaticBackups} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-2">Backup Frequency</label>
                        <select
                          name="backupFrequency"
                          value={settings.backupFrequency}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-2">Backup Time</label>
                        <select
                          name="backupTime"
                          value={settings.backupTime}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option>00:00 AM</option>
                          <option>02:00 AM</option>
                          <option>04:00 AM</option>
                          <option>06:00 AM</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-2">Retention Period</label>
                        <select
                          name="retentionPeriod"
                          value={settings.retentionPeriod}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option>7 Days</option>
                          <option>14 Days</option>
                          <option>30 Days</option>
                          <option>60 Days</option>
                          <option>90 Days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder for other sections */}
            {activeSection !== 'general' && (
              <div className="bg-white rounded-lg shadow border border-slate-200 p-8 text-center">
                <ChevronRight className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg font-medium">
                  {menuItems.find(m => m.id === activeSection)?.label} settings coming soon
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
