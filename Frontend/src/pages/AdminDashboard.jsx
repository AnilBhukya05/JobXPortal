import React, {
  useEffect,
  useState,
} from "react";

import {
  BriefcaseBusiness,
  Users,
  CheckCircle2,
  Clock3,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

import { request } from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const result =
          await request(
            "/careers/admin/dashboard/stats"
          );

        setStats(result.stats);
      } catch (err) {
        setError(
          err.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const cards = [
    {
      label: "Total Careers",
      value:
        stats?.totalCareers ?? 0,
      icon: BriefcaseBusiness,
      bg: "bg-indigo-50",
      color: "text-[#4F46E5]",
    },
    {
      label: "Active Careers",
      value:
        stats?.activeCareers ?? 0,
      icon: CheckCircle2,
      bg: "bg-green-50",
      color: "text-green-600",
    },
    {
      label: "Applications",
      value:
        stats?.totalApplications ?? 0,
      icon: Users,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      label: "New Applications",
      value:
        stats?.newApplications ?? 0,
      icon: Clock3,
      bg: "bg-amber-50",
      color: "text-amber-600",
    },
  ];

  return (
    <div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold md:text-3xl">
          Dashboard
        </h2>

        <p className="mt-2 text-slate-500">
          Overview of JobXPortal recruitment.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* STATS */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >

              <div className="flex items-center justify-between">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} ${card.color}`}
                >
                  <Icon size={23} />
                </div>

              </div>

              <div className="mt-5">

                <div className="text-3xl font-bold">
                  {loading
                    ? "—"
                    : card.value}
                </div>

                <div className="mt-1 text-sm text-slate-500">
                  {card.label}
                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* QUICK ACTIONS */}

      <div className="mt-8 grid gap-5 md:grid-cols-2">

        <Link
          to="/admin/careers/new"
          className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
        >

          <div className="flex items-center justify-between">

            <div>

              <div className="text-lg font-bold">
                Create Career
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Add a new JobXPortal position.
              </p>

            </div>

            <div className="rounded-xl bg-indigo-50 p-3 text-[#4F46E5] transition group-hover:bg-[#4F46E5] group-hover:text-white">
              <ArrowRight size={20} />
            </div>

          </div>

        </Link>

        <Link
          to="/admin/applications"
          className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
        >

          <div className="flex items-center justify-between">

            <div>

              <div className="text-lg font-bold">
                Review Applications
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Review candidates who applied.
              </p>

            </div>

            <div className="rounded-xl bg-indigo-50 p-3 text-[#4F46E5] transition group-hover:bg-[#4F46E5] group-hover:text-white">
              <ArrowRight size={20} />
            </div>

          </div>

        </Link>

      </div>

      {/* INFO */}

      <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">

        <h3 className="font-bold text-[#312E81]">
          Recruitment management
        </h3>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-indigo-900/70">
          Careers created here are published on
          the public JobXPortal Careers page.
          You can activate, deactivate, edit or
          delete positions at any time.
        </p>

      </div>

    </div>
  );
}