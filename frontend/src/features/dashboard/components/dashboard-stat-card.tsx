import { ArrowUpRight } from "lucide-react";

import type { DashboardStat } from "../types/dashboard";

interface DashboardStatCardProps {
  stat: DashboardStat;
  loading: boolean;
}

export default function DashboardStatCard({
  stat,
  loading,
}: DashboardStatCardProps) {
  const Icon = stat.icon;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
        >
          <Icon size={21} />
        </div>

        <ArrowUpRight size={18} className="text-gray-300" />
      </div>

      <p className="mt-5 text-sm text-gray-500">
        {stat.label}
      </p>

      <h2 className="mt-1 text-3xl font-bold text-gray-900">
        {loading ? "..." : stat.value}
      </h2>
    </div>
  );
}
