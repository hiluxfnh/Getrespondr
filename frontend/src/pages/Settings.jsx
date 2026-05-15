import DashboardLayout from "../layouts/DashboardLayout";
import {
  Bell,
  CheckCircle2,
  Clock3,
  CreditCard,
  Edit3,
  Globe,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Settings2,
  UserCog,
  Users,
} from "lucide-react";

const profileInfo = [
  ["Full Name", "John Doe"],
  ["Email Address", "john.doe@getrespondr.com"],
  ["Phone Number", "+1 (555) 123-4567"],
  ["Job Title", "Emergency Coordinator"],
  ["Department", "Operations"],
  ["Location", "Central Operations Center, New York"],
  ["Employee ID", "GR-COORD-00123"],
  ["Date of Birth", "May 15, 1988"],
  ["Language", "English (US)"],
  ["Timezone", "(UTC-05:00) Eastern Time (ET)"],
];

const organizationInfo = [
  ["Organization", "City Emergency Management"],
  ["Organization Type", "Government"],
  ["Organization Size", "501-1000 employees"],
  ["Address", "123 Emergency Way, New York, NY 10001, USA"],
  ["Phone", "+1 (555) 987-6543"],
  ["Website", "www.cityemergency.gov"],
  ["Tax ID / EIN", "12-3456789"],
  ["Industry", "Public Safety"],
  ["Joined Date", "Jan 10, 2023"],
];

const emergencyContact = [
  ["Contact Name", "Sarah Johnson"],
  ["Relationship", "Spouse"],
  ["Phone Number", "+1 (555) 234-5678"],
  ["Alternate Phone", "+1 (555) 876-5432"],
  ["Email", "sarah.johnson@email.com"],
  ["Address", "456 Home Street, New York, NY 10001, USA"],
];

const notificationPreferences = [
  {
    title: "Email Notifications",
    description: "Receive alerts and updates via email",
    enabled: true,
    icon: Mail,
  },
  {
    title: "SMS Notifications",
    description: "Receive critical alerts via SMS",
    enabled: true,
    icon: Phone,
  },
  {
    title: "Push Notifications",
    description: "Receive push notifications on mobile",
    enabled: true,
    icon: Bell,
  },
  {
    title: "Incident Alerts",
    description: "Get notified about new incidents",
    enabled: true,
    icon: ShieldCheck,
  },
  {
    title: "System Updates",
    description: "Receive system and maintenance updates",
    enabled: false,
    icon: Settings2,
  },
];

const roles = [
  {
    title: "Super Administrator",
    description: "Full platform access and configuration",
    status: "Active",
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: ShieldCheck,
  },
  {
    title: "Coordinator",
    description: "Manage incidents, teams and resources",
    status: "Active",
    color: "text-violet-600",
    bg: "bg-violet-50",
    icon: Users,
  },
  {
    title: "Responder",
    description: "Respond to incidents and update status",
    status: "Inactive",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: UserCog,
  },
  {
    title: "Viewer",
    description: "View-only access to reports and maps",
    status: "Inactive",
    color: "text-orange-600",
    bg: "bg-orange-50",
    icon: Globe,
  },
  {
    title: "Public User",
    description: "Limited access to public information",
    status: "Inactive",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    icon: LockKeyhole,
  },
];

const recentActivity = [
  {
    title: "Profile updated",
    description: "You updated your profile information",
    time: "2 min ago",
    icon: Edit3,
    color: "text-blue-600",
  },
  {
    title: "Password changed",
    description: "Your password was successfully changed",
    time: "2 days ago",
    icon: LockKeyhole,
    color: "text-emerald-600",
  },
  {
    title: "Logged in",
    description: "Successful login from Chrome on Windows",
    time: "3 days ago",
    icon: CreditCard,
    color: "text-violet-600",
  },
  {
    title: "Role assigned",
    description: "You were assigned as Coordinator",
    time: "1 week ago",
    icon: UserCog,
    color: "text-orange-600",
  },
  {
    title: "Two-factor authentication enabled",
    description: "2FA was enabled on your account",
    time: "2 weeks ago",
    icon: CheckCircle2,
    color: "text-cyan-600",
  },
];

