import React, {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  Sparkles,
  Users,
  Globe,
  Clock3,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { request } from "../services/api";

export default function Careers() {
  const [careers, setCareers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadCareers() {
      try {
        const result =
          await request(
            "/careers"
          );

        setCareers(
          result.careers || []
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load careers"
        );
      } finally {
        setLoading(false);
      }
    }

    loadCareers();
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F8FAFF] text-[#0B132B]">

        {/* HERO */}

       <section className="relative overflow-hidden bg-gradient-to-br from-[#F8FAFF] via-white to-[#F5F3FF] px-6 py-24">

          <div className="mx-auto max-w-6xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-medium text-[#4F46E5] shadow-sm">
              <Sparkles size={16} />
              We're Hiring
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
              Build the Future of
              <span className="block text-[#4F46E5]">
                Job Search with JobXPortal
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              We're building a smarter career platform
              that connects talented people with meaningful
              opportunities. Join us and help shape the
              future of hiring.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <a
                href="#open-positions"
                className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-6 py-3 font-semibold text-white transition hover:bg-[#4338CA]"
              >
                View Open Positions
                <ArrowRight size={18} />
              </a>

              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700">
                <Globe size={18} />
                Remote Opportunities
              </div>

            </div>

          </div>

        </section>

        {/* WHY JOIN */}

        <section className="px-6 py-20">

          <div className="mx-auto max-w-6xl">

            <div className="mb-12 text-center">

              <p className="mb-2 font-semibold text-[#4F46E5]">
                LIFE AT JOBXPORTAL
              </p>

              <h2 className="text-3xl font-bold md:text-4xl">
                Why join us?
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                Work on a product that aims to make job
                discovery and hiring simpler for everyone.
              </p>

            </div>

            <div className="grid gap-6 md:grid-cols-3">

              <FeatureCard
                icon={Users}
                title="Meaningful Work"
                description="Build products that help people discover opportunities and move forward in their careers."
              />

              <FeatureCard
                icon={Globe}
                title="Remote First"
                description="Collaborate with talented people from wherever you work best."
              />

              <FeatureCard
                icon={BriefcaseBusiness}
                title="Grow With Us"
                description="Take ownership, learn continuously and grow alongside the product."
              />

            </div>

          </div>

        </section>

        {/* POSITIONS */}

        <section
          id="open-positions"
          className="bg-[#F8FAFF] px-6 py-20"
        >

          <div className="mx-auto max-w-6xl">

            <div className="mb-12">

              <p className="mb-2 font-semibold text-[#4F46E5]">
                CAREERS
              </p>

              <h2 className="text-3xl font-bold md:text-4xl">
                Open Positions
              </h2>

              <p className="mt-4 text-slate-600">
                Find a role where you can make an impact.
              </p>

            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-5 text-red-600">
                {error}
              </div>
            )}

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                Loading open positions...
              </div>
            ) : careers.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">

                <BriefcaseBusiness
                  size={42}
                  className="mx-auto text-slate-300"
                />

                <h3 className="mt-5 text-xl font-bold">
                  No open positions right now
                </h3>

                <p className="mt-2 text-slate-500">
                  Check back later for new opportunities.
                </p>

              </div>
            ) : (
              <div className="space-y-5">

                {careers.map(
                  (career) => (
                    <div
                      key={career._id}
                      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md md:p-7"
                    >

                      <div className="flex flex-col justify-between gap-6 md:flex-row">

                        <div>

                          <h3 className="text-xl font-bold group-hover:text-[#4F46E5]">
                            {career.title}
                          </h3>

                          <p className="mt-3 max-w-2xl text-slate-600">
                            {career.shortDescription}
                          </p>

                          <div className="mt-5 flex flex-wrap gap-3">

                            <span className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-[#4F46E5]">
                              <BriefcaseBusiness
                                size={15}
                              />
                              {career.type}
                            </span>

                            <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-600">
                              <MapPin
                                size={15}
                              />
                              {career.location}
                            </span>

                            <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-600">
                              <Clock3
                                size={15}
                              />
                              {career.experience}
                            </span>

                          </div>

                        </div>

                        <div className="flex items-center">

                          <Link
                            to={`/careers/${career.slug}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#0B132B] px-5 py-3 font-semibold text-white transition hover:bg-[#4F46E5]"
                          >
                            View Details
                            <ArrowRight
                              size={17}
                            />
                          </Link>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </section>

        {/* CTA */}

        <section className="px-6 py-20">

          <div className="mx-auto max-w-5xl rounded-3xl bg-[#0B132B] px-8 py-14 text-center text-white md:px-16">

            <h2 className="text-3xl font-bold md:text-4xl">
              Don't see the right role?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              We're always interested in meeting talented
              people who believe in what we're building.
            </p>

            <a
              href="mailto:careers@jobxportal.com"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#0B132B] hover:bg-indigo-50"
            >
              Send Your Resume
              <ArrowRight size={18} />
            </a>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
        <Icon size={24} />
      </div>

      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-600">
        {description}
      </p>

    </div>
  );
}