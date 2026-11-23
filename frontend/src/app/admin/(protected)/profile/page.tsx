
"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  UserRound,
  Mail,
  ShieldCheck,
  CalendarDays,
  Save,
  RefreshCw,
  LogOut,
  Camera,
  LoaderCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { logoutAdmin } from "@/lib/auth";

type AdminProfile = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
};

type AdminAccount = {
  id: string;
  email: string | null;
  app_metadata: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
};

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [account, setAccount] = useState<AdminAccount | null>(null);

  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const [profileData, accountData] = await Promise.all([
          apiRequest<AdminProfile>("/profile/me"),
          apiRequest<AdminAccount>("/auth/me"),
        ]);

        if (cancelled) return;

        setProfile(profileData);
        setAccount(accountData);
        setFullName(profileData.full_name || "");
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load administrator profile.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setNotice("");

    const trimmedName = fullName.trim();

    if (!trimmedName) {
      setError("Full name is required.");
      return;
    }

    if (trimmedName.length > 150) {
      setError("Full name must not exceed 150 characters.");
      return;
    }

    setSaving(true);

    try {
      const updatedProfile = await apiRequest<AdminProfile>(
        "/profile/me",
        {
          method: "PATCH",
          body: JSON.stringify({
            full_name: trimmedName,
          }),
        },
      );

      setProfile(updatedProfile);
      setFullName(updatedProfile.full_name);
      setNotice("Your profile has been updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update your profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    setError("");

    try {
      await logoutAdmin();
    } catch {
      // The local session is cleared even if the API logout request fails.
    } finally {
      router.replace("/admin/login");
    }
  }

  const initials = (profile?.full_name || "A")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <LoaderCircle size={20} className="animate-spin text-[#6d5ce7]" />
          Loading administrator profile...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-[#6d5ce7]">
          Account Settings
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage your administrator information and account details.
        </p>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {notice}
        </div>
      )}

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#6d5ce7] to-[#3978e8] text-2xl font-bold text-white">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Administrator avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {profile?.full_name || "Administrator"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {account?.email || "No email available"}
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#6d5ce7]">
              <ShieldCheck size={14} />
              Administrator
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <form
          onSubmit={handleSaveProfile}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#6d5ce7]">
              <UserRound size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Personal Information
              </h2>
              <p className="text-xs text-gray-400">
                Update your profile name.
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="full_name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <input
                id="full_name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                maxLength={150}
                required
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#6d5ce7] focus:ring-2 focus:ring-[#6d5ce7]/10"
              />
            </div>

            <button
              type="submit"
              disabled={saving || !profile || fullName.trim() === profile.full_name}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6d5ce7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b4bd1] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Account Information
              </h2>
              <p className="text-xs text-gray-400">
                Your administrator account details.
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-5">
            <div className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 text-gray-400" />

              <div className="min-w-0">
                <p className="text-xs text-gray-400">Email Address</p>
                <p className="mt-1 break-all text-sm font-medium text-gray-800">
                  {account?.email || "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck size={18} className="mt-0.5 text-gray-400" />

              <div>
                <p className="text-xs text-gray-400">Account Role</p>
                <p className="mt-1 text-sm font-medium capitalize text-gray-800">
                  {profile?.role || "Administrator"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays size={18} className="mt-0.5 text-gray-400" />

              <div>
                <p className="text-xs text-gray-400">Account Created</p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "Not available"}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400">Administrator ID</p>
              <p className="mt-1 break-all font-mono text-xs text-gray-500">
                {account?.id || profile?.id || "Not available"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <LogOut size={19} className="text-red-500" />

              <h2 className="font-semibold text-gray-900">
                Session Management
              </h2>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Sign out of your administrator account on this device.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            {loggingOut ? (
              <RefreshCw size={17} className="animate-spin" />
            ) : (
              <LogOut size={17} />
            )}
            {loggingOut ? "Signing Out..." : "Logout"}
          </button>
        </div>
      </section>
    </div>
  );
}
