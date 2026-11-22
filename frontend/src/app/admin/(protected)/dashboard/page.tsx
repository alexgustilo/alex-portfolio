"use client";

import { useEffect, useState } from "react";
import {
  FolderKanban,
  Award,
  Code2,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";

import { apiRequest } from "@/lib/api";


type DashboardProfile = {
  full_name: string;
};

type DashboardStat = {
  label: string;
  value: string;
  icon: typeof FolderKanban;
  color: string;
};


export default function DashboardPage() {
  const [adminName, setAdminName] = useState("Alex");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const [stats, setStats] = useState<DashboardStat[]>([
    {
      label: "Total Projects",
      value: "—",
      icon: FolderKanban,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Certificates",
      value: "—",
      icon: Award,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Technical Skills",
      value: "—",
      icon: Code2,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "New Messages",
      value: "—",
      icon: MessageSquare,
      color: "bg-sky-50 text-sky-600",
    },
  ]);


  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      const results = await Promise.allSettled([
        apiRequest<unknown[]>("/projects/"),
        apiRequest<unknown[]>("/certificates/"),
        apiRequest<unknown[]>("/skills/"),
        apiRequest<unknown[]>("/messages/?status=unread"),
        apiRequest<DashboardProfile>("/profile/me"),
      ]);

      if (cancelled) return;

      const [
        projectsResult,
        certificatesResult,
        skillsResult,
        messagesResult,
        profileResult,
      ] = results;

      const getCount = (
        result: PromiseSettledResult<unknown[]>,
      ) => {
        if (result.status === "rejected") {
          return "—";
        }

        return String(result.value.length);
      };

      setStats([
        {
          label: "Total Projects",
          value: getCount(projectsResult),
          icon: FolderKanban,
          color: "bg-purple-50 text-purple-600",
        },
        {
          label: "Certificates",
          value: getCount(certificatesResult),
          icon: Award,
          color: "bg-blue-50 text-blue-600",
        },
        {
          label: "Technical Skills",
          value: getCount(skillsResult),
          icon: Code2,
          color: "bg-indigo-50 text-indigo-600",
        },
        {
          label: "New Messages",
          value: getCount(messagesResult),
          icon: MessageSquare,
          color: "bg-sky-50 text-sky-600",
        },
      ]);

      if (profileResult.status === "fulfilled") {
        setAdminName(profileResult.value.full_name || "Alex");
      }

      const hasFailedRequest = results.some(
        (result) => result.status === "rejected",
      );

      if (hasFailedRequest) {
        setNotice(
          "Some dashboard information could not be loaded. Please check your backend connection and permissions.",
        );
      }

      setLoading(false);
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);


  return (
    <div className="space-y-8">

      <section>
        <p className="text-sm font-medium text-[#6d5ce7]">
          Dashboard Overview
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Welcome back, {adminName}!
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Here&apos;s what&apos;s happening with your portfolio.
        </p>
      </section>


      {notice && (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700"
        >
          {notice}
        </div>
      )}


      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={21} />
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-gray-300"
                />
              </div>

              <p className="mt-5 text-sm text-gray-500">
                {stat.label}
              </p>

              <h2 className="mt-1 text-3xl font-bold text-gray-900">
                {loading ? "..." : stat.value}
              </h2>
            </div>
          );
        })}
      </section>


      <section className="grid gap-5 xl:grid-cols-2">

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            Quick Overview
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Your portfolio management dashboard provides
            an overview of your projects, technical skills,
            certificates, and incoming messages.
          </p>
        </div>


        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            Getting Started
          </h2>

          <ul className="mt-4 space-y-3 text-sm text-gray-500">
            <li>✓ Admin dashboard structure</li>
            <li>✓ Backend API connection</li>
            <li>✓ Administrator authentication</li>
            <li>○ Complete portfolio management</li>
          </ul>
        </div>

      </section>

    </div>
  );
}
