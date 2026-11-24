"use client";

import { useEffect, useState } from "react";

import DashboardHeader from "@/features/dashboard/components/dashboard-header";
import DashboardStatCard from "@/features/dashboard/components/dashboard-stat-card";
import DashboardOverview from "@/features/dashboard/components/dashboard-overview";

import {
  getDashboardData,
  INITIAL_DASHBOARD_STATS,
} from "@/features/dashboard/services/dashboard-service";

import type { DashboardData } from "@/features/dashboard/types/dashboard";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData>({
    adminName: "Alex",
    stats: INITIAL_DASHBOARD_STATS,
    notice: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const data = await getDashboardData();

        if (!cancelled) {
          setDashboard(data);
        }
      } catch {
        if (!cancelled) {
          setDashboard((previous) => ({
            ...previous,
            notice:
              "Unable to load dashboard information. Please check your backend connection and permissions.",
          }));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <DashboardHeader adminName={dashboard.adminName} />

      {dashboard.notice && (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700"
        >
          {dashboard.notice}
        </div>
      )}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {dashboard.stats.map((stat) => (
          <DashboardStatCard
            key={stat.label}
            stat={stat}
            loading={loading}
          />
        ))}
      </section>

      <DashboardOverview />
    </div>
  );
}
