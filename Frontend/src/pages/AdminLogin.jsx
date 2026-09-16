import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError(
        "Please enter your email and password."
      );

      return;
    }

    setLoading(true);

    const result = await login({
      email: form.email,
      password: form.password,
      remember: true,
    });

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    /*
      AuthContext has already stored the user.
      Check admin after successful login.
    */

    const storedUser =
      JSON.parse(
        localStorage.getItem(
          "jobxportal_user"
        ) || "null"
      );

    /*
      If your AuthContext does not store the user,
      navigate and AdminRoute will perform the
      final role protection.
    */

    if (
      storedUser &&
      storedUser.role !== "admin"
    ) {
      setError(
        "This account does not have admin access."
      );

      return;
    }

    navigate(
      "/admin/dashboard",
      {
        replace: true,
      }
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] px-5 py-12 text-[#0B132B]">

      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">

        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">

          <div className="mb-8 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
              <ShieldCheck size={30} />
            </div>

            <h1 className="mt-6 text-3xl font-bold">
              Admin Login
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to manage JobXPortal.
            </p>

          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  autoComplete="username"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50"
                />

              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-12 outline-none transition focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4F46E5]"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-3.5 font-semibold text-white transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : "Login to Admin Panel"}

              {!loading && (
                <ArrowRight size={18} />
              )}
            </button>

          </form>

          <div className="mt-7 rounded-xl bg-slate-50 p-4 text-center text-xs leading-5 text-slate-500">
            This area is restricted to authorized
            JobXPortal administrators.
          </div>

        </div>
      </div>
    </div>
  );
}