function InfoList({ rows, compact = false }) {
  return (
    <div className={compact ? "space-y-2.5" : "space-y-3"}>
      {rows.map(([label, value]) => (
        <div key={label} className={compact ? "flex items-start justify-between gap-4" : "grid grid-cols-[170px_1fr] gap-4 text-sm"}>
          <span className={`text-slate-500 ${compact ? "text-sm" : ""}`}>{label}</span>
          <span className={`text-slate-800 ${compact ? "text-sm text-right" : "text-sm"}`}>{value}</span>
        </div>
      ))}
    </div>
  );
}

function Toggle({ enabled }) {
  return (
    <div className={`relative h-6 w-11 rounded-full transition ${enabled ? "bg-blue-600" : "bg-slate-300"}`}>
      <div
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${enabled ? "right-0.5" : "left-0.5"}`}
      />
    </div>
  );
}

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <span>Settings</span>
            <span>›</span>
            <span className="text-slate-700">Profile</span>
          </div>
        </div>

        <div className="flex items-center gap-8 border-b border-slate-200 pb-1 text-sm font-medium">
          <button className="border-b-2 border-blue-600 pb-3 text-blue-600">My Profile</button>
          <button className="pb-3 text-slate-500 hover:text-slate-700">Security</button>
          <button className="pb-3 text-slate-500 hover:text-slate-700">Preferences</button>
          <button className="pb-3 text-slate-500 hover:text-slate-700">Integrations</button>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-6">
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-amber-200 via-orange-100 to-amber-400 p-[3px] shadow-sm">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                        <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_35%_30%,#f7d6b4_0%,#f0b37a_38%,#8b5e3c_100%)]" />
                      </div>
                    </div>
                    <button className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-slate-900 text-white shadow-lg">
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-900">John Doe</h2>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">Coordinator</span>
                    </div>
                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" /> john.doe@getrespondr.com <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600"><CheckCircle2 className="h-3 w-3" /> Verified</span></p>
                      <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" /> +1 (555) 123-4567</p>
                      <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" /> Central Operations Center, New York, USA</p>
                    </div>
                  </div>
                </div>

                <button className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-100">
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Edit</button>
                </div>
                <InfoList rows={profileInfo} />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Organization Information</h3>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Edit</button>
                </div>
                <InfoList rows={organizationInfo} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Emergency Contact</h3>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Edit</button>
                </div>
                <InfoList rows={emergencyContact} />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Notification Preferences</h3>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Edit</button>
                </div>
                <div className="space-y-4">
                  {notificationPreferences.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.description}</p>
                          </div>
                        </div>
                        <Toggle enabled={item.enabled} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-semibold text-slate-900">Account Summary</h3>
              <div className="grid grid-cols-6 gap-4 text-sm">
                {[
                  ["Account Status", "Active", CheckCircle2, "text-emerald-600"],
                  ["Member Since", "Jan 10, 2023", Clock3, "text-blue-600"],
                  ["Last Login", "May 18, 2024, 09:30 AM", Clock3, "text-blue-600"],
                  ["Login Devices", "3 Devices", Users, "text-violet-600"],
                  ["Two-Factor Auth", "Enabled", LockKeyhole, "text-emerald-600"],
                  ["Email Verification", "Verified", CheckCircle2, "text-emerald-600"],
                ].map(([label, value, Icon, color]) => (
                  <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Icon className={`h-4 w-4 ${color}`} />
                      <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Account Types & Roles</h3>
              <p className="mt-1 text-sm text-slate-500">Your account access and permissions across the platform</p>

              <div className="mt-4 space-y-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <div key={role.title} className="rounded-2xl border border-slate-100 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={`grid h-11 w-11 place-items-center rounded-2xl ${role.bg}`}>
                            <Icon className={`h-5 w-5 ${role.color}`} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{role.title}</p>
                            <p className="mt-1 text-xs text-slate-500">{role.description}</p>
                          </div>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${role.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                          {role.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="mt-4 w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100">
                Manage Account Access
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Recent Account Activity</h3>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.title} className="flex items-start gap-3">
                      <div className={`rounded-full bg-slate-50 p-2 ${activity.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                        <p className="text-xs text-slate-500">{activity.description}</p>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}