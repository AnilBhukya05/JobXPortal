import { useState, useEffect } from "react";

const KEY = "jobxportal_bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  function toggle(job) {
    setBookmarks((prev) =>
      prev.find((b) => b.id === job.id)
        ? prev.filter((b) => b.id !== job.id)
        : [job, ...prev].slice(0, 50)
    );
  }

  function isBookmarked(id) {
    return bookmarks.some((b) => b.id === id);
  }

  return { bookmarks, toggle, isBookmarked };
}