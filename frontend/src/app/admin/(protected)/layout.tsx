"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminSidebar from "@/components/admin/layout/admin-sidebar";
import AdminHeader from "@/components/admin/layout/admin-header";

import {
  ApiError,
  clearAuthSession,
  getAccessToken,
} from "@/lib/api";

import { getCurrentAdmin } from "@/lib/auth";


export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    let cancelled = false;

    async function verifyAdminSession() {
      const token = getAccessToken();

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      let shouldRedirect = false;

      try {
        const admin = await getCurrentAdmin();

        if (admin.app_metadata?.role !== "admin") {
          clearAuthSession();
          router.replace("/admin/login");
          shouldRedirect = true;
          return;
        }

      } catch (err) {
        if (
          err instanceof ApiError &&
          (err.status === 401 || err.status === 403)
        ) {
          clearAuthSession();
          router.replace("/admin/login");
          shouldRedirect = true;
          return;
        }

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to verify administrator session."
          );
        }

      } finally {
        if (!cancelled && !shouldRedirect) {
          setIsLoading(false);
        }
      }
    }

    void verifyAdminSession();

    return () => {
      cancelled = true;
    };
  }, [router]);


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc]">
        <p className="text-sm font-medium text-gray-500">
          Verifying administrator session...
        </p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f8f9fc] px-5">
        <p className="text-center text-sm text-red-600">
          {error}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-[#6d5ce7] px-5 py-3 text-sm font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-[260px]">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="mx-auto w-full max-w-[1600px] p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
