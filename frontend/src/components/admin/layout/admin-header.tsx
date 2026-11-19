
"use client";

import { Menu, Bell } from "lucide-react";

type AdminHeaderProps = {
  onMenuClick: () => void;
};

export default function AdminHeader({
  onMenuClick,
}: AdminHeaderProps) {
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
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#6d5ce7] to-[#3978e8] text-sm font-semibold text-white">
            A
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              Alex Gustilo
            </p>
            <p className="text-xs text-gray-400">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
