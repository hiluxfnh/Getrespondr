import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../firebase/auth";
import cloudinaryService from "../services/cloudinaryService";
import {
  BadgeCheck,
  Building2,
  Clock3,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Save,
  Sparkles,
  UserRound,
  IdCard,
} from "lucide-react";

function Field({ label, children, hint, icon: Icon }) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        {Icon ? <Icon className="h-4 w-4 text-slate-400" /> : null}
        {label}
      </span>
      {children}
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
    </label>
  );
}

function initials(value) {
  return String(value || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "U";
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    displayName: "",
    phoneNumber: "",
    jobTitle: "",
    department: "",
    organization: "",
    location: "",
    timezone: "",
    language: "",
    bio: "",
    avatarUrl: "",
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      displayName: user.displayName || "",
      phoneNumber: user.phoneNumber || "",
      jobTitle: user.jobTitle || "",
      department: user.department || "",
      organization: user.organization || "",
      location: user.location || "",
      timezone: user.timezone || "",
      language: user.language || "",
      bio: user.bio || "",
      avatarUrl: user.avatarUrl || "",
      emailNotifications: user.notificationPreferences?.email ?? true,
      smsNotifications: user.notificationPreferences?.sms ?? true,
      pushNotifications: user.notificationPreferences?.push ?? true,
    });
    setAvatarPreview("");
  }, [user]);

  const profileName = useMemo(() => form.displayName || user?.displayName || user?.email || "User", [form.displayName, user]);
  const avatarLabel = initials(profileName);
  const avatarSource = avatarPreview || form.avatarUrl || user?.avatarUrl || "";

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setError("");
      setMessage("");
      setAvatarUploading(true);

      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setAvatarPreview(String(readerEvent.target?.result || ""));
      };
      reader.readAsDataURL(file);

      const url = await cloudinaryService.uploadImage(file);
      setForm((current) => ({ ...current, avatarUrl: url }));
      setAvatarPreview("");
      setMessage("Avatar uploaded successfully.");
    } catch (err) {
      setError(err.message);
      setAvatarPreview("");
    } finally {
      setAvatarUploading(false);
      event.target.value = "";
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!user) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await updateProfile({
        displayName: form.displayName,
        phoneNumber: form.phoneNumber,
        jobTitle: form.jobTitle,
        department: form.department,
        organization: form.organization,
        location: form.location,
        timezone: form.timezone,
        language: form.language,
        bio: form.bio,
        avatarUrl: form.avatarUrl,
        notificationPreferences: {
          email: form.emailNotifications,
          sms: form.smsNotifications,
          push: form.pushNotifications,
        },
      });

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-[linear-gradient(135deg,#071d40_0%,#12305d_45%,#0ea5e9_100%)] px-6 py-8 text-white sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <div className="grid h-24 w-24 place-items-center rounded-3xl border border-white/20 bg-white/10 text-2xl font-bold backdrop-blur">
                  {avatarSource ? (
                    <img
                      src={avatarSource}
                      alt={profileName}
                      className="h-full w-full rounded-3xl object-cover"
                    />
                  ) : (
                    avatarLabel
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">User Profile</p>
                  <h1 className="mt-2 text-3xl font-bold">{profileName}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/85">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                      <BadgeCheck className="h-4 w-4" />
                      {user?.role || "Viewer"}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                      <Mail className="h-4 w-4" />
                      {user?.email || "No email set"}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                      <Clock3 className="h-4 w-4" />
                      {form.timezone || "Timezone not set"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm backdrop-blur sm:grid-cols-3">
                <div>
                  <p className="text-white/60">Role</p>
                  <p className="mt-1 font-semibold">{user?.role || "Viewer"}</p>
                </div>
                <div>
                  <p className="text-white/60">Access</p>
                  <p className="mt-1 font-semibold">Public-first</p>
                </div>
                <div>
                  <p className="text-white/60">Status</p>
                  <p className="mt-1 font-semibold">Editable profile</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.4fr_0.9fr] sm:px-8">
            <form onSubmit={handleSave} className="space-y-6">
              {message ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {message}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="grid gap-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:grid-cols-2">
                <Field label="Display Name" icon={UserRound}>
                  <input
                    name="displayName"
                    value={form.displayName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="Your full name"
                  />
                </Field>

                <Field label="Email" icon={Mail} hint="Managed through sign-in">
                  <input
                    value={user?.email || ""}
                    disabled
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                  />
                </Field>

                <Field label="Phone Number" icon={Phone}>
                  <input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="+1 (555) 123-4567"
                  />
                </Field>

                <Field label="Job Title" icon={IdCard}>
                  <input
                    name="jobTitle"
                    value={form.jobTitle}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="Emergency Coordinator"
                  />
                </Field>

                <Field label="Department" icon={Building2}>
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="Operations"
                  />
                </Field>

                <Field label="Organization" icon={Building2}>
                  <input
                    name="organization"
                    value={form.organization}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="City Emergency Management"
                  />
                </Field>

                <Field label="Location" icon={MapPin}>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="Central Operations Center"
                  />
                </Field>

                <Field label="Timezone" icon={Clock3}>
                  <input
                    name="timezone"
                    value={form.timezone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="(UTC-05:00) Eastern Time"
                  />
                </Field>

                <Field label="Language" icon={Globe2}>
                  <input
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="English (US)"
                  />
                </Field>
              </div>

              <Field label="Bio" icon={Sparkles} hint="A short summary that appears on your account card.">
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="Share your role and response focus."
                />
              </Field>

              <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Avatar</p>
                    <p className="text-xs text-slate-500">Upload a profile image or keep the generated initials.</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                    {avatarUploading ? "Uploading..." : "Choose Image"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleAvatarSelect}
                      disabled={avatarUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                  <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl bg-white text-xl font-bold text-slate-700 shadow-sm">
                    {avatarSource ? (
                      <img src={avatarSource} alt="Avatar preview" className="h-full w-full object-cover" />
                    ) : (
                      avatarLabel
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">{avatarSource ? "Current avatar ready" : "No avatar uploaded"}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Cloudinary stores the image and the URL is saved with your profile.
                    </p>
                    {form.avatarUrl ? (
                      <button
                        type="button"
                        onClick={() => setForm((current) => ({ ...current, avatarUrl: "" }))}
                        className="mt-3 inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        Remove avatar
                      </button>
                    ) : null}
                  </div>
                </div>

                <Field label="Avatar URL" icon={UserRound} hint="Optional fallback if you already have a hosted image.">
                  <input
                    name="avatarUrl"
                    value={form.avatarUrl}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="https://..."
                  />
                </Field>
              </div>

              <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
                <p className="text-sm text-slate-500">Choose how you want to receive incident and system alerts.</p>
                <div className="grid gap-3">
                  <Toggle label="Email Alerts" checked={form.emailNotifications} onChange={handleChange} name="emailNotifications" />
                  <Toggle label="SMS Alerts" checked={form.smsNotifications} onChange={handleChange} name="smsNotifications" />
                  <Toggle label="Push Alerts" checked={form.pushNotifications} onChange={handleChange} name="pushNotifications" />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Profile Snapshot</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <p><span className="font-medium text-slate-900">Name:</span> {profileName}</p>
                  <p><span className="font-medium text-slate-900">Email:</span> {user?.email || "-"}</p>
                  <p><span className="font-medium text-slate-900">Role:</span> {user?.role || "Viewer"}</p>
                  <p><span className="font-medium text-slate-900">Organization:</span> {form.organization || "Not set"}</p>
                  <p><span className="font-medium text-slate-900">Department:</span> {form.department || "Not set"}</p>
                  <p><span className="font-medium text-slate-900">Location:</span> {form.location || "Not set"}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 text-slate-800 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Account Tips</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li>Keep your display name and job title accurate for incident handoffs.</li>
                  <li>Use the notification toggles to tune alerts for your role.</li>
                  <li>Update your location so responders can identify your base quickly.</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}