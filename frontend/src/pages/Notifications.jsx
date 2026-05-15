import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle2, Users, Package, MessageCircle, Settings, Search, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const notificationTypes = [
    { id: 'all', label: 'All Notifications', count: 128, color: 'text-blue-600' },
    { id: 'unread', label: 'Unread', count: 3, color: 'text-red-600' },
    { id: 'incidents', label: 'Incidents', count: 45, color: 'text-slate-600' },
    { id: 'tasks', label: 'Tasks', count: 28, color: 'text-slate-600' },
    { id: 'system', label: 'System', count: 22, color: 'text-slate-600' },
    { id: 'mentions', label: 'Mentions', count: 10, color: 'text-slate-600' },
  ];

  const notifications = [
    {
      id: 1,
      type: 'incident',
      title: 'New incident reported: Flooding in Downtown',
      description: 'A new Critical incident has been reported in Central District.',
      timeAgo: '2 min ago',
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      unread: true,
    },
    {
      id: 2,
      type: 'incident',
      title: 'Team Alpha assigned to incident',
      description: 'You have been assigned to "Flooding in Downtown" incident.',
      timeAgo: '5 min ago',
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      unread: true,
    },
    {
      id: 3,
      type: 'task',
      title: 'Task completed: Initial damage assessment',
      description: 'Task has been marked as completed by Team Bravo.',
      timeAgo: '15 min ago',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      unread: false,
    },
    {
      id: 4,
      type: 'incident',
      title: 'High severity alert: Building Collapse',
      description: 'Incident severity updated to High in North Hills area.',
      timeAgo: '20 min ago',
      icon: AlertTriangle,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      unread: true,
    },
    {
      id: 5,
      type: 'resource',
      title: 'New resources available',
      description: '12 Medical Kits are now available in Warehouse 1.',
      timeAgo: '25 min ago',
      icon: Package,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      unread: false,
    },
    {
      id: 6,
      type: 'mention',
      title: 'You were mentioned in a comment',
      description: 'Team Charlie mentioned you in a task comment.',
      timeAgo: '35 min ago',
      icon: MessageCircle,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      unread: false,
    },
    {
      id: 7,
      type: 'system',
      title: 'System maintenance scheduled',
      description: 'Scheduled maintenance on May 18, 2024 at 02:00 AM.',
      timeAgo: '1h ago',
      icon: Settings,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      unread: false,
    },
    {
      id: 8,
      type: 'resource',
      title: 'Resource request fulfilled',
      description: 'Your request for Rescue Boats has been approved.',
      timeAgo: '2h ago',
      icon: Package,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      unread: false,
    },
    {
      id: 9,
      type: 'alert',
      title: 'Low stock alert: Blankets',
      description: 'Blankets stock is running low in Warehouse 3.',
      timeAgo: '3h ago',
      icon: AlertTriangle,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      unread: false,
    },
    {
      id: 10,
      type: 'incident',
      title: 'Incident resolved: Power Outage',
      description: 'Power Outage in East Sector has been marked as resolved.',
      timeAgo: '4h ago',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      unread: false,
    },
  ];

  const NotificationSummaryChart = () => (
    <svg viewBox="0 0 100 100" className="w-full h-32">
      <circle cx="50" cy="50" r="45" fill="#ef4444" opacity="0.7" />
      <circle cx="50" cy="50" r="42" fill="#ef4444" />
      <circle cx="50" cy="50" r="38" fill="url(#pieGradient)" strokeDasharray="53 100" strokeDashoffset="0" stroke="none" />
      <circle cx="50" cy="50" r="33" fill="white" />
      <defs>
        <linearGradient id="pieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="30%" stopColor="#3b82f6" />
          <stop offset="55%" stopColor="#10b981" />
          <stop offset="75%" stopColor="#f59e0b" />
          <stop offset="90%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <text x="50" y="55" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">128</text>
      <text x="50" y="68" textAnchor="middle" fontSize="10" fill="#64748b">Total</text>
    </svg>
  );

  const ToggleSwitch = ({ name, checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
              <p className="text-slate-600 text-sm mt-1">Stay updated with real-time alerts and system notifications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow border border-slate-200 p-6 mb-6">
              {/* Search and Controls */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium">
                  All Types <ChevronRight className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium">
                  Mark all as read
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg">
                  <MoreVertical className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-6 border-b border-slate-200 pb-4 mb-6 overflow-x-auto">
                {notificationTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setActiveFilter(type.id)}
                    className={`whitespace-nowrap pb-2 text-sm font-medium transition-colors ${
                      activeFilter === type.id
                        ? `text-blue-600 border-b-2 border-blue-600`
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {type.label} <span className={`ml-1 ${type.color}`}>{type.count}</span>
                  </button>
                ))}
              </div>

              {/* Notifications List */}
              <div className="space-y-4">
                {notifications.map(notif => {
                  const IconComponent = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                        notif.unread
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${notif.iconBg}`}>
                          <IconComponent className={`w-5 h-5 ${notif.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-slate-900">{notif.title}</h3>
                              <p className="text-slate-600 text-sm mt-1">{notif.description}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-slate-500">{notif.timeAgo}</span>
                              {notif.unread && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-600">Showing 1 to 10 of 128 notifications</p>
                <div className="flex items-center gap-2">
                  <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-1">
                    {[1, 2, 3, '...', 13].map((num, idx) => (
                      <button
                        key={idx}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          num === 1
                            ? 'bg-blue-600 text-white'
                            : 'border border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <select className="ml-4 px-3 py-1 border border-slate-300 rounded-lg text-sm">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-1 space-y-6">
            {/* Notification Summary */}
            <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Notification Summary</h3>
              <div className="mb-4">
                <NotificationSummaryChart />
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-slate-700">Incidents</span>
                  </div>
                  <span className="font-semibold text-slate-900">45 (35%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-slate-700">Tasks</span>
                  </div>
                  <span className="font-semibold text-slate-900">28 (22%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-slate-700">System</span>
                  </div>
                  <span className="font-semibold text-slate-900">22 (17%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-slate-700">Mentions</span>
                  </div>
                  <span className="font-semibold text-slate-900">10 (8%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-slate-700">Other</span>
                  </div>
                  <span className="font-semibold text-slate-900">23 (18%)</span>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Filters</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-700">Unread</span>
                  </div>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">3</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-700">High Priority</span>
                  </div>
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">12</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-700">Mentions</span>
                  </div>
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">10</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-700">Incidents</span>
                  </div>
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">45</span>
                </button>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Notification Settings</h3>
              <p className="text-slate-600 text-xs mb-4">Manage how you receive notifications</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-700">Email Notifications</span>
                  </div>
                  <ToggleSwitch name="email" checked={true} onChange={() => {}} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-700">Push Notifications</span>
                  </div>
                  <ToggleSwitch name="push" checked={true} onChange={() => {}} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-700">SMS Alerts</span>
                  </div>
                  <ToggleSwitch name="sms" checked={false} onChange={() => {}} />
                </div>
              </div>
              <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium py-2">
                Manage Preferences →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Mail = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-10 5L2 7" />
  </svg>
);