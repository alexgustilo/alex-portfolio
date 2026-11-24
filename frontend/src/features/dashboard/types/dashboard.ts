import type { LucideIcon } from "lucide-react";

export interface DashboardProfile {
  full_name: string;
}

export interface DashboardStat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export interface DashboardData {
  adminName: string;
  stats: DashboardStat[];
  notice: string;
}
