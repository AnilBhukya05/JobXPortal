import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  Clock3,
  CheckCircle2,
  IndianRupee,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { request } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CareerDetails() {
  const { slug } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [career, setCareer] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCareer() {
      try {
        setLoading(true);
        setError("");

        const result = await request(
          `/careers/${slug}`
        );

        setCareer(result.career);
      } catch (err) {
        setError(
          err.message || "Career not found"
        );
      } finally {
        setLoading(false);
      }
    }

    loadCareer();
  }, [slug]);

  // Loading
  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center bg-[#F8FAFF]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-[#4F46E5]" />
        </div>

        <Footer />
      </>
    );
  }

  // Error
  if (error || !career) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center bg-[#F8FAFF] px-6">
          <div className="text-center">

            <h1 className="text-3xl font-bold text-[#0B132B]">
              Career Not Found
            </h1>

            <p className="mt-3 text-slate-500">
              This position may no longer be available.
            </p>

            <Link
              to="/careers"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-3 font-semibold text-white transition hover:bg-[#4338CA]"
            >
              <ArrowLeft size={17} />
              Back to Careers
            </Link>

          </div>
        </div>

        <Footer />
      </>
    );
  }

  // Convert text/arrays into lists
  const normalizeList = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value
        .map((item) =>
          String(item).trim()
        )
        .filter(Boolean);
    }

    return String(value)
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const responsibilities =
    normalizeList(
      career.responsibilities
    );

  const requirements =
    normalizeList(
      career.requirements
    );

  const benefits =
    normalizeList(
      career.benefits
    );

  const skills =
    normalizeList(
      career.skills
    );

  // Support old and new field
  const employmentType =
    career.employmentType ||
    career.type ||
    "";

  // Apply button
  function handleApply() {
    const applicationPath =
      `/careers/${career.slug}/apply`;

    // Login first
    if (!user) {
      navigate("/login", {
        state: {
          from: applicationPath,
        },
      });

      return;
    }

    // Already logged in
    navigate(applicationPath);
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-[#0B132B]">

        {/* Hero */}
        <section className="bg-gradient-to-br from-[#EEF2FF] via-white to-[#F5F3FF] px-6 py-16 md:py-20">

          <div className="mx-auto max-w-5xl">

            <Link
              to="/careers"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-[#4F46E5]"
            >
              <ArrowLeft size={17} />
              Back to Careers
            </Link>

            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#4F46E5] shadow-sm">
              <BriefcaseBusiness
                size={26}
              />
            </div>

            {/* Title */}
            <h1 className="mt-7 text-4xl font-bold text-[#0B132B] md:text-5xl">
              {career.title}
            </h1>

            {/* Badges */}
            <div className="mt-6 flex flex-wrap gap-3">

              {employmentType && (
                <InfoBadge>
                  <BriefcaseBusiness size={15} />
                  {employmentType}
                </InfoBadge>
              )}

              {career.location && (
                <InfoBadge>
                  <MapPin size={15} />
                  {career.location}
                </InfoBadge>
              )}

              {career.experience && (
                <InfoBadge>
                  <Clock3 size={15} />
                  {career.experience}
                </InfoBadge>
              )}

              {career.salary && (
                <InfoBadge>
                  <IndianRupee size={15} />
                  {career.salary}
                </InfoBadge>
              )}

            </div>

          </div>

        </section>

        {/* Main Content */}
        <section className="px-6 py-14">

          <div className="mx-auto max-w-5xl">

            <div className="grid gap-12 lg:grid-cols-[1fr_320px]">

              {/* Left */}
              <div>

                {/* About */}
                {career.description && (
                  <section>

                    <h2 className="text-2xl font-bold text-[#0B132B]">
                      About the Role
                    </h2>

                    <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">
                      {career.description}
                    </p>

                  </section>
                )}

                {/* Responsibilities */}
                {responsibilities.length > 0 && (
                  <section className="mt-12">

                    <h2 className="text-2xl font-bold text-[#0B132B]">
                      Responsibilities
                    </h2>

                    <div className="mt-5 space-y-4">

                      {responsibilities.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3"
                          >

                            <CheckCircle2
                              size={20}
                              className="mt-1 shrink-0 text-[#4F46E5]"
                            />

                            <p className="leading-7 text-slate-600">
                              {item}
                            </p>

                          </div>
                        )
                      )}

                    </div>

                  </section>
                )}

                {/* Requirements */}
                {requirements.length > 0 && (
                  <section className="mt-12">

                    <h2 className="text-2xl font-bold text-[#0B132B]">
                      Requirements
                    </h2>

                    <div className="mt-5 space-y-4">

                      {requirements.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3"
                          >

                            <CheckCircle2
                              size={20}
                              className="mt-1 shrink-0 text-[#4F46E5]"
                            />

                            <p className="leading-7 text-slate-600">
                              {item}
                            </p>

                          </div>
                        )
                      )}

                    </div>

                  </section>
                )}

                {/* Benefits */}
                {benefits.length > 0 && (
                  <section className="mt-12">

                    <h2 className="text-2xl font-bold text-[#0B132B]">
                      Benefits
                    </h2>

                    <p className="mt-2 text-lg text-[#526B91]">
                      What you will gain from this opportunity.
                    </p>

                    <div className="mt-6 space-y-4">

                      {benefits.map(
                        (benefit, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3"
                          >

                            <CheckCircle2
                              size={20}
                              className="mt-1 shrink-0 text-[#4F46E5]"
                            />

                            <p className="leading-7 text-slate-600">
                              {benefit}
                            </p>

                          </div>
                        )
                      )}

                    </div>

                  </section>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                  <section className="mt-12">

                    <h2 className="text-2xl font-bold text-[#0B132B]">
                      Skills
                    </h2>

                    <p className="mt-2 text-lg text-[#526B91]">
                      Skills relevant to this position.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">

                      {skills.map(
                        (skill, index) => (
                          <span
                            key={index}
                            className="rounded-xl border border-[#E0E3FF] bg-[#EEF0FF] px-4 py-2 text-sm font-semibold text-[#4F46E5]"
                          >
                            {skill}
                          </span>
                        )
                      )}

                    </div>

                  </section>
                )}

              </div>

              {/* Right Apply Card */}
              <aside>

                <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <h3 className="text-xl font-bold text-[#0B132B]">
                    Interested in joining?
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Submit your application and our
                    team will review your profile.
                  </p>

                  <button
                    type="button"
                    onClick={handleApply}
                    className="cursor-pointer mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-3 font-semibold text-white transition hover:bg-[#4338CA]"
                  >
                    Apply Now
                    <ArrowRight size={17} />
                  </button>

                  {!user && (
                    <p className="mt-3 text-center text-xs text-slate-400">
                      Login is required to apply.
                    </p>
                  )}

                </div>

              </aside>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

// Info badge
function InfoBadge({
  children,
}) {
  return (
    <span className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
      {children}
    </span>
  );
}