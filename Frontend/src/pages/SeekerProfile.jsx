import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Eye, MapPin, Mail, Phone, Calendar, GraduationCap,
  Briefcase, FolderKanban, Gem, Languages, FileText, Video, Home,
  DollarSign, Pencil, Plus, ChevronRight, CheckCircle2, ExternalLink,
  Code2, Globe, Sparkles, Target, Trash2, Save, X, AlertTriangle,
  Bookmark, Clock3, XCircle, Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { fetchProfile, saveProfileApi, uploadResumeApi } from "../services/profileService";
import { resendVerificationApi } from "../services/authService";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";


const calculateProfileCompletion = (profile = {}) => {
  const checks = [
    Boolean(profile.name),
    Boolean(profile.phone),
    Boolean(profile.about),
    Boolean(profile.address),
    Boolean(profile.preferredLocations?.length),
    Boolean(profile.experience?.length),
    Boolean(profile.educationDetails?.length),
    Boolean(profile.projects?.length),
    Boolean(profile.skills?.length),
    Boolean(profile.languages?.length),
    Boolean(profile.resume),
    Boolean(profile.videoIntroduction),
  ];

  const completed = checks.filter(Boolean).length;

  return Math.round((completed / checks.length) * 100);
};


export default function SeekerDashboard() {
  const { user } = useAuth();

  const profileSectionRef = useRef(null);

  const [stats, setStats] = useState({
    applications: 0,
    bookmarks: 0,
    profileCompletion: 0,
  });

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  async function loadDashboard() {
    try {
      setLoading(true);

      // Support the token keys used by the app/auth flow.
      const token =
        user?.token ||
        user?.accessToken ||
        localStorage.getItem("token") ||
        localStorage.getItem("jobxportal_token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("jobxportal_token") ||
        sessionStorage.getItem("authToken");

      if (!token) {
        console.warn("SeekerDashboard: authentication token not found.");
        setApplications([]);
        setStats((prev) => ({
          ...prev,
          applications: 0,
          bookmarks: 0,
        }));
        setLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Fetch independently so one failed endpoint cannot prevent the
      // remaining dashboard data from loading.
      const [
        applicationsRes,
        careerApplicationsRes,
        bookmarksRes,
        profileRes,
      ] = await Promise.allSettled([
        fetch(`${API_URL}/applications/my`, {
          method: "GET",
          headers,
        }),
        fetch(`${API_URL}/careers/my-applications`, {
          method: "GET",
          headers,
        }),
        fetch(`${API_URL}/bookmarks`, {
          method: "GET",
          headers,
        }),
        fetch(`${API_URL}/profile`, {
          method: "GET",
          headers,
        }),
      ]);

      let applicationData = [];
      let careerApplicationData = [];
      let bookmarkData = [];
      let profileData = {};

      // =====================================================
      // NORMAL JOB APPLICATIONS
      // =====================================================
      if (applicationsRes.status === "fulfilled") {
        const response = applicationsRes.value;

        if (response.ok) {
          const data = await response.json();

          applicationData = Array.isArray(data.applications)
            ? data.applications
            : Array.isArray(data.data)
              ? data.data
              : Array.isArray(data)
                ? data
                : [];

          console.log("JOB APPLICATIONS:", applicationData);
        } else {
          console.error(
            "JOB APPLICATIONS API ERROR:",
            response.status,
            await response.text()
          );
        }
      } else {
        console.error(
          "JOB APPLICATIONS REQUEST ERROR:",
          applicationsRes.reason
        );
      }

      // =====================================================
      // JOBXPORTAL CAREER APPLICATIONS
      // =====================================================
      if (careerApplicationsRes.status === "fulfilled") {
        const response = careerApplicationsRes.value;

        if (response.ok) {
          const data = await response.json();

          careerApplicationData = Array.isArray(data.applications)
            ? data.applications
            : Array.isArray(data.data)
              ? data.data
              : Array.isArray(data)
                ? data
                : [];

          console.log(
            "JOBXPORTAL CAREER APPLICATIONS:",
            careerApplicationData
          );
        } else {
          const errorText = await response.text();

          console.error(
            "CAREER APPLICATIONS API ERROR:",
            response.status,
            errorText
          );
        }
      } else {
        console.error(
          "CAREER APPLICATIONS REQUEST ERROR:",
          careerApplicationsRes.reason
        );
      }

      // =====================================================
      // NORMALIZE JOB APPLICATIONS
      // =====================================================
      const normalApplications = applicationData.map(
        (application) => ({
          ...application,
          applicationType: "job",
          createdAt:
            application.createdAt ||
            application.appliedAt ||
            application.created_at ||
            0,
          status: application.status || "pending",
        })
      );

      // =====================================================
      // NORMALIZE CAREER APPLICATIONS
      // =====================================================
      const careerApplications = careerApplicationData.map(
        (application) => ({
          ...application,
          applicationType: "career",
          jobTitle:
            application.career?.title ||
            application.title ||
            application.jobTitle ||
            "JobXPortal Career",
          company:
            application.company ||
            "JobXPortal",
          status:
            application.status ||
            "pending",
          createdAt:
            application.createdAt ||
            application.appliedAt ||
            application.created_at ||
            0,
        })
      );

      // =====================================================
      // COMBINE BOTH APPLICATION TYPES
      // =====================================================
      const allApplications = [
        ...normalApplications,
        ...careerApplications,
      ].sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );

      console.log("ALL SEEKER APPLICATIONS:", allApplications);

      // =====================================================
      // BOOKMARKS
      // =====================================================
      if (bookmarksRes.status === "fulfilled") {
        const response = bookmarksRes.value;

        if (response.ok) {
          const data = await response.json();

          bookmarkData = Array.isArray(data.bookmarks)
            ? data.bookmarks
            : Array.isArray(data.data)
              ? data.data
              : Array.isArray(data)
                ? data
                : [];
        } else {
          console.error(
            "BOOKMARKS API ERROR:",
            response.status,
            await response.text()
          );
        }
      }

      // =====================================================
      // PROFILE
      // =====================================================
      if (profileRes.status === "fulfilled") {
        const response = profileRes.value;

        if (response.ok) {
          const data = await response.json();

          profileData =
            data.profile ||
            data.data ||
            data ||
            {};
        } else {
          console.error(
            "PROFILE API ERROR:",
            response.status,
            await response.text()
          );
        }
      }

      // =====================================================
      // UPDATE DASHBOARD STATE
      // =====================================================
      const profileCompletion =
        calculateProfileCompletion(profileData);

      setApplications(allApplications);

      setStats({
        applications: allApplications.length,
        bookmarks: bookmarkData.length,
        profileCompletion,
      });
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusIcon = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value.includes("short") ||
      value.includes("selected") ||
      value.includes("approved")
    ) {
      return (
        <CheckCircle2
          size={16}
          className="text-green-600"
        />
      );
    }

    if (
      value.includes("reject") ||
      value.includes("decline")
    ) {
      return (
        <XCircle
          size={16}
          className="text-red-500"
        />
      );
    }

    return (
      <Clock3
        size={16}
        className="text-amber-500"
      />
    );
  };

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value.includes("short") ||
      value.includes("selected") ||
      value.includes("approved")
    ) {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (
      value.includes("reject") ||
      value.includes("decline")
    ) {
      return "bg-red-50 text-red-600 border-red-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#0B132B]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold text-[#4F46E5]">
                Welcome back
              </p>

              <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                {user?.name || "Job Seeker"}
              </h1>

              <p className="mt-2 text-sm text-[#64748B] sm:text-base">
                Track your applications, manage your career profile,
                and discover new opportunities.
              </p>
            </div>

            {/* ONLY job search button */}
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#4338CA]"
            >
              <Search size={17} />
              Find Jobs
            </Link>
          </div>
        </motion.div>

        {/* Stats */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardStat
            icon={Briefcase}
            title="Applications"
            value={loading ? "—" : stats.applications}
            description="Jobs you have applied for"
          />

          <DashboardStat
            icon={Bookmark}
            title="Bookmarks"
            value={loading ? "—" : stats.bookmarks}
            description="Saved opportunities"
          />

          <DashboardStat
            icon={User}
            title="Profile Completion"
            value={
              loading
                ? "—"
                : `${stats.profileCompletion}%`
            }
            description="Keep your profile updated"
          />
        </div>

        {/* Main Grid */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_350px]">
          {/* Applications */}

          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-[#E2E6F0] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#0B132B]">
                  My Applications
                </h2>

                <p className="mt-1 text-sm text-[#64748B]">
                  Track the jobs you have applied for.
                </p>
              </div>

              <Link
                to="/tracker"
                className="text-sm font-semibold text-[#4F46E5] hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="mt-5">
              {loading ? (
                <div className="py-10 text-center text-sm text-[#94A3B8]">
                  Loading applications...
                </div>
              ) : applications.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#D8DEEA] bg-[#F8FAFF] px-5 py-10 text-center">
                  <Briefcase
                    size={32}
                    className="mx-auto text-[#94A3B8]"
                  />

                  <h3 className="mt-3 font-bold text-[#334155]">
                    No applications yet
                  </h3>

                  <p className="mt-1 text-sm text-[#64748B]">
                    Start exploring jobs and apply for positions
                    that match your skills.
                  </p>

                  <Link
                    to="/jobs"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-4 py-2.5 text-sm font-bold text-white"
                  >
                    Search Jobs
                    <ChevronRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications
                    .slice(0, 5)
                    .map((application, index) => {
                      const job =
                        application.job ||
                        application.jobId ||
                        {};

                      const isCareerApplication =
                        application.applicationType ===
                        "career";

                      const title =
                        isCareerApplication
                          ? application.career?.title ||
                            application.jobTitle ||
                            "JobXPortal Career"
                          : job.title ||
                            application.jobTitle ||
                            "Job Application";

                      const company =
                        isCareerApplication
                          ? application.company ||
                            "JobXPortal"
                          : job.company ||
                            application.company ||
                            "Company";

                      const status =
                        application.status ||
                        "Pending";

                      return (
                        <motion.div
                          key={
                            application._id ||
                            application.id ||
                            index
                          }
                          whileHover={{ y: -2 }}
                          className="rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] p-4"
                        >
                          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-[#0B132B]">
                                  {title}
                                </h3>

                                {isCareerApplication && (
                                  <span className="rounded-full bg-[#EEF2FF] px-2 py-1 text-[10px] font-bold text-[#4F46E5]">
                                    JobXPortal Career
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 text-sm text-[#64748B]">
                                {company}
                              </p>
                            </div>

                            <span
                              className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                                status
                              )}`}
                            >
                              {getStatusIcon(status)}
                              {status}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              )}
            </div>
          </motion.section>

          {/* Career Tools */}

          <aside className="space-y-5">
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-[#E2E6F0] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
            >
              <h2 className="text-lg font-bold">
                Career Tools
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#64748B]">
                Improve your profile and prepare for your next
                opportunity.
              </p>

              <div className="mt-4 space-y-2">
                <ToolLink
                  icon={FileText}
                  title="Resume Builder"
                  description="Create your resume"
                  to="/resume-builder"
                />

                <ToolLink
                  icon={Target}
                  title="AI Resume Match"
                  description="Match your resume with jobs"
                  to="/resume-match"
                />

                <ToolLink
                  icon={Sparkles}
                  title="Interview Prep"
                  description="Practice interview questions"
                  to="/interview-prep"
                />

                <ToolLink
                  icon={CheckCircle2}
                  title="Job Tracker"
                  description="Track your applications"
                  to="/tracker"
                />
              </div>
            </motion.section>

            {/* Profile */}

            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-[#E2E6F0] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold">
                    Complete Your Profile
                  </h2>

                  <p className="mt-1 text-xs text-[#64748B]">
                    A complete profile helps employers understand
                    your background.
                  </p>
                </div>

                <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#E2E8F0]">
                  <span className="text-xs font-black text-[#4F46E5]">
                    {stats.profileCompletion}%
                  </span>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                <div
                  className="h-full rounded-full bg-[#4F46E5] transition-all duration-700"
                  style={{
                    width: `${stats.profileCompletion}%`,
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  profileSectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E2E6F0] bg-white py-2.5 text-sm font-semibold text-[#475569] transition hover:border-[#4F46E5]/30 hover:bg-[#F8F7FF] hover:text-[#4F46E5]"
              >
                <User size={16} />
                Manage Profile
              </button>
            </motion.section>
          </aside>
        </div>
      </main>

      {/* =====================================================
          EXISTING SEEKER PROFILE
          Your original SeekerProfile code is rendered here.
          It is embedded so Navbar/Footer are not duplicated.
      ===================================================== */}

      <div
        ref={profileSectionRef}
        className="scroll-mt-24"
      >
        <EmbeddedSeekerProfile
          embedded
          onProfileChange={(updatedProfile) => {
            const profileCompletion =
              calculateProfileCompletion(updatedProfile);

            setStats((prev) => ({
              ...prev,
              profileCompletion,
            }));
          }}
        />
      </div>

      <Footer />
    </div>
  );
}


/* ============================= */
/* STAT COMPONENT */
/* ============================= */

function DashboardStat({
  icon: Icon,
  title,
  value,
  description,
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-[#E2E6F0] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-[#64748B]">
            {title}
          </p>

          <p className="mt-2 text-3xl font-black text-[#0B132B]">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#94A3B8]">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
          <Icon size={21} />
        </div>
      </div>
    </motion.div>
  );
}


/* ============================= */
/* TOOL LINK */
/* ============================= */

function ToolLink({
  icon: Icon,
  title,
  description,
  to,
}) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] p-3 transition hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#4F46E5] shadow-sm">
          <Icon size={17} />
        </div>

        <div>
          <p className="text-sm font-semibold text-[#334155]">
            {title}
          </p>

          <p className="mt-0.5 text-xs text-[#94A3B8]">
            {description}
          </p>
        </div>
      </div>

      <ChevronRight
        size={16}
        className="text-[#94A3B8] transition group-hover:translate-x-1 group-hover:text-[#4F46E5]"
      />
    </Link>
  );
}

/* ============================================================
   EMBEDDED SEEKER PROFILE
   Existing SeekerProfile code preserved below.
============================================================ */

const EMPTY_PROFILE = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  education: "",
  nationality: "Indian",
  headline: "React Frontend Developer",
  about: "",
  photo: "",
  available: false,
  experience: [],
  educationDetails: [],
  projects: [],
  skills: [],
  languages: [],
  resume: null,
  videoIntroduction: "",
  address: "",
  preferredLocations: [],
  currentSalary: "",
  expectedSalary: "",
  linkedin: "",
  github: "",
  portfolio: "",
};

const inputClass =
  "w-full rounded-xl border border-[#E2E6F0] bg-white px-4 py-3 text-sm text-[#0B132B] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wider text-[#64748B]";

function formatValue(value) {
  return value || "Not specified";
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

function ProfileCard({ title, icon: Icon, children, action }) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.12,
      }}
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.2,
      }}
      className="overflow-hidden rounded-2xl border border-[#E2E6F0] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
    >
      <div className="flex items-center justify-between border-b border-[#E2E6F0] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{
              scale: 1.08,
              rotate: 3,
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]"
          >
            <Icon size={18} />
          </motion.div>

          <h2 className="text-base font-bold text-[#0B132B] sm:text-lg">
            {title}
          </h2>
        </div>

        {action}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </motion.section>
  );
}

function EmptySection({ icon: Icon, title, description, buttonText, onClick }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.97,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.35,
      }}
      className="flex min-h-[190px] flex-col items-center justify-center text-center"
    >
      <motion.div
        whileHover={{
          scale: 1.08,
          rotate: 4,
        }}
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#4F46E5]"
      >
        <Icon size={28} />
      </motion.div>

      <h3 className="text-base font-semibold text-[#0B132B]">{title}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[#64748B]">
        {description}
      </p>

      {buttonText && (
        <motion.button
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.97,
          }}
          type="button"
          onClick={onClick}
          className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#4338CA]"
        >
          <Plus size={16} />
          {buttonText}
        </motion.button>
      )}
    </motion.div>
  );
}

function EditModal({ open, title, children, onClose, onSave, saving }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !saving) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 25,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.94,
              y: 25,
            }}
            transition={{
              duration: 0.25,
            }}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#E2E6F0] bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E6F0] bg-white px-5 py-4">
              <h2 className="text-lg font-bold text-[#0B132B]">{title}</h2>

              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                type="button"
                onClick={onClose}
                disabled={saving}
                className="cursor-pointer rounded-lg p-2 text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#0B132B] disabled:opacity-50"
              >
                <X size={18} />
              </motion.button>
            </div>

            <div className="p-5">{children}</div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-[#E2E6F0] bg-white px-5 py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="cursor-pointer rounded-xl border border-[#D8DEEA] px-5 py-2.5 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFF] disabled:opacity-50"
              >
                Cancel
              </button>

              <motion.button
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                type="button"
                onClick={onSave}
                disabled={saving}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function EmbeddedSeekerProfile({
  embedded = false,
  onProfileChange,
}) {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    ...EMPTY_PROFILE,
    name: user?.name || "",
    email: user?.email || "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modal, setModal] = useState(null);
  const [editData, setEditData] = useState({});

  const [resending, setResending] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);

      const result = await fetchProfile();

      const data = result?.profile || result?.data || result || {};

      const loadedProfile = {
        ...EMPTY_PROFILE,
        name: user?.name || "",
        email: user?.email || "",
        ...data,

        experience: Array.isArray(data.experience) ? data.experience : [],

        educationDetails: Array.isArray(data.educationDetails)
          ? data.educationDetails
          : [],

        projects: Array.isArray(data.projects) ? data.projects : [],

        skills: Array.isArray(data.skills) ? data.skills : [],

        languages: Array.isArray(data.languages) ? data.languages : [],

        preferredLocations: Array.isArray(data.preferredLocations)
          ? data.preferredLocations
          : [],
      };

      setProfile(loadedProfile);

      if (onProfileChange) {
        onProfileChange(loadedProfile);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendVerification() {
    try {
      setResending(true);

      await resendVerificationApi();

      setResendSent(true);

      setTimeout(() => {
        setResendSent(false);
      }, 5000);
    } catch (error) {
      console.error("Failed to resend verification:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to resend verification email.",
      );
    } finally {
      setResending(false);
    }
  }

    async function handleVerifyEmail() {
    try {
      setVerifyError("");

      const cleanOtp = otp.trim();

      if (!cleanOtp) {
        setVerifyError("Please enter the OTP.");
        return;
      }

      if (!/^\d{6}$/.test(cleanOtp)) {
        setVerifyError("Please enter a valid 6-digit OTP.");
        return;
      }

      const token =
        user?.token ||
        user?.accessToken ||
        localStorage.getItem("token") ||
        localStorage.getItem("jobxportal_token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("jobxportal_token") ||
        sessionStorage.getItem("authToken");

      if (!token) {
        setVerifyError("Authentication token not found.");
        return;
      }

      setVerifying(true);

      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email || profile.email,
          otp: cleanOtp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to verify email."
        );
      }

      setOtp("");
      setVerifyError("");

      // Refresh AuthContext so isVerified becomes true
      window.location.reload();
    } catch (error) {
      console.error("Email verification failed:", error);

      setVerifyError(
        error?.message || "Invalid or expired OTP."
      );
    } finally {
      setVerifying(false);
    }
  }

  async function handleResumeFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    setResumeError("File is too large — max 5MB.");
    return;
  }

  setResumeError("");
  setUploadingResume(true);
  try {
    const { resume } = await uploadResumeApi(file);

    setProfile((prev) => {
      const updatedProfile = {
        ...prev,
        resume,
      };

      if (onProfileChange) {
        onProfileChange(updatedProfile);
      }

      return updatedProfile;
    });
  } catch (err) {
    setResumeError(err.message || "Upload failed.");
  } finally {
    setUploadingResume(false);
    e.target.value = "";
  }
}

  function openModal(type, data = {}) {
    setEditData({
      ...data,
    });

    setModal(type);
  }

  function closeModal() {
    if (saving) return;

    setModal(null);
    setEditData({});
  }

  async function saveChanges() {
    try {
      setSaving(true);

      let updatedProfile = {
        ...profile,
      };

      if (modal === "basic") {
        updatedProfile = {
          ...profile,
          ...editData,
        };
      }

      if (modal === "about") {
        updatedProfile = {
          ...profile,
          about: editData.about || "",
        };
      }

      if (modal === "address") {
        updatedProfile = {
          ...profile,
          address: editData.address || "",
        };
      }

      if (modal === "locations") {
        updatedProfile = {
          ...profile,
          preferredLocations: editData.preferredLocations || [],
        };
      }

      if (modal === "salary") {
        updatedProfile = {
          ...profile,
          currentSalary: editData.currentSalary || "",
          expectedSalary: editData.expectedSalary || "",
        };
      }

      if (modal === "experience") {
        updatedProfile = {
          ...profile,
          experience: [
            ...(profile.experience || []),
            {
              ...editData,
            },
          ],
        };
      }

      if (modal === "education") {
        updatedProfile = {
          ...profile,
          educationDetails: [
            ...(profile.educationDetails || []),
            {
              ...editData,
            },
          ],
        };
      }

      if (modal === "project") {
        updatedProfile = {
          ...profile,
          projects: [
            ...(profile.projects || []),
            {
              ...editData,
            },
          ],
        };
      }

      if (modal === "skills") {
        updatedProfile = {
          ...profile,
          skills: editData.skills || [],
        };
      }

      if (modal === "languages") {
        updatedProfile = {
          ...profile,
          languages: editData.languages || [],
        };
      }

      if (modal === "video") {
        updatedProfile = {
          ...profile,
          videoIntroduction: editData.videoIntroduction || "",
        };
      }

      const result = await saveProfileApi(updatedProfile);

      console.log("Profile save response:", result);

      setProfile(updatedProfile);

      if (onProfileChange) {
        onProfileChange(updatedProfile);
      }

      setModal(null);
      setEditData({});

      alert("Profile saved successfully.");
    } catch (error) {
      console.error("PROFILE SAVE ERROR:", error);

      alert(error.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleAvailability() {
    const previousProfile = profile;

    const updatedProfile = {
      ...profile,
      available: !profile.available,
    };

    setProfile(updatedProfile);

    if (onProfileChange) {
      onProfileChange(updatedProfile);
    }

    try {
      await saveProfileApi(updatedProfile);
    } catch (error) {
      console.error("Failed to update availability:", error);

      setProfile(previousProfile);

      alert(error?.response?.data?.message || "Failed to update availability.");
    }
  }

  async function deleteItem(type, index) {
    const updatedProfile = {
      ...profile,
    };

    if (type === "experience") {
      updatedProfile.experience = profile.experience.filter(
        (_, i) => i !== index,
      );
    }

    if (type === "education") {
      updatedProfile.educationDetails = profile.educationDetails.filter(
        (_, i) => i !== index,
      );
    }

    if (type === "projects") {
      updatedProfile.projects = profile.projects.filter((_, i) => i !== index);
    }

    try {
      await saveProfileApi(updatedProfile);

      setProfile(updatedProfile);

      if (onProfileChange) {
        onProfileChange(updatedProfile);
      }
    } catch (error) {
      console.error("Failed to delete profile item:", error);

      alert(error?.response?.data?.message || "Failed to delete item.");
    }
  }

  const completion = useMemo(() => {
    const checks = [
      Boolean(profile.name),
      Boolean(profile.phone),
      Boolean(profile.about),
      Boolean(profile.address),
      Boolean(profile.preferredLocations?.length),
      Boolean(profile.experience?.length),
      Boolean(profile.educationDetails?.length),
      Boolean(profile.projects?.length),
      Boolean(profile.skills?.length),
      Boolean(profile.languages?.length),
      Boolean(profile.resume),
      Boolean(profile.videoIntroduction),
    ];

    const completed = checks.filter(Boolean).length;

    return Math.round((completed / checks.length) * 100);
  }, [profile]);

  const firstName =
    profile.name?.split(" ")[0] || user?.name?.split(" ")[0] || "User";

  if (loading) {
    return (
      <>
        {!embedded && <Navbar />}

        <main className="min-h-screen bg-[#F8FAFF] px-4 py-10">
          <div className="mx-auto max-w-7xl animate-pulse">
            <div className="h-10 w-64 rounded bg-[#E2E8F0]" />

            <div className="mt-3 h-5 w-96 max-w-full rounded bg-[#E2E8F0]" />

            <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
              <div className="h-[500px] rounded-2xl bg-[#E2E8F0]" />

              <div className="space-y-6">
                <div className="h-48 rounded-2xl bg-[#E2E8F0]" />

                <div className="h-64 rounded-2xl bg-[#E2E8F0]" />
              </div>
            </div>
          </div>
        </main>

        {!embedded && <Footer />}
      </>
    );
  }

  return (
    <>
      {!embedded && <Navbar />}

      <main className="min-h-screen bg-[#F8FAFF] px-4 py-6 text-[#0B132B] sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          {/* Verification */}

<AnimatePresence>
  {user && !user.isVerified && (
    <motion.div
      initial={{
        opacity: 0,
        y: -15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -15,
      }}
      className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle
            size={18}
            className="shrink-0 text-amber-600"
          />

          <div>
            <p className="text-sm font-semibold text-amber-800">
              Your email isn't verified yet.
            </p>

            <p className="mt-1 text-xs text-amber-700">
              Enter the 6-digit OTP sent to{" "}
              <span className="font-semibold">
                {user?.email || profile.email}
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResendVerification}
          disabled={resending}
          className="cursor-pointer rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-600 disabled:opacity-50"
        >
          {resending
            ? "Sending..."
            : resendSent
              ? "OTP Sent!"
              : "Resend OTP"}
        </button>
      </div>

      {/* OTP Verification */}
      <div className="mt-4 rounded-xl border border-amber-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Email Verification OTP
            </label>

            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6);

                setOtp(value);
                setVerifyError("");
              }}
              placeholder="Enter 6-digit OTP"
              className="w-full rounded-xl border border-[#E2E6F0] bg-white px-4 py-3 text-sm font-semibold tracking-[0.3em] text-[#0B132B] outline-none transition placeholder:tracking-normal placeholder:font-normal placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10"
            />

            {verifyError && (
              <p className="mt-2 text-xs font-medium text-red-500">
                {verifyError}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleVerifyEmail}
            disabled={verifying || otp.length !== 6}
            className="mt-0 cursor-pointer rounded-xl bg-[#4F46E5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-50 sm:mt-6"
          >
            {verifying ? "Verifying..." : "Verify Email"}
          </button>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

          {/* Header */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end"
          >
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#4F46E5]/20 bg-[#4F46E5]/5 px-3 py-1 text-xs font-semibold text-[#4F46E5]">
                <Sparkles size={13} />
                Career Profile
              </div>

              <h1 className="text-3xl font-black tracking-tight text-[#0B132B] sm:text-4xl">
                My Profile
              </h1>

              <p className="mt-2 text-sm text-[#64748B] sm:text-base">
                Build your professional identity and get discovered by
                employers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Public Profile */}

              <motion.button
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                type="button"
                onClick={() => {
                  const uid = user?.id || user?._id;

                  if (!uid) {
                    alert("Unable to open public profile.");
                    return;
                  }

                  window.open(`/u/${uid}`, "_blank");
                }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#E2E6F0] bg-white px-4 py-3 text-sm font-semibold text-[#334155] shadow-sm transition hover:border-[#4F46E5]/30 hover:text-[#4F46E5]"
              >
                <Eye size={17} />
                View Public Profile
                <ExternalLink size={14} />
              </motion.button>

              {/* Availability */}

              <motion.button
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                type="button"
                onClick={toggleAvailability}
                className={`inline-flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  profile.available
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-[#E2E6F0] bg-white text-[#475569]"
                }`}
              >
                <span
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    profile.available ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                      profile.available ? "left-6" : "left-1"
                    }`}
                  />
                </span>

                {profile.available ? "Available Now" : "Not Available"}
              </motion.button>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            {/* Sidebar */}

            <motion.aside
              variants={fadeLeft}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Profile Card */}

              <motion.div
                whileHover={{
                  y: -3,
                }}
                className="overflow-hidden rounded-2xl border border-[#E2E6F0] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
              >
                <div className="h-24 bg-gradient-to-r from-[#4F46E5]/15 via-[#7138E8]/10 to-transparent" />

                <div className="-mt-12 px-5 pb-6">
                  <div className="flex justify-center">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#EEF2FF] text-3xl font-black text-[#4F46E5] shadow-xl">
                      {profile.photo ? (
                        <img
                          src={profile.photo}
                          alt={profile.name || "Profile"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        firstName.charAt(0).toUpperCase()
                      )}
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold text-[#0B132B]">
                      {formatValue(profile.name)}
                    </h2>

                    <p className="mt-1 text-sm text-[#64748B]">
                      {formatValue(profile.headline)}
                    </p>

                    {profile.address && (
                      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#64748B]">
                        <MapPin size={13} />
                        {profile.address}
                      </div>
                    )}
                  </div>

                  {/* Completion */}

                  <div className="mt-6 rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#0B132B]">
                          Profile Strength
                        </p>

                        <p className="mt-1 text-xs text-[#64748B]">
                          Complete your profile
                        </p>
                      </div>

                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-[#E2E8F0]">
                        <div
                          className="absolute inset-[-5px] rounded-full"
                          style={{
                            background: `conic-gradient(#4F46E5 ${completion}%, #E2E8F0 ${completion}% 100%)`,
                            mask: "radial-gradient(farthest-side, transparent calc(100% - 5px), #000 0)",
                            WebkitMask:
                              "radial-gradient(farthest-side, transparent calc(100% - 5px), #000 0)",
                          }}
                        />

                        <span className="relative text-xs font-bold text-[#0B132B]">
                          {completion}%
                        </span>
                      </div>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${completion}%`,
                        }}
                        transition={{
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full bg-[#4F46E5]"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    type="button"
                    onClick={() => openModal("basic", profile)}
                    className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E2E6F0] bg-white py-3 text-sm font-semibold text-[#475569] transition hover:border-[#4F46E5]/30 hover:text-[#4F46E5]"
                  >
                    <Pencil size={15} />
                    Edit Profile
                  </motion.button>
                </div>
              </motion.div>

              {/* Career Tools */}

              <motion.div
                whileHover={{
                  y: -3,
                }}
                className="rounded-2xl border border-[#E2E6F0] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
              >
                <h3 className="text-base font-bold text-[#0B132B]">
                  Career Tools
                </h3>

                <p className="mt-1 text-xs leading-5 text-[#64748B]">
                  Improve your profile and increase your chances of getting
                  hired.
                </p>

                <div className="mt-4 space-y-2">
                  {[
                    ["Resume Builder", FileText, "/resume-builder"],
                    ["AI Resume Match", Target, "/resume-match"],
                    ["Interview Prep", Sparkles, "/interview-prep"],
                    ["Job Tracker", CheckCircle2, "/tracker"],
                  ].map(([name, Icon, path]) => (
                    <motion.a
                      key={path}
                      href={path}
                      whileHover={{
                        x: 3,
                      }}
                      className="group flex items-center justify-between rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] px-3 py-3 transition hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF]"
                    >
                      <span className="flex items-center gap-3 text-sm font-medium text-[#475569]">
                        <Icon size={17} className="text-[#4F46E5]" />
                        {name}
                      </span>

                      <ChevronRight
                        size={16}
                        className="text-[#94A3B8] transition group-hover:translate-x-1 group-hover:text-[#4F46E5]"
                      />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.aside>

            {/* Main */}

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Basic Information */}

              <ProfileCard
                title="Basic Information"
                icon={User}
                action={
                  <button
                    type="button"
                    onClick={() => openModal("basic", profile)}
                    className="cursor-pointer text-sm font-semibold text-[#4F46E5] hover:underline"
                  >
                    Edit
                  </button>
                }
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  {[
                    [Mail, "Email ID", formatValue(profile.email)],
                    [Phone, "Mobile Number", formatValue(profile.phone)],
                    [Calendar, "Date of Birth", formatValue(profile.dob)],
                    [User, "Gender", formatValue(profile.gender)],
                    [
                      GraduationCap,
                      "Education",
                      formatValue(profile.education),
                    ],
                    [Globe, "Nationality", formatValue(profile.nationality)],
                  ].map(([Icon, label, value]) => (
                    <motion.div
                      key={label}
                      variants={fadeUp}
                      className="flex items-start gap-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
                        <Icon size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                          {label}
                        </p>

                        <p className="mt-1 truncate text-sm font-medium text-[#334155]">
                          {value}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ProfileCard>

              {/* About */}

              <ProfileCard
                title="About Me"
                icon={FileText}
                action={
                  <button
                    type="button"
                    onClick={() =>
                      openModal("about", {
                        about: profile.about,
                      })
                    }
                    className="cursor-pointer text-sm font-semibold text-[#4F46E5] hover:underline"
                  >
                    Edit
                  </button>
                }
              >
                {profile.about ? (
                  <p className="whitespace-pre-line text-sm leading-7 text-[#475569]">
                    {profile.about}
                  </p>
                ) : (
                  <EmptySection
                    icon={Pencil}
                    title="Tell employers about yourself"
                    description="Share your background, strengths, experience and what you are looking for next."
                    buttonText="Add About Me"
                    onClick={() =>
                      openModal("about", {
                        about: "",
                      })
                    }
                  />
                )}
              </ProfileCard>

              {/* Experience */}

              <ProfileCard
                title="Work Experience"
                icon={Briefcase}
                action={
                  <button
                    type="button"
                    onClick={() => openModal("experience")}
                    className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-[#4F46E5] hover:bg-[#EEF2FF]"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                }
              >
                {profile.experience?.length ? (
                  <div className="space-y-6">
                    {profile.experience.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={fadeUp}
                        className="relative border-l border-[#D8DEEA] pl-5"
                      >
                        <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-[#4F46E5]" />

                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-[#0B132B]">
                              {item.title || item.role || "Job Role"}
                            </h3>

                            <p className="mt-1 text-sm text-[#4F46E5]">
                              {item.company || "Company"}
                            </p>

                            <p className="mt-2 text-xs text-[#94A3B8]">
                              {item.startDate || ""}
                              {item.endDate ? ` — ${item.endDate}` : ""}
                            </p>

                            {item.description && (
                              <p className="mt-3 text-sm leading-6 text-[#64748B]">
                                {item.description}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteItem("experience", index)}
                            className="cursor-pointer rounded-lg p-2 text-[#94A3B8] hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptySection
                    icon={Briefcase}
                    title="No experience added yet"
                    description="Share your previous roles to help employers understand your professional background."
                    buttonText="Add Experience"
                    onClick={() => openModal("experience")}
                  />
                )}
              </ProfileCard>

              {/* Education */}

              <ProfileCard
                title="Education"
                icon={GraduationCap}
                action={
                  <button
                    type="button"
                    onClick={() => openModal("education")}
                    className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-[#4F46E5] hover:bg-[#EEF2FF]"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                }
              >
                {profile.educationDetails?.length ? (
                  <div className="space-y-4">
                    {profile.educationDetails.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={fadeUp}
                        className="flex items-start justify-between gap-4 rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] p-4"
                      >
                        <div className="flex gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <GraduationCap size={20} />
                          </div>

                          <div>
                            <h3 className="font-bold text-[#0B132B]">
                              {item.degree || item.course || "Degree"}
                            </h3>

                            <p className="mt-1 text-sm text-[#64748B]">
                              {item.institution ||
                                item.college ||
                                "Institution"}
                            </p>

                            {item.year && (
                              <p className="mt-2 text-xs text-[#94A3B8]">
                                {item.year}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteItem("education", index)}
                          className="cursor-pointer rounded-lg p-2 text-[#94A3B8] hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptySection
                    icon={GraduationCap}
                    title="No education details yet"
                    description="Add your academic background to showcase your qualifications."
                    buttonText="Add Education"
                    onClick={() => openModal("education")}
                  />
                )}
              </ProfileCard>
              {/* Projects */}

              <ProfileCard
                title="Projects"
                icon={FolderKanban}
                action={
                  <button
                    type="button"
                    onClick={() => openModal("project")}
                    className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-[#4F46E5] hover:bg-[#EEF2FF]"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                }
              >
                {profile.projects?.length ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {profile.projects.map((project, index) => (
                      <motion.div
                        key={index}
                        variants={fadeUp}
                        whileHover={{
                          y: -3,
                        }}
                        className="rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-[#0B132B]">
                              {project.title || project.name || "Project"}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#64748B]">
                              {project.description || "Project description"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteItem("projects", index)}
                            className="cursor-pointer text-[#94A3B8] hover:text-red-500"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {project.technologies && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {(Array.isArray(project.technologies)
                              ? project.technologies
                              : project.technologies.split(",")
                            ).map((tech) => (
                              <span
                                key={tech}
                                className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-medium text-[#4F46E5]"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptySection
                    icon={FolderKanban}
                    title="Showcase your best projects"
                    description="Add projects to highlight your work, technical skills and achievements."
                    buttonText="Add Project"
                    onClick={() => openModal("project")}
                  />
                )}
              </ProfileCard>

              {/* Skills */}

              <ProfileCard
                title="Skills"
                icon={Gem}
                action={
                  <button
                    type="button"
                    onClick={() =>
                      openModal("skills", {
                        skills: profile.skills || [],
                      })
                    }
                    className="cursor-pointer text-sm font-semibold text-[#4F46E5] hover:underline"
                  >
                    Edit
                  </button>
                }
              >
                {profile.skills?.length ? (
                  <div className="flex flex-wrap gap-2.5">
                    {profile.skills.map((skill) => (
                      <motion.span
                        key={skill}
                        whileHover={{
                          scale: 1.04,
                          y: -2,
                        }}
                        className="rounded-full border border-[#4F46E5]/20 bg-[#EEF2FF] px-4 py-2 text-sm font-medium text-[#4F46E5]"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                ) : (
                  <EmptySection
                    icon={Gem}
                    title="Add your skills to stand out"
                    description="Highlight your expertise to get matched with relevant opportunities."
                    buttonText="Add Skills"
                    onClick={() =>
                      openModal("skills", {
                        skills: [],
                      })
                    }
                  />
                )}
              </ProfileCard>

              {/* Languages */}

              <ProfileCard
                title="Languages"
                icon={Languages}
                action={
                  <button
                    type="button"
                    onClick={() =>
                      openModal("languages", {
                        languages: profile.languages || [],
                      })
                    }
                    className="cursor-pointer text-sm font-semibold text-[#4F46E5] hover:underline"
                  >
                    Edit
                  </button>
                }
              >
                {profile.languages?.length ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {profile.languages.map((language, index) => {
                      const item =
                        typeof language === "string"
                          ? {
                              name: language,
                              level: "",
                            }
                          : language;

                      return (
                        <motion.div
                          key={index}
                          variants={fadeUp}
                          whileHover={{
                            y: -2,
                          }}
                          className="flex items-center justify-between rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] px-4 py-3"
                        >
                          <span className="text-sm font-semibold text-[#334155]">
                            {item.name}
                          </span>

                          {item.level && (
                            <span className="text-xs text-[#94A3B8]">
                              {item.level}
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptySection
                    icon={Languages}
                    title="Add languages"
                    description="Show employers which languages you can communicate in."
                    buttonText="Add Language"
                    onClick={() =>
                      openModal("languages", {
                        languages: [],
                      })
                    }
                  />
                )}
              </ProfileCard>

              {/* Resume */}

              <ProfileCard title="Resume" icon={FileText}>
                {profile.resume ? (
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                        <FileText size={22} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0B132B]">
                          {profile.resume.name || "My Resume"}
                        </h3>
                        <p className="mt-1 text-xs text-[#94A3B8]">
                          Resume uploaded
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {profile.resume.url && (
                        <a
                          href={profile.resume.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer rounded-lg border border-[#D8DEEA] px-4 py-2 text-xs font-semibold text-[#475569] hover:border-[#4F46E5]/40 hover:text-[#4F46E5]"
                        >
                          View
                        </a>
                      )}
                      <label className="cursor-pointer rounded-lg border border-[#D8DEEA] px-4 py-2 text-xs font-semibold text-[#475569] hover:border-[#4F46E5]/40 hover:text-[#4F46E5]">
                        Replace
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleResumeFile}
                        />
                      </label>
                    </div>
                  </motion.div>
                ) : (
                  <div className="rounded-xl border border-dashed border-[#D8DEEA] bg-[#F8FAFF] p-8 text-center">
                    <FileText size={30} className="mx-auto text-[#94A3B8]" />
                    <h3 className="mt-3 font-semibold text-[#0B132B]">
                      Upload your resume
                    </h3>
                    <p className="mt-1 text-xs text-[#64748B]">
                      PDF, DOC or DOCX files up to 5MB.
                    </p>

                    {uploadingResume ? (
                      <p className="mt-4 text-sm font-semibold text-[#4F46E5]">
                        Uploading...
                      </p>
                    ) : (
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                        <label className="cursor-pointer rounded-xl bg-[#4F46E5] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#4338CA]">
                          Upload from Device
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleResumeFile}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            (window.location.href = "/resume-builder")
                          }
                          className="cursor-pointer rounded-xl border border-[#D8DEEA] px-5 py-2.5 text-sm font-bold text-[#475569] transition hover:border-[#4F46E5]/40 hover:text-[#4F46E5]"
                        >
                          Use Resume Builder Instead
                        </button>
                      </div>
                    )}
                    {resumeError && (
                      <p className="mt-3 text-xs font-semibold text-red-500">
                        {resumeError}
                      </p>
                    )}
                  </div>
                )}
              </ProfileCard>

              {/* Ready-Made ATS Resume */}

              <motion.a
                href="https://topmate.io/anilbhukya05/2241969"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                className="group flex items-center justify-between rounded-2xl border border-[#4F46E5]/30 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:border-[#4F46E5] hover:bg-[#F8F7FF] sm:p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4F46E5] text-white shadow-sm">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#0B132B]">
                      Use our Ready-Made ATS Resume
                    </h3>

                    <p className="mt-1 text-sm text-[#64748B]">
                      Editable, ATS-friendly resume template by Anil Bhukya
                      — customize your details and get started.
                    </p>
                  </div>
                </div>

                <ExternalLink
                  size={18}
                  className="ml-4 shrink-0 text-[#64748B] transition group-hover:translate-x-1 group-hover:text-[#4F46E5]"
                />
              </motion.a>

              {/* Video */}

              <ProfileCard title="Video Introduction" icon={Video}>
                {profile.videoIntroduction ? (
                  <div className="overflow-hidden rounded-xl border border-[#E2E6F0]">
                    <video
                      src={profile.videoIntroduction}
                      controls
                      className="max-h-[400px] w-full bg-slate-950"
                    />

                    <div className="flex justify-end p-3">
                      <button
                        type="button"
                        onClick={() =>
                          openModal("video", {
                            videoIntroduction: profile.videoIntroduction,
                          })
                        }
                        className="cursor-pointer text-xs font-semibold text-[#4F46E5] hover:underline"
                      >
                        Replace Video
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#E2E6F0] bg-gradient-to-br from-[#4F46E5]/5 to-transparent p-8 text-center">
                    <motion.div
                      whileHover={{
                        scale: 1.08,
                      }}
                      className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#4F46E5]"
                    >
                      <Video size={28} />
                    </motion.div>

                    <h3 className="mt-5 text-lg font-bold text-[#0B132B]">
                      Stand out with a 30-second intro
                    </h3>

                    <p className="mx-auto mt-2 max-w-lg text-sm text-[#64748B]">
                      Record a short introduction about yourself and help
                      recruiters understand your personality.
                    </p>

                    <motion.button
                      whileHover={{
                        scale: 1.03,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      type="button"
                      onClick={() =>
                        openModal("video", {
                          videoIntroduction: "",
                        })
                      }
                      className="mt-5 cursor-pointer rounded-xl bg-[#4F46E5] px-5 py-2.5 text-sm font-bold text-white"
                    >
                      Add Video Introduction
                    </motion.button>
                  </div>
                )}
              </ProfileCard>

              {/* Address */}

              <ProfileCard
                title="Current Address"
                icon={Home}
                action={
                  <button
                    type="button"
                    onClick={() =>
                      openModal("address", {
                        address: profile.address || "",
                      })
                    }
                    className="cursor-pointer text-sm font-semibold text-[#4F46E5] hover:underline"
                  >
                    Edit
                  </button>
                }
              >
                <p className="mb-4 text-xs text-[#64748B]">
                  This address appears on your public profile.
                </p>

                <div className="rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] p-4">
                  <p className="text-sm font-semibold text-[#0B132B]">
                    Address
                  </p>

                  <p className="mt-1 text-sm text-[#64748B]">
                    {formatValue(profile.address)}
                  </p>
                </div>
              </ProfileCard>

              {/* Preferred Locations */}

              <ProfileCard
                title="Preferred Work Location"
                icon={MapPin}
                action={
                  <button
                    type="button"
                    onClick={() =>
                      openModal("locations", {
                        preferredLocations: profile.preferredLocations || [],
                      })
                    }
                    className="cursor-pointer text-sm font-semibold text-[#4F46E5] hover:underline"
                  >
                    Edit
                  </button>
                }
              >
                <p className="mb-4 text-xs text-[#64748B]">
                  Add cities where you want job matches.
                </p>

                {profile.preferredLocations?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredLocations.map((location) => (
                      <motion.span
                        key={location}
                        whileHover={{
                          y: -2,
                        }}
                        className="rounded-full border border-[#E2E6F0] bg-[#F8FAFF] px-4 py-2 text-sm text-[#475569]"
                      >
                        <MapPin
                          size={13}
                          className="mr-1 inline text-[#4F46E5]"
                        />
                        {location}
                      </motion.span>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] p-4 text-sm text-[#94A3B8]">
                    Not specified
                  </p>
                )}
              </ProfileCard>

              {/* Salary */}

              <ProfileCard
                title="Salary Expectations"
                icon={DollarSign}
                action={
                  <button
                    type="button"
                    onClick={() =>
                      openModal("salary", {
                        currentSalary: profile.currentSalary || "",
                        expectedSalary: profile.expectedSalary || "",
                      })
                    }
                    className="cursor-pointer text-sm font-semibold text-[#4F46E5] hover:underline"
                  >
                    Edit
                  </button>
                }
              >
                <p className="mb-5 text-xs text-[#64748B]">
                  Used for job matching. Not shown on your public profile.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] p-4">
                    <p className="text-xs uppercase tracking-wider text-[#94A3B8]">
                      Current Salary
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#334155]">
                      {formatValue(profile.currentSalary)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] p-4">
                    <p className="text-xs uppercase tracking-wider text-[#94A3B8]">
                      Expected Salary
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#4F46E5]">
                      {formatValue(profile.expectedSalary)}
                    </p>
                  </div>
                </div>
              </ProfileCard>

              {/* Social Links */}

              <ProfileCard
                title="Social & Professional Links"
                icon={Globe}
                action={
                  <button
                    type="button"
                    onClick={() => openModal("basic", profile)}
                    className="cursor-pointer text-sm font-semibold text-[#4F46E5] hover:underline"
                  >
                    Edit
                  </button>
                }
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    [Globe, "LinkedIn", profile.linkedin],
                    [Code2, "GitHub", profile.github],
                    [Globe, "Portfolio", profile.portfolio],
                  ].map(([Icon, name, url]) => (
                    <a
                      key={name}
                      href={url || "#"}
                      target={url ? "_blank" : undefined}
                      rel={url ? "noopener noreferrer" : undefined}
                      onClick={(e) => {
                        if (!url) {
                          e.preventDefault();
                        }
                      }}
                      className={`flex items-center gap-3 rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] p-4 transition ${
                        url
                          ? "cursor-pointer hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF]"
                          : "cursor-default opacity-50"
                      }`}
                    >
                      <Icon size={18} className="text-[#4F46E5]" />

                      <span className="text-sm font-medium text-[#475569]">
                        {name}
                      </span>
                    </a>
                  ))}
                </div>
              </ProfileCard>
            </motion.div>
          </div>
        </div>
      </main>

      {!embedded && <Footer />}

      {/* Basic Information Modal */}

      <EditModal
        open={modal === "basic"}
        title="Edit Basic Information"
        onClose={closeModal}
        onSave={saveChanges}
        saving={saving}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Full Name</label>

            <input
              className={inputClass}
              value={editData.name || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Professional Headline</label>

            <input
              className={inputClass}
              value={editData.headline || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  headline: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Phone</label>

            <input
              className={inputClass}
              value={editData.phone || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  phone: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Date of Birth</label>

            <input
              type="date"
              className={inputClass}
              value={editData.dob || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  dob: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Gender</label>

            <select
              className={inputClass}
              value={editData.gender || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  gender: e.target.value,
                })
              }
            >
              <option value="">Select</option>

              <option value="Male">Male</option>

              <option value="Female">Female</option>

              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Education</label>

            <input
              className={inputClass}
              value={editData.education || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  education: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Nationality</label>

            <input
              className={inputClass}
              value={editData.nationality || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  nationality: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Leetcode URL</label>

            <input
              className={inputClass}
              value={editData.photo || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  photo: e.target.value,
                })
              }
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>LinkedIn</label>

            <input
              className={inputClass}
              value={editData.linkedin || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  linkedin: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>GitHub</label>

            <input
              className={inputClass}
              value={editData.github || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  github: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Portfolio</label>

            <input
              className={inputClass}
              value={editData.portfolio || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  portfolio: e.target.value,
                })
              }
            />
          </div>
        </div>
      </EditModal>
      {/* About Modal */}

      <EditModal
        open={modal === "about"}
        title="About Me"
        onClose={closeModal}
        onSave={saveChanges}
        saving={saving}
      >
        <label className={labelClass}>Professional Summary</label>

        <textarea
          rows={7}
          className={inputClass}
          placeholder="Tell employers about your background, skills, strengths and career goals..."
          value={editData.about || ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              about: e.target.value,
            })
          }
        />
      </EditModal>

      {/* Experience Modal */}

      <EditModal
        open={modal === "experience"}
        title="Add Work Experience"
        onClose={closeModal}
        onSave={saveChanges}
        saving={saving}
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Job Title</label>

            <input
              className={inputClass}
              placeholder="Frontend Developer"
              value={editData.title || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Company</label>

            <input
              className={inputClass}
              placeholder="Company name"
              value={editData.company || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  company: e.target.value,
                })
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Start Date</label>

              <input
                type="month"
                className={inputClass}
                value={editData.startDate || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    startDate: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className={labelClass}>End Date</label>

              <input
                type="month"
                className={inputClass}
                value={editData.endDate || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    endDate: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>

            <textarea
              rows={5}
              className={inputClass}
              placeholder="Describe your responsibilities and achievements..."
              value={editData.description || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  description: e.target.value,
                })
              }
            />
          </div>
        </div>
      </EditModal>

      {/* Education Modal */}

      <EditModal
        open={modal === "education"}
        title="Add Education"
        onClose={closeModal}
        onSave={saveChanges}
        saving={saving}
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Degree / Course</label>

            <input
              className={inputClass}
              placeholder="B.Tech Computer Science"
              value={editData.degree || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  degree: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Institution</label>

            <input
              className={inputClass}
              placeholder="College / University"
              value={editData.institution || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  institution: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Graduation Year</label>

            <input
              className={inputClass}
              placeholder="2025"
              value={editData.year || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  year: e.target.value,
                })
              }
            />
          </div>
        </div>
      </EditModal>

      {/* Project Modal */}

      <EditModal
        open={modal === "project"}
        title="Add Project"
        onClose={closeModal}
        onSave={saveChanges}
        saving={saving}
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Project Name</label>

            <input
              className={inputClass}
              placeholder="JobXPortal"
              value={editData.title || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Technologies</label>

            <input
              className={inputClass}
              placeholder="React, Node.js, MongoDB"
              value={editData.technologies || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  technologies: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>

            <textarea
              rows={5}
              className={inputClass}
              placeholder="Describe your project..."
              value={editData.description || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  description: e.target.value,
                })
              }
            />
          </div>
        </div>
      </EditModal>

      {/* Skills Modal */}

      <EditModal
        open={modal === "skills"}
        title="Edit Skills"
        onClose={closeModal}
        onSave={saveChanges}
        saving={saving}
      >
        <label className={labelClass}>Skills</label>

        <input
          className={inputClass}
          placeholder="React.js, JavaScript, Python, Java, SQL"
          value={(editData.skills || []).join(", ")}
          onChange={(e) =>
            setEditData({
              ...editData,
              skills: e.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
        />

        <p className="mt-2 text-xs text-[#64748B]">
          Separate skills with commas.
        </p>
      </EditModal>

      {/* Languages Modal */}

      <EditModal
        open={modal === "languages"}
        title="Edit Languages"
        onClose={closeModal}
        onSave={saveChanges}
        saving={saving}
      >
        <label className={labelClass}>Languages</label>

        <input
          className={inputClass}
          placeholder="English, Hindi, Telugu"
          value={(editData.languages || [])
            .map((item) => (typeof item === "string" ? item : item.name))
            .join(", ")}
          onChange={(e) =>
            setEditData({
              ...editData,
              languages: e.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
        />

        <p className="mt-2 text-xs text-[#64748B]">
          Separate languages with commas.
        </p>
      </EditModal>

      {/* Address Modal */}

      <EditModal
        open={modal === "address"}
        title="Current Address"
        onClose={closeModal}
        onSave={saveChanges}
        saving={saving}
      >
        <label className={labelClass}>Current Location</label>

        <input
          className={inputClass}
          placeholder="Hyderabad, Telangana, India"
          value={editData.address || ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              address: e.target.value,
            })
          }
        />
      </EditModal>

      {/* Locations Modal */}

      <EditModal
        open={modal === "locations"}
        title="Preferred Work Location"
        onClose={closeModal}
        onSave={saveChanges}
        saving={saving}
      >
        <label className={labelClass}>Preferred Cities</label>

        <input
          className={inputClass}
          placeholder="Hyderabad, Bangalore, Pune"
          value={(editData.preferredLocations || []).join(", ")}
          onChange={(e) =>
            setEditData({
              ...editData,
              preferredLocations: e.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .slice(0, 5),
            })
          }
        />

        <p className="mt-2 text-xs text-[#64748B]">
          Add up to 5 cities separated by commas.
        </p>
      </EditModal>

      {/* Salary Modal */}

      <EditModal
        open={modal === "salary"}
        title="Salary Expectations"
        onClose={closeModal}
        onSave={saveChanges}
        saving={saving}
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Current Salary</label>

            <input
              className={inputClass}
              placeholder="₹40,000 per month"
              value={editData.currentSalary || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  currentSalary: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Expected Salary</label>

            <input
              className={inputClass}
              placeholder="₹60,000 per month"
              value={editData.expectedSalary || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  expectedSalary: e.target.value,
                })
              }
            />
          </div>
        </div>
      </EditModal>

      {/* Video Modal */}

      <EditModal
        open={modal === "video"}
        title="Video Introduction"
        onClose={closeModal}
        onSave={saveChanges}
        saving={saving}
      >
        <label className={labelClass}>Video URL</label>

        <input
          className={inputClass}
          placeholder="https://.../your-video.mp4"
          value={editData.videoIntroduction || ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              videoIntroduction: e.target.value,
            })
          }
        />

        <p className="mt-2 text-xs text-[#64748B]">
          Paste a direct video link from cloud storage or a hosted MP4.
        </p>
      </EditModal>
    </>
  );
}
