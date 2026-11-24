
"use client";

import { useEffect, useState } from "react";
import { Menu, Bell } from "lucide-react";

import { apiRequest } from "@/lib/api";

type AdminHeaderProps = {
  onMenuClick: () => void;
};

type AdminHeaderProfile = {
  full_name: string;
  avatar_url: string | null;
  role: string;
};

export default function AdminHeader({
  onMenuClick,
}: AdminHeaderProps) {
  const [profile, setProfile] = useState<AdminHeaderProfile | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const data = await apiRequest<AdminHeaderProfile>("/profile/me");

        if (!cancelled) {
          setProfile(data);
        }
      } catch {
        // Keep the default header display if the profile cannot be loaded.
      }
    }

    function handleProfileUpdate(event: Event) {
      const customEvent = event as CustomEvent<AdminHeaderProfile>;
      setProfile(customEvent.detail);
    }

    window.addEventListener(
      "admin-profile-updated",
      handleProfileUpdate,
    );

    void loadProfile();

    return () => {
      cancelled = true;
      window.removeEventListener(
        "admin-profile-updated",
        handleProfileUpdate,
      );
    };
  }, []);

  const fullName = profile?.full_name || "Alex Gustilo";

  const initials = fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const role =
    profile?.role?.toLowerCase() === "admin"
      ? "Administrator"
      : profile?.role || "Administrator";

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-gray-100 bg-white/90 px-5 backdrop-blur-md sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div>
          <p className="text-sm font-semibold text-gray-900">
            Admin Dashboard
          </p>
          <p className="text-xs text-gray-400">
            Manage your portfolio
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          title="Notifications"
          className="rounded-xl border border-gray-100 p-2.5 text-gray-500 transition hover:bg-gray-50"
        >
          <Bell size={19} />
        </button>

        <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#6d5ce7] to-[#3978e8] text-sm font-semibold text-white">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Admin profile"
                className="h-full w-full object-cover"
              />
            ) : (
              initials || "A"
            )}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              {fullName}
            </p>
            <p className="text-xs text-gray-400">
              {role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
