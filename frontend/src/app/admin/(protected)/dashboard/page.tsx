
import {
  FolderKanban,
  Award,
  Code2,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    label: "Total Projects",
    value: "4",
    icon: FolderKanban,
    color: "bg-purple-50 text-purple-600",
  },
  {
    label: "Certificates",
    value: "3",
    icon: Award,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Technical Skills",
    value: "12",
    icon: Code2,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    label: "New Messages",
    value: "0",
    icon: MessageSquare,
    color: "bg-sky-50 text-sky-600",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-[#6d5ce7]">
          Dashboard Overview
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Welcome back, Alex!
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Here&apos;s what&apos;s happening with your portfolio.
        </p>
      </section>

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
                {stat.value}
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
            Your portfolio management dashboard is ready.
            You can manage projects, skills, certificates,
            messages, and profile information from the
            navigation menu.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            Getting Started
          </h2>

          <ul className="mt-4 space-y-3 text-sm text-gray-500">
            <li>✓ Admin dashboard structure</li>
            <li>✓ Navigation and responsive layout</li>
            <li>○ Connect Supabase database</li>
            <li>○ Configure administrator authentication</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
