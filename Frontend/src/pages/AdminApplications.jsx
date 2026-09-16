import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  Users,
  ExternalLink,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  FileText,
  BriefcaseBusiness,
  GitBranch,
} from "lucide-react";

import { request } from "../services/api";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  /* =========================================================
     LOAD APPLICATIONS
  ========================================================= */

  async function loadApplications(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      /*
       * IMPORTANT:
       * Backend route:
       *
       * GET /api/careers/admin-applications
       */

      const result = await request(
        "/careers/admin-applications"
      );

      setApplications(
        Array.isArray(result.applications)
          ? result.applications
          : []
      );

    } catch (err) {
      console.error(
        "APPLICATION FETCH ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to fetch applications"
      );

      setApplications([]);

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  /* =========================================================
     FILTER APPLICATIONS
  ========================================================= */

  const filteredApplications = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return applications.filter(
      (application) => {
        const name =
          application.name
            ?.toLowerCase() || "";

        const email =
          application.email
            ?.toLowerCase() || "";

        const careerTitle =
          application.career?.title
            ?.toLowerCase() || "";

        const status =
          application.status
            ?.toLowerCase() || "";

        const matchesSearch =
          !keyword ||
          name.includes(keyword) ||
          email.includes(keyword) ||
          careerTitle.includes(keyword);

        const matchesStatus =
          statusFilter === "all" ||
          status ===
            statusFilter.toLowerCase();

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    applications,
    search,
    statusFilter,
  ]);

  /* =========================================================
     UPDATE STATUS
  ========================================================= */

  async function updateStatus(
    id,
    status
  ) {
    try {
      setError("");

      await request(
        `/careers/admin-applications/${id}/status`,
        {
          method: "PATCH",

          body: JSON.stringify({
            status,
          }),
        }
      );

      setApplications((prev) =>
        prev.map((application) =>
          application._id === id
            ? {
                ...application,
                status,
              }
            : application
        )
      );

    } catch (err) {
      console.error(
        "STATUS UPDATE ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to update application status"
      );
    }
  }

  /* =========================================================
     DELETE APPLICATION
  ========================================================= */

  async function deleteApplication(
    id
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await request(
        `/careers/admin-applications/${id}`,
        {
          method: "DELETE",
        }
      );

      setApplications((prev) =>
        prev.filter(
          (application) =>
            application._id !== id
        )
      );

    } catch (err) {
      console.error(
        "DELETE APPLICATION ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to delete application"
      );
    }
  }

  /* =========================================================
     DATE FORMAT
  ========================================================= */

  function formatDate(date) {
    if (!date) return "—";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  /* =========================================================
     STATUS STYLE
  ========================================================= */

  function statusClass(status) {
    switch (
      status?.toLowerCase()
    ) {
      case "reviewing":
        return "bg-blue-50 text-blue-600";

      case "shortlisted":
        return "bg-green-50 text-green-600";

      case "rejected":
        return "bg-red-50 text-red-600";

      case "hired":
        return "bg-purple-50 text-purple-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">

        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-[#4F46E5]" />

      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#F8FAFF]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8">

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>

            <h1 className="text-4xl font-bold text-[#0B132B]">
              Applications
            </h1>

            <p className="mt-2 text-lg text-[#526B91]">
              Review candidates who applied to
              JobXPortal careers.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              loadApplications(true)
            }
            disabled={refreshing}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-[#0B132B] shadow-sm transition hover:border-indigo-200 hover:text-[#4F46E5] disabled:opacity-60"
          >

            <RefreshCw
              size={18}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>

        </div>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="grid gap-4 md:grid-cols-[1fr_250px]">

          {/* SEARCH */}

          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search candidate or position..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-[#0B132B] outline-none transition placeholder:text-slate-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
            />

          </div>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-[#0B132B] outline-none focus:border-[#4F46E5]"
          >

            <option value="all">
              All Statuses
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="reviewing">
              Reviewing
            </option>

            <option value="shortlisted">
              Shortlisted
            </option>

            <option value="rejected">
              Rejected
            </option>

            <option value="hired">
              Hired
            </option>

          </select>

        </div>

      </div>

      {/* =====================================================
          COUNT
      ===================================================== */}

      <div className="mb-5 flex items-center gap-2 text-sm text-[#526B91]">

        <Users size={17} />

        <span>
          {filteredApplications.length}
          {" "}
          application
          {filteredApplications.length !== 1
            ? "s"
            : ""}
        </span>

      </div>

      {/* =====================================================
          APPLICATIONS
      ===================================================== */}

      {filteredApplications.length === 0 ? (

        <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-[#4F46E5]">

              <Users size={28} />

            </div>

            <h2 className="mt-5 text-xl font-bold text-[#0B132B]">
              No applications found
            </h2>

            <p className="mt-2 text-slate-500">
              Applications will appear here when
              candidates apply for your careers.
            </p>

          </div>

        </div>

      ) : (

        <div className="space-y-5">

          {filteredApplications.map(
            (application) => {

              const career =
                application.career;

              return (
                <div
                  key={application._id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >

                  {/* =================================================
                      TOP
                  ================================================= */}

                  <div className="flex flex-col justify-between gap-5 lg:flex-row">

                    <div className="flex gap-4">

                      {/* AVATAR */}

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl font-bold text-[#4F46E5]">

                        {application.name
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "?"}

                      </div>

                      {/* CANDIDATE */}

                      <div>

                        <h2 className="text-xl font-bold text-[#0B132B]">
                          {application.name ||
                            "Unnamed Candidate"}
                        </h2>

                        <p className="mt-1 font-medium text-[#4F46E5]">
                          {career?.title ||
                            "Career Position"}
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Applied on{" "}
                          {formatDate(
                            application.createdAt
                          )}
                        </p>

                      </div>

                    </div>

                    {/* STATUS */}

                    <div className="flex items-center gap-3">

                      <select
                        value={
                          application.status ||
                          "pending"
                        }
                        onChange={(e) =>
                          updateStatus(
                            application._id,
                            e.target.value
                          )
                        }
                        className={`cursor-pointer rounded-full border-0 px-4 py-2 text-sm font-semibold outline-none ${statusClass(
                          application.status
                        )}`}
                      >

                        <option value="pending">
                          Pending
                        </option>

                        <option value="reviewing">
                          Reviewing
                        </option>

                        <option value="shortlisted">
                          Shortlisted
                        </option>

                        <option value="rejected">
                          Rejected
                        </option>

                        <option value="hired">
                          Hired
                        </option>

                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          deleteApplication(
                            application._id
                          )
                        }
                        className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-xl text-red-500 transition hover:bg-red-50"
                        title="Delete application"
                      >

                        <Trash2 size={18} />

                      </button>

                    </div>

                  </div>

                  {/* =================================================
                      CONTACT INFORMATION
                  ================================================= */}

                  <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 md:grid-cols-2">

                    {/* EMAIL */}

                    {application.email && (
                      <a
                        href={`mailto:${application.email}`}
                        className="flex items-center gap-3 rounded-xl bg-[#F8FAFF] px-4 py-3 text-sm text-[#526B91] transition hover:text-[#4F46E5]"
                      >

                        <Mail
                          size={17}
                          className="text-[#4F46E5]"
                        />

                        <span className="truncate">
                          {application.email}
                        </span>

                      </a>
                    )}

                    {/* PHONE */}

                    {application.phone && (
                      <a
                        href={`tel:${application.phone}`}
                        className="flex items-center gap-3 rounded-xl bg-[#F8FAFF] px-4 py-3 text-sm text-[#526B91] transition hover:text-[#4F46E5]"
                      >

                        <Phone
                          size={17}
                          className="text-[#4F46E5]"
                        />

                        <span>
                          {application.phone}
                        </span>

                      </a>
                    )}

                  </div>

                  {/* =================================================
                      LINKS
                  ================================================= */}

                  <div className="mt-4 flex flex-wrap gap-3">

                    {application.resume && (
                      <a
                        href={
                          application.resume
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B132B] transition hover:border-indigo-200 hover:text-[#4F46E5]"
                      >

                        <FileText size={17} />

                        Resume

                        <ExternalLink
                          size={14}
                        />

                      </a>
                    )}

                    {application.linkedin && (
                      <a
                        href={
                          application.linkedin
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B132B] transition hover:border-indigo-200 hover:text-[#4F46E5]"
                      >

                        <BriefcaseBusiness
                          size={17}
                        />

                        LinkedIn

                        <ExternalLink
                          size={14}
                        />

                      </a>
                    )}

                    {application.github && (
                      <a
                        href={
                          application.github
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B132B] transition hover:border-indigo-200 hover:text-[#4F46E5]"
                      >

                        <GitBranch
                          size={17}
                        />

                        GitHub

                        <ExternalLink
                          size={14}
                        />

                      </a>
                    )}

                  </div>

                  {/* =================================================
                      COVER LETTER
                  ================================================= */}

                  {application.coverLetter && (
                    <div className="mt-5 rounded-xl bg-[#F8FAFF] p-5">

                      <h3 className="text-sm font-bold text-[#0B132B]">
                        Cover Letter
                      </h3>

                      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#526B91]">
                        {
                          application.coverLetter
                        }
                      </p>

                    </div>
                  )}

                </div>
              );
            }
          )}

        </div>

      )}

    </div>
  );
}