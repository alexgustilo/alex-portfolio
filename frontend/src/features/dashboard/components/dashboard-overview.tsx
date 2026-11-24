export default function DashboardOverview() {
  return (
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
  );
}
