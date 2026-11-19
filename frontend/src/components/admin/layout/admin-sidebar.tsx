
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Code2,
  Award,
  MessageSquare,
  UserRound,
  ArrowLeft,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    label: "Skills",
    href: "/admin/skills",
    icon: Code2,
  },
  {
    label: "Certificates",
    href: "/admin/certificates",
    icon: Award,
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    label: "Profile",
    href: "/admin/profile",
    icon: UserRound,
  },
];

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function AdminSidebar({
  open,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <button
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-gray-100 bg-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-gray-100 px-6">
          <Link
            href="/admin/dashboard"
            className="text-xl font-bold tracking-tight text-gray-900"
          >
            Alex<span className="text-[#6d5ce7]">.</span>
            <span className="ml-2 text-xs font-medium text-gray-400">
              ADMIN
            </span>
          </Link>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pt-7">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#6d5ce7]/10 text-[#6d5ce7]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon size={19} strokeWidth={1.8} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-gray-100 p-5">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            Back to Portfolio
          </Link>
        </div>
      </aside>
    </>
  );
}
