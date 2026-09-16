import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Power,
  Search,
  BriefcaseBusiness,
  MapPin,
  Clock3,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export default function AdminCareers() {
  const navigate = useNavigate();

  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState(null);

  // =========================================================
  // GET ADMIN TOKEN
  // =========================================================

  const getToken = () => {
    return (
      localStorage.getItem("jobxportal_token") ||
      sessionStorage.getItem("jobxportal_token")
    );
  };

  // =========================================================
  // LOAD CAREERS
  // =========================================================

  async function loadCareers() {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin session expired. Please login again."
        );
      }

      // IMPORTANT:
      // Backend route is /careers/admin/list
      const response = await fetch(
        `${API_URL}/careers/admin/list`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to load careers"
        );
      }

      setCareers(
        result.careers ||
          result.data ||
          []
      );
    } catch (err) {
      console.error(
        "LOAD CAREERS ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to load careers"
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadCareers();
  }, []);

  // =========================================================
  // SEARCH FILTER
  // =========================================================

  const filteredCareers = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return careers;
    }

    return careers.filter(
      (career) =>
        career.title
          ?.toLowerCase()
          .includes(value) ||
        career.location
          ?.toLowerCase()
          .includes(value) ||
        career.type
          ?.toLowerCase()
          .includes(value) ||
        career.employmentType
          ?.toLowerCase()
          .includes(value) ||
        career.experience
          ?.toLowerCase()
          .includes(value)
    );
  }, [careers, search]);

  // =========================================================
  // DELETE CAREER
  // =========================================================

  async function deleteCareer(career) {
    const confirmed = window.confirm(
      `Delete "${career.title}"?\n\nThis will also delete all applications for this position.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(career._id);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin session expired. Please login again."
        );
      }

      const response = await fetch(
        `${API_URL}/careers/admin/${career._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete career"
        );
      }

      setCareers((prev) =>
        prev.filter(
          (item) =>
            item._id !== career._id
        )
      );
    } catch (err) {
      console.error(
        "DELETE CAREER ERROR:",
        err
      );

      alert(
        err.message ||
          "Failed to delete career"
      );
    } finally {
      setActionId(null);
    }
  }

  // =========================================================
  // TOGGLE CAREER STATUS
  // =========================================================

  async function toggleStatus(career) {
    try {
      setActionId(career._id);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin session expired. Please login again."
        );
      }

      // IMPORTANT:
      // Backend route is /status
      // NOT /toggle-status
      const response = await fetch(
        `${API_URL}/careers/admin/${career._id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update status"
        );
      }

      setCareers((prev) =>
        prev.map((item) =>
          item._id === career._id
            ? result.career
            : item
        )
      );
    } catch (err) {
      console.error(
        "TOGGLE STATUS ERROR:",
        err
      );

      alert(
        err.message ||
          "Failed to update status"
      );
    } finally {
      setActionId(null);
    }
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h2 className="text-2xl font-bold text-[#08132F] md:text-3xl">
            Career Management
          </h2>

          <p className="mt-2 text-slate-500">
            Create and manage JobXPortal hiring positions.
          </p>
        </div>

        <Link
          to="/admin/careers/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-3 font-semibold text-white transition hover:bg-[#4338CA]"
        >
          <Plus size={18} />
          Add Career
        </Link>

      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">

        <div className="relative">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search careers..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-slate-700 outline-none transition focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
          />

        </div>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (

        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Loading careers...
        </div>

      ) : filteredCareers.length === 0 ? (

        /* ===================================================
           EMPTY
        =================================================== */

        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">

          <BriefcaseBusiness
            size={40}
            className="mx-auto text-slate-300"
          />

          <h3 className="mt-4 text-lg font-bold text-[#08132F]">
            No careers found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {search
              ? "Try a different search."
              : "Create your first JobXPortal career position."}
          </p>

          {!search && (
            <Link
              to="/admin/careers/new"
              className="mt-5 inline-flex rounded-xl bg-[#4F46E5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4338CA]"
            >
              Add Career
            </Link>
          )}

        </div>

      ) : (

        /* ===================================================
           CAREER LIST
        =================================================== */

        <div className="space-y-4">

          {filteredCareers.map(
            (career) => (

              <div
                key={career._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md md:p-6"
              >

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  {/* =================================================
                      INFO
                  ================================================= */}

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-3">

                      <h3 className="text-lg font-bold text-[#08132F] md:text-xl">
                        {career.title}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          career.status ===
                          "active"
                            ? "bg-green-50 text-green-700"
                            : career.status ===
                              "draft"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {career.status ===
                        "active"
                          ? "Active"
                          : career.status ===
                            "draft"
                          ? "Draft"
                          : "Closed"}
                      </span>

                    </div>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                      {career.shortDescription}
                    </p>

                    {/* =================================================
                        META
                    ================================================= */}

                    <div className="mt-4 flex flex-wrap gap-3">

                      <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">

                        <BriefcaseBusiness size={14} />

                        {career.employmentType ||
                          career.type}

                      </span>

                      <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">

                        <MapPin size={14} />

                        {career.location}

                      </span>

                      <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">

                        <Clock3 size={14} />

                        {career.experience}

                      </span>

                      {career.salary && (
                        <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600">
                          {career.salary}
                        </span>
                      )}

                    </div>

                  </div>

                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <div className="flex flex-wrap gap-2">

                    {/* VIEW */}

                    <a
                      href={`/careers/${career.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:text-[#4F46E5]"
                    >
                      <Eye size={16} />
                      View
                    </a>

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/careers/${career._id}/edit`
                        )
                      }
                      className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:text-[#4F46E5]"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    {/* TOGGLE */}

                    <button
                      type="button"
                      onClick={() =>
                        toggleStatus(career)
                      }
                      disabled={
                        actionId ===
                        career._id
                      }
                      className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:text-[#4F46E5] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Power size={16} />

                      {career.status ===
                      "active"
                        ? "Disable"
                        : "Activate"}
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        deleteCareer(career)
                      }
                      disabled={
                        actionId ===
                        career._id
                      }
                      className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            )
          )}

        </div>
      )}

    </div>
  );
}