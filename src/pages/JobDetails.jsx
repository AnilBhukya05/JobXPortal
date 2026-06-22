import { Link, useParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useJobs } from "../context/JobsContext";
import { statusFor } from "../data/jobs";

export default function JobDetails() {
  const { id } = useParams();
  const { getJobById, loading } = useJobs();
  const job = getJobById(id);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-[#0B0E14] min-h-screen flex items-center justify-center text-[#8A8F9C] font-mono text-sm">
          Loading...
        </div>
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="bg-[#0B0E14] min-h-screen text-[#F5F3EE] flex flex-col items-center justify-center px-6 text-center">
          <p className="font-mono text-[#8A8F9C] mb-3">FLIGHT NOT FOUND</p>
          <h1 className="text-3xl font-bold mb-4">
            This listing has left the board.
          </h1>
          <p className="text-[#8A8F9C] text-sm mb-6 max-w-md">
            Live results are only kept for your current search. Go back and
            search again to find it, or it may have expired.
          </p>
          <Link
            to="/jobs"
            className="px-6 py-3 rounded-xl bg-[#FFB020] text-[#0B0E14] font-semibold"
          >
            Back to jobs
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const status = statusFor(job.postedDaysAgo);
  const isTruncated = job.description && job.description.trim().slice(-3) === "...";

  return (
    <>
      <Navbar />
      <div className="bg-[#0B0E14] min-h-screen text-[#F5F3EE] px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/jobs"
            className="font-mono text-sm text-[#8A8F9C] hover:text-[#FFB020]"
          >
            Back to board
          </Link>

          <div className="bg-[#12151D] border border-[#1E2330] rounded-2xl p-8 md:p-10 mt-6">
            <div className="flex flex-wrap items-center gap-3 mb-4 font-mono text-xs">
              <span className="px-2 py-1 rounded border border-[#FFB020]/40 text-[#FFB020] bg-[#FFB020]/10">
                {status}
              </span>
              {job.source && <span className="text-[#2DD4BF]">via {job.source}</span>}
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold">
              {job.title}
            </h1>
            <h2 className="text-lg mt-2 text-[#8A8F9C]">{job.company}</h2>

            <div className="flex flex-wrap gap-4 mt-4 font-mono text-sm text-[#8A8F9C]">
              <span>{job.location}</span>
              <span>-</span>
              <span>{job.type}</span>
              <span>-</span>
              <span className="text-[#2DD4BF]">{job.salary}</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono px-2 py-1 rounded bg-[#1E2330] text-[#8A8F9C]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-8 text-[#F5F3EE] leading-relaxed whitespace-pre-line">
              {job.description}
            </p>

            {isTruncated && (
              <p className="mt-4 text-sm text-[#8A8F9C] font-mono">
                This is a preview. The full job description, including all
                requirements and qualifications, is on the original posting.
              </p>
            )}

            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-6 bg-[#2DD4BF] text-[#0B0E14] px-7 py-3 rounded-xl font-semibold hover:bg-[#5eead4] transition"
            >
              {isTruncated ? "Read Full Description & Apply" : "Apply Now"}
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}