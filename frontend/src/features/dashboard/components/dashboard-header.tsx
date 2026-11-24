interface DashboardHeaderProps {
  adminName: string;
}

export default function DashboardHeader({
  adminName,
}: DashboardHeaderProps) {
  return (
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
  );
}
