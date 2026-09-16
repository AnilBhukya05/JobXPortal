import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Send,
  CheckCircle2,
  Upload,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useAuth } from "../context/AuthContext";
import { request } from "../services/api";

export default function CareerApplication() {
  const { slug } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [career, setCareer] = useState(null);

  const [loadingCareer, setLoadingCareer] =
    useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    resume: "",
    coverLetter: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  // Login check
  useEffect(() => {
    if (!user) {
      navigate("/login", {
        replace: true,
        state: {
          from: `/careers/${slug}/apply`,
        },
      });
    }
  }, [user, slug, navigate]);

  // Load career
  useEffect(() => {
    async function loadCareer() {
      try {
        setLoadingCareer(true);
        setError("");

        const result = await request(
          `/careers/${slug}`
        );

        setCareer(result.career);

        // Fill account details
        if (user) {
          setForm((prev) => ({
            ...prev,
            name: user.name || "",
            email: user.email || "",
          }));
        }
      } catch (err) {
        setError(
          err.message ||
            "Career not found"
        );
      } finally {
        setLoadingCareer(false);
      }
    }

    if (user) {
      loadCareer();
    }
  }, [slug, user]);

  // Input change
  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  // Submit application
  async function handleSubmit(e) {
    e.preventDefault();

    // Extra protection
    if (!user) {
      navigate("/login", {
        replace: true,
        state: {
          from: `/careers/${slug}/apply`,
        },
      });

      return;
    }

    if (!career) {
      setError("Career not found.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await request(
        "/careers/apply",
        {
          method: "POST",

          body: JSON.stringify({
            careerId: career._id,

            name: form.name.trim(),

            email: form.email.trim(),

            phone: form.phone.trim(),

            linkedin:
              form.linkedin.trim(),

            github:
              form.github.trim(),

            resume:
              form.resume.trim(),

            coverLetter:
              form.coverLetter.trim(),
          }),
        }
      );

      setSuccess(true);
    } catch (err) {
      setError(
        err.message ||
          "Failed to submit application"
      );
    } finally {
      setLoading(false);
    }
  }

  // Loading
  if (loadingCareer) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[75vh] items-center justify-center bg-[#F8FAFF]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-[#4F46E5]" />
        </main>

        <Footer />
      </>
    );
  }

  // Success
  if (success) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[75vh] items-center justify-center bg-[#F8FAFF] px-6 py-16">

          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">

              <CheckCircle2
                size={40}
              />

            </div>

            <h1 className="mt-7 text-3xl font-bold text-[#0B132B]">
              Application Submitted
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Thank you for applying to
              JobXPortal. Your application
              has been submitted successfully.
              You can track the status of your
              application from your account.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">

              <Link
                to="/careers"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 font-semibold text-[#0B132B] transition hover:bg-slate-50"
              >
                Back to Careers
              </Link>

              <Link
                to="/my-applications"
                className="inline-flex items-center justify-center rounded-xl bg-[#4F46E5] px-6 py-3 font-semibold text-white transition hover:bg-[#4338CA]"
              >
                My Applications
              </Link>

            </div>

          </div>

        </main>

        <Footer />
      </>
    );
  }

  // Application page
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F8FAFF] px-6 py-12 text-[#0B132B] md:py-16">

        <div className="mx-auto max-w-3xl">

          {/* Back */}
          <Link
            to={`/careers/${slug}`}
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#526B91] transition hover:text-[#4F46E5]"
          >
            <ArrowLeft size={17} />
            Back to Job
          </Link>

          {/* Header */}
          <div className="mb-8">

            <p className="text-sm font-bold tracking-wide text-[#4F46E5]">
              APPLYING FOR
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#0B132B] md:text-4xl">
              {career?.title}
            </h1>

            <div className="mt-3 flex flex-wrap gap-2">

              {(career?.employmentType ||
                career?.type) && (
                <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-[#526B91] shadow-sm ring-1 ring-slate-200">
                  {career?.employmentType ||
                    career?.type}
                </span>
              )}

              {career?.location && (
                <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-[#526B91] shadow-sm ring-1 ring-slate-200">
                  {career.location}
                </span>
              )}

            </div>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">

            <form
              onSubmit={handleSubmit}
              className="space-y-7"
            >

              {/* Application Details */}
              <div>

                <h2 className="text-xl font-bold text-[#0B132B]">
                  Application Details
                </h2>

                <p className="mt-1 text-sm text-[#526B91]">
                  Tell us a little about yourself.
                </p>

              </div>

              {/* Name + Email */}
              <div className="grid gap-5 md:grid-cols-2">

                <Input
                  label="Full Name *"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />

                <Input
                  label="Email *"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />

              </div>

              {/* Phone + Resume */}
              <div className="grid gap-5 md:grid-cols-2">

                <Input
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                />

                <Input
                  label="Resume URL *"
                  type="url"
                  name="resume"
                  value={form.resume}
                  onChange={handleChange}
                  required
                  placeholder="Google Drive / OneDrive / resume link"
                />

              </div>

              {/* LinkedIn */}
              <Input
                label="LinkedIn Profile"
                type="url"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
              />

              {/* GitHub */}
              <Input
                label="GitHub Profile"
                type="url"
                name="github"
                value={form.github}
                onChange={handleChange}
                placeholder="https://github.com/..."
              />

              {/* Cover Letter */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-[#0B132B]">
                  Cover Letter
                </label>

                <textarea
                  name="coverLetter"
                  value={
                    form.coverLetter
                  }
                  onChange={handleChange}
                  rows={8}
                  placeholder="Tell us why you would be a great fit for JobXPortal..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-[#0B132B] placeholder:text-slate-400 outline-none transition focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
                />

                <div className="mt-2 text-right text-xs text-slate-400">
                  {form.coverLetter.length} characters
                </div>

              </div>

              {/* Resume Info */}
              <div className="rounded-xl border border-slate-200 bg-[#F8FAFF] p-4">

                <div className="flex items-start gap-3">

                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[#4F46E5]">
                    <Upload size={17} />
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-[#0B132B]">
                      Resume link
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Please provide a publicly accessible
                      resume link. Google Drive, OneDrive,
                      or another accessible resume URL can
                      be used.
                    </p>

                  </div>

                </div>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-6 py-3.5 font-semibold text-white transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-60"
              >

                <Send size={18} />

                {loading
                  ? "Submitting..."
                  : "Submit Application"}

              </button>

              <p className="text-center text-xs text-slate-400">
                By submitting this application, you confirm
                that the information provided is accurate.
              </p>

            </form>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

// Input
function Input({
  label,
  ...props
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-[#0B132B]">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[#0B132B] placeholder:text-slate-400 outline-none transition focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
      />

    </div>
  );
}