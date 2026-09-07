import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { fetchBookmarks, addBookmarkApi, removeBookmarkApi } from "../services/bookmarkService";

const BookmarkContext = createContext(null);

function toJobShape(b) {
  return {
    id: b.jobId,
    title: b.title,
    company: b.company,
    location: b.location,
    applyUrl: b.url,
    source: b.source,
  };
}

export function BookmarkProvider({ children }) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [recent, setRecent] = useState([]);

  const recentKey = user ? `jxp_${user.id}_recent` : null;

  const loadBookmarks = useCallback(async () => {
    if (!user) {
      setBookmarks([]);
      return;
    }
    try {
      const { bookmarks } = await fetchBookmarks();
      setBookmarks(bookmarks.map(toJobShape));
    } catch {
      setBookmarks([]);
    }
  }, [user]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  useEffect(() => {
    if (recentKey) {
      try {
        setRecent(JSON.parse(localStorage.getItem(recentKey)) || []);
      } catch {
        setRecent([]);
      }
    } else {
      setRecent([]);
    }
  }, [recentKey]);

  async function toggle(job) {
    if (!user) return;
    const already = bookmarks.some((b) => String(b.id) === String(job.id));

    if (already) {
      setBookmarks((prev) => prev.filter((b) => String(b.id) !== String(job.id)));
      try {
        await removeBookmarkApi(job.id);
      } catch {
        loadBookmarks();
      }
    } else {
      setBookmarks((prev) => [job, ...prev]);
      try {
        await addBookmarkApi({
          jobId: String(job.id),
          title: job.title,
          company: job.company,
          location: job.location,
          url: job.applyUrl,
          source: job.source || "",
        });
      } catch {
        loadBookmarks();
      }
    }
  }

  function isBookmarked(id) {
    return bookmarks.some((b) => String(b.id) === String(id));
  }

  function addRecent(job) {
    if (!user) return;
    const updated = [job, ...recent.filter((j) => j.id !== job.id)].slice(0, 8);
    setRecent(updated);
    localStorage.setItem(recentKey, JSON.stringify(updated));
  }

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggle, isBookmarked, recent, addRecent }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarkContext() {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error("useBookmarkContext must be used within a BookmarkProvider");
  return ctx;
}