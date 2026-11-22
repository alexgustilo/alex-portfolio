"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loginAdmin } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      await loginAdmin(email.trim(), password);

      router.replace("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fc] px-5 py-12">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-3xl font-bold tracking-tight text-gray-900"
          >
            Alex<span className="text-[#6d5ce7]">.</span>
          </Link>

          <p className="mt-3 text-sm text-gray-500">
            Portfolio Administration
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">

          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to manage your portfolio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="Enter your admin email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6d5ce7] focus:ring-2 focus:ring-[#6d5ce7]/10"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6d5ce7] focus:ring-2 focus:ring-[#6d5ce7]/10"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-[#6d5ce7] to-[#3978e8] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="mt-7 text-center text-xs text-gray-400">
            Authorized administrators only.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 transition hover:text-[#6d5ce7]"
          >
            Back to Portfolio
          </Link>
        </div>

      </div>
    </main>
  );
}
