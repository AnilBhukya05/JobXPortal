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
      <div className="bg-[var(--bg)] min-h-screen text-[var(--text)]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 font-mono text-sm text-[var(--muted)] hover:text-[#10B981] transition mb-6"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <p className="font-mono text-xs tracking-widest text-[var(--muted)] mb-2">
            SAVED JOBS
          </p>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-3">
            Your Bookmarks
          </h1>
          <p className="text-[var(--muted)] text-sm mb-8">
            {bookmarks.length} saved {bookmarks.length === 1 ? "job" : "jobs"}
          </p>

          {bookmarks.length === 0 ? (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-12 text-center">
              <Bookmark size={36} className="mx-auto text-[var(--muted)] mb-4" />
              <p className="text-[var(--text)] font-semibold mb-2">
                No saved jobs yet
              </p>
              <p className="text-[var(--muted)] text-sm">
                Click the bookmark icon on any job to save it here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {bookmarks.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}