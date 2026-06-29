import { useState, useEffect } from "react";

const KEY = "jobxportal_recent";

export function useRecentlyViewed() {
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(recent));
  }, [recent]);

  function addRecent(job) {
    setRecent((prev) =>
      [job, ...prev.filter((j) => j.id !== job.id)].slice(0, 8)
    );
  }

  return { recent, addRecent };
}