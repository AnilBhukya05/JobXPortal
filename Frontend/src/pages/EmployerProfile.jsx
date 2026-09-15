import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Building2,
  Save,
  Briefcase,
  LayoutDashboard,
  UserSearch,
  Edit3,
  X,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useAuth } from "../context/AuthContext";
import {
  fetchProfile,
  saveProfileApi,
} from "../services/profileService";

import { resendVerificationApi } from "../services/authService";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  industry: "",
  companySize: "1-10",
  website: "",
  companyLocation: "",
  hiringContactEmail: "",
  aboutCompany: "",
  linkedin: "",
};

const inputClass =
  "w-full rounded-xl border border-[#E2E6F0] bg-white px-4 py-3 text-sm text-[#0B132B] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 disabled:bg-[#F8FAFF] disabled:text-[#64748B] disabled:cursor-not-allowed";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wider text-[#64748B]";

export default function EmployerProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    ...EMPTY,
    name: user?.name || "",
    email: user?.email || "",
    hiringContactEmail: user?.email || "",
  });

  const [originalProfile, setOriginalProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const [resendSent, setResendSent] =
    useState(false);

  /* =========================================================
     LOAD PROFILE
  ========================================================= */

  useEffect(() => {
    async function load() {
      try {
        const result = await fetchProfile();

        const data = result?.profile || {};

        const loadedProfile = {
          ...EMPTY,
          name: user?.name || "",
          email: user?.email || "",
          hiringContactEmail:
            user?.email || "",
          ...data,
        };

        setProfile(loadedProfile);
        setOriginalProfile(loadedProfile);
      } catch (err) {
        console.error(
          "Failed to load company profile:",
          err
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* =========================================================
     UPDATE FIELD
  ========================================================= */

  function set(field, value) {
    setProfile((p) => ({
      ...p,
      [field]: value,
    }));
  }

  /* =========================================================
     START EDITING
  ========================================================= */

  function handleEdit() {
    setOriginalProfile(profile);
    setEditing(true);
  }

  /* =========================================================
     CANCEL EDITING
  ========================================================= */

  function handleCancel() {
    if (originalProfile) {
      setProfile(originalProfile);
    }

    setEditing(false);
  }

  /* =========================================================
     SAVE
  ========================================================= */

  async function handleSave() {
    setSaving(true);

    try {
      const result =
        await saveProfileApi(profile);

      const savedProfile = {
        ...profile,
        ...(result?.profile || {}),
      };

      setProfile(savedProfile);
      setOriginalProfile(savedProfile);

      setEditing(false);

      alert("Company profile saved.");
    } catch (err) {
      alert(
        err.message ||
          "Failed to save company profile."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     RESEND VERIFICATION
  ========================================================= */

  async function handleResendVerification() {
    setResending(true);

    try {
      await resendVerificationApi();

      setResendSent(true);

      setTimeout(() => {
        setResendSent(false);
      }, 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setResending(false);
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#F8FAFF] px-4 py-10 text-center text-[#64748B]">
          Loading...
        </main>

        <Footer />
      </>
    );
  }

  /* =========================================================
     VIEW
  ========================================================= */

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F8FAFF] px-4 py-6 text-[#0B132B] sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-4xl">

          {/* =================================================
              VERIFICATION
          ================================================= */}

          {user && !user.isVerified && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">

              <div className="flex items-center gap-3">
                <AlertTriangle
                  size={18}
                  className="shrink-0 text-amber-600"
                />

                <p className="text-sm text-amber-800">
                  Your email isn't verified yet.
                  Verify it to unlock full account
                  features.
                </p>
              </div>

              <button
                onClick={
                  handleResendVerification
                }
                disabled={resending}
                className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-600 disabled:opacity-50"
              >
                {resending
                  ? "Sending..."
                  : resendSent
                  ? "Sent!"
                  : "Resend Verification Email"}
              </button>
            </div>
          )}

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#4F46E5]/20 bg-[#4F46E5]/5 px-3 py-1 text-xs font-semibold text-[#4F46E5]">
                <Building2 size={13} />
                Employer Account
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Company Profile
              </h1>

              <p className="mt-2 text-sm text-[#64748B]">
                This information appears on your
                job listings and company page.
              </p>
            </div>

            {/* =================================================
                EDIT / CANCEL
            ================================================= */}

            {!editing ? (
              <button
                onClick={handleEdit}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E6F0] bg-white px-5 py-3 text-sm font-bold text-[#0B132B] shadow-[0_4px_15px_rgba(15,23,42,0.05)] transition hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF] hover:text-[#4F46E5]"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E6F0] bg-white px-5 py-3 text-sm font-bold text-[#475569] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="space-y-4">

              {/* COMPANY CARD */}

              <div className="rounded-2xl border border-[#E2E6F0] bg-white p-5 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EEF2FF] text-2xl font-black text-[#4F46E5]">
                  {profile.companyName ? (
                    profile.companyName
                      .charAt(0)
                      .toUpperCase()
                  ) : (
                    <Building2 size={26} />
                  )}
                </div>

                <h2 className="mt-3 font-bold text-[#0B132B]">
                  {profile.companyName ||
                    "Your Company"}
                </h2>

                <p className="mt-1 text-xs text-[#64748B]">
                  {profile.industry ||
                    "Add your industry"}
                </p>
              </div>

              {/* EMPLOYER TOOLS */}

              <div className="rounded-2xl border border-[#E2E6F0] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

                <h3 className="text-sm font-bold">
                  Employer Tools
                </h3>

                <div className="mt-3 space-y-2">

                  {[
                    [
                      "Post a Job",
                      Briefcase,
                      "/post-job",
                    ],
                    [
                      "Browse Candidates",
                      UserSearch,
                      "/candidates",
                    ],
                    [
                      "Dashboard",
                      LayoutDashboard,
                      "/employer/dashboard",
                    ],
                  ].map(
                    ([name, Icon, path]) => (
                      <a
                        key={path}
                        href={path}
                        className="flex items-center gap-3 rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] px-3 py-2.5 text-sm font-medium text-[#475569] transition hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF]"
                      >
                        <Icon
                          size={16}
                          className="text-[#4F46E5]"
                        />

                        {name}
                      </a>
                    )
                  )}
                </div>
              </div>
            </aside>

            {/* =================================================
                RIGHT CONTENT
            ================================================= */}

            <div className="space-y-6">

              {/* =================================================
                  COMPANY DETAILS
              ================================================= */}

              <div className="rounded-2xl border border-[#E2E6F0] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-bold">
                    Company Details
                  </h2>

                  {!editing && (
                    <span className="rounded-full bg-[#F1F5F9] px-3 py-1 text-[11px] font-semibold text-[#64748B]">
                      View Only
                    </span>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  {/* COMPANY NAME */}

                  <div>
                    <label className={labelClass}>
                      Company Name
                    </label>

                    <input
                      className={inputClass}
                      value={
                        profile.companyName
                      }
                      onChange={(e) =>
                        set(
                          "companyName",
                          e.target.value
                        )
                      }
                      placeholder="Acme Inc."
                      disabled={!editing}
                    />
                  </div>

                  {/* INDUSTRY */}

                  <div>
                    <label className={labelClass}>
                      Industry
                    </label>

                    <input
                      className={inputClass}
                      value={
                        profile.industry
                      }
                      onChange={(e) =>
                        set(
                          "industry",
                          e.target.value
                        )
                      }
                      placeholder="Software / Fintech..."
                      disabled={!editing}
                    />
                  </div>

                  {/* COMPANY SIZE */}

                  <div>
                    <label className={labelClass}>
                      Company Size
                    </label>

                    <select
                      className={inputClass}
                      value={
                        profile.companySize
                      }
                      onChange={(e) =>
                        set(
                          "companySize",
                          e.target.value
                        )
                      }
                      disabled={!editing}
                    >
                      {[
                        "1-10",
                        "11-50",
                        "51-200",
                        "201-500",
                        "500+",
                      ].map((s) => (
                        <option
                          key={s}
                          value={s}
                        >
                          {s} employees
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* LOCATION */}

                  <div>
                    <label className={labelClass}>
                      Company Location
                    </label>

                    <input
                      className={inputClass}
                      value={
                        profile.companyLocation
                      }
                      onChange={(e) =>
                        set(
                          "companyLocation",
                          e.target.value
                        )
                      }
                      placeholder="Hyderabad, Telangana"
                      disabled={!editing}
                    />
                  </div>

                  {/* WEBSITE */}

                  <div>
                    <label className={labelClass}>
                      Website
                    </label>

                    <input
                      className={inputClass}
                      value={
                        profile.website
                      }
                      onChange={(e) =>
                        set(
                          "website",
                          e.target.value
                        )
                      }
                      placeholder="acme.com"
                      disabled={!editing}
                    />
                  </div>

                  {/* LINKEDIN */}

                  <div>
                    <label className={labelClass}>
                      LinkedIn
                    </label>

                    <input
                      className={inputClass}
                      value={
                        profile.linkedin
                      }
                      onChange={(e) =>
                        set(
                          "linkedin",
                          e.target.value
                        )
                      }
                      placeholder="linkedin.com/company/..."
                      disabled={!editing}
                    />
                  </div>
                </div>

                {/* ABOUT COMPANY */}

                <div className="mt-4">
                  <label className={labelClass}>
                    About the Company
                  </label>

                  <textarea
                    rows={5}
                    className={inputClass}
                    value={
                      profile.aboutCompany
                    }
                    onChange={(e) =>
                      set(
                        "aboutCompany",
                        e.target.value
                      )
                    }
                    placeholder="What does your company do, and what's it like to work there..."
                    disabled={!editing}
                  />
                </div>
              </div>

              {/* =================================================
                  HIRING CONTACT
              ================================================= */}

              <div className="rounded-2xl border border-[#E2E6F0] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

                <h2 className="mb-5 text-lg font-bold">
                  Hiring Contact
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">

                  {/* NAME */}

                  <div>
                    <label className={labelClass}>
                      Your Name
                    </label>

                    <input
                      className={inputClass}
                      value={
                        profile.name
                      }
                      onChange={(e) =>
                        set(
                          "name",
                          e.target.value
                        )
                      }
                      disabled={!editing}
                    />
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label className={labelClass}>
                      Hiring Contact Email
                    </label>

                    <input
                      className={inputClass}
                      value={
                        profile.hiringContactEmail
                      }
                      onChange={(e) =>
                        set(
                          "hiringContactEmail",
                          e.target.value
                        )
                      }
                      placeholder="hiring@acme.com"
                      disabled={!editing}
                    />
                  </div>

                  {/* PHONE */}

                  <div>
                    <label className={labelClass}>
                      Phone
                    </label>

                    <input
                      className={inputClass}
                      value={
                        profile.phone
                      }
                      onChange={(e) =>
                        set(
                          "phone",
                          e.target.value
                        )
                      }
                      placeholder="+91 9999999999"
                      disabled={!editing}
                    />
                  </div>
                </div>
              </div>

              {/* =================================================
                  SAVE BUTTON
              ================================================= */}

              {editing && (
                <div className="flex flex-wrap items-center gap-3">

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#4338CA] disabled:opacity-60"
                  >
                    <Save size={16} />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E2E6F0] bg-white px-6 py-3 text-sm font-bold text-[#475569] transition hover:bg-[#F8FAFF] disabled:opacity-50"
                  >
                    <X size={16} />

                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}