import {
  FolderKanban,
  Award,
  Code2,
  MessageSquare,
} from "lucide-react";

import { apiRequest } from "@/lib/api";
import type {
  DashboardData,
  DashboardProfile,
  DashboardStat,
} from "../types/dashboard";

async function settleRequest<T>(
  request: Promise<T>,
): Promise<PromiseSettledResult<T>> {
  try {
    return {
      status: "fulfilled",
      value: await request,
    };
  } catch (reason) {
    return {
      status: "rejected",
      reason,
    };
  }
}

function getCount(
  result: PromiseSettledResult<unknown[]>,
): string {
  if (result.status === "rejected") {
    return "—";
  }

  return String(result.value.length);
}

export async function getDashboardData(): Promise<DashboardData> {
  const [
    projectsResult,
    certificatesResult,
    skillsResult,
    messagesResult,
    profileResult,
  ] = await Promise.all([
    settleRequest(apiRequest<unknown[]>("/projects/")),
    settleRequest(apiRequest<unknown[]>("/certificates/")),
    settleRequest(apiRequest<unknown[]>("/skills/")),
    settleRequest(apiRequest<unknown[]>("/messages/?status=unread")),
    settleRequest(apiRequest<DashboardProfile>("/profile/me")),
  ]);

  const stats: DashboardStat[] = [
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
  ];

  const hasFailedRequest = [
    projectsResult,
    certificatesResult,
    skillsResult,
    messagesResult,
    profileResult,
  ].some((result) => result.status === "rejected");

  return {
    adminName:
      profileResult.status === "fulfilled"
        ? profileResult.value.full_name || "Alex"
        : "Alex",
    stats,
    notice: hasFailedRequest
      ? "Some dashboard information could not be loaded. Please check your backend connection and permissions."
      : "",
  };
}

export const INITIAL_DASHBOARD_STATS: DashboardStat[] = [
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
];
