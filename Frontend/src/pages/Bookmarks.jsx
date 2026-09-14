import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { useBookmarkContext } from "../context/BookmarkContext";

export default function Bookmarks() {
  const navigate = useNavigate();
  const { bookmarks } = useBookmarkContext();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#F8FAFF] text-[#0B132B]">
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex cursor-pointer items-center gap-2 font-mono text-sm text-[#64748B] transition hover:text-[#4F46E5]"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* Header */}
          <p className="mb-2 font-mono text-xs tracking-widest text-[#64748B]">
            SAVED JOBS
          </p>

          <h1 className="mb-3 font-display text-3xl font-bold text-[#0B132B] md:text-5xl">
            Your Bookmarks
          </h1>

          <p className="mb-8 text-sm text-[#64748B]">
            {bookmarks.length} saved{" "}
            {bookmarks.length === 1 ? "job" : "jobs"}
          </p>

          {/* Empty State */}
          {bookmarks.length === 0 ? (
            <div className="rounded-2xl border border-[#E2E6F0] bg-white p-12 text-center shadow-[0_8px_30px_rgba(15,23,42,0.05)]">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF2FF]">
                <Bookmark
                  size={36}
                  className="text-[#4F46E5]"
                />
              </div>

              <p className="mb-2 font-semibold text-[#0B132B]">
                No saved jobs yet
              </p>

              <p className="text-sm text-[#64748B]">
                Click the bookmark icon on any job to save it here.
              </p>
            </div>
          ) : (
            /* Saved Jobs */
            <div className="space-y-3 md:space-y-4">
              {bookmarks.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                />
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}