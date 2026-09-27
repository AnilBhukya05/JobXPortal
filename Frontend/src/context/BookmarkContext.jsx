import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import { useAuth } from "./AuthContext";

import {
  fetchBookmarks,
  addBookmarkApi,
  removeBookmarkApi,
} from "../services/bookmarkService";

const BookmarkContext = createContext(null);

// Convert backend bookmark into JobXPortal job format


function toJobShape(bookmark) {
  return {
    id: bookmark.jobId,
    title: bookmark.title || "",
    company: bookmark.company || "",
    location: bookmark.location || "",
    applyUrl: bookmark.url || "",
    source: bookmark.source || "",
  };
}


// BOOKMARK PROVIDER


export function BookmarkProvider({ children }) {
  const { user } = useAuth();

  const userId = user?.id || user?._id || null;

  const [bookmarks, setBookmarks] = useState([]);
  const [recent, setRecent] = useState([]);

  const recentKey = userId
    ? `jxp_${userId}_recent`
    : null;


  // LOAD BOOKMARKS


  const loadBookmarks = useCallback(async () => {
    if (!userId) {
      setBookmarks([]);
      return;
    }

    try {
      const result = await fetchBookmarks();

      const serverBookmarks = Array.isArray(
        result?.bookmarks
      )
        ? result.bookmarks
        : [];

      const formattedBookmarks =
        serverBookmarks.map(toJobShape);

      setBookmarks(formattedBookmarks);
    } catch (error) {
      console.error(
        "Failed to load bookmarks:",
        error
      );

      setBookmarks([]);
    }
  }, [userId]);


  // LOAD SERVER BOOKMARKS
  // Runs only when userId changes
 

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!userId) {
        if (!cancelled) {
          setBookmarks([]);
        }
        return;
      }

      try {
        const result = await fetchBookmarks();

        if (cancelled) return;

        const serverBookmarks =
          Array.isArray(result?.bookmarks)
            ? result.bookmarks
            : [];

        setBookmarks(
          serverBookmarks.map(toJobShape)
        );
      } catch (error) {
        console.error(
          "Failed to load bookmarks:",
          error
        );

        if (!cancelled) {
          setBookmarks([]);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [userId]);


  // LOAD RECENT JOBS


  useEffect(() => {
    if (!recentKey) {
      setRecent([]);
      return;
    }

    try {
      const stored =
        localStorage.getItem(recentKey);

      if (!stored) {
        setRecent([]);
        return;
      }

      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setRecent(parsed);
      } else {
        setRecent([]);
      }
    } catch (error) {
      console.error(
        "Failed to load recent jobs:",
        error
      );

      setRecent([]);
    }
  }, [recentKey]);


  // TOGGLE BOOKMARK


  const toggle = useCallback(
    async (job) => {
      if (!userId || !job?.id) {
        return;
      }

      const jobId = String(job.id);

      const alreadyBookmarked =
        bookmarks.some(
          (bookmark) =>
            String(bookmark.id) === jobId
        );

      // ------------------------------------------
      // REMOVE BOOKMARK
      // ------------------------------------------

      if (alreadyBookmarked) {
        setBookmarks((previous) =>
          previous.filter(
            (bookmark) =>
              String(bookmark.id) !== jobId
          )
        );

        try {
          await removeBookmarkApi(job.id);
        } catch (error) {
          console.error(
            "Failed to remove bookmark:",
            error
          );

          await loadBookmarks();
        }

        return;
      }

      // ------------------------------------------
      // ADD BOOKMARK
      // ------------------------------------------

      setBookmarks((previous) => [
        job,
        ...previous,
      ]);

      try {
        await addBookmarkApi({
          jobId,
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          url: job.applyUrl || "",
          source: job.source || "",
        });
      } catch (error) {
        console.error(
          "Failed to add bookmark:",
          error
        );

        await loadBookmarks();
      }
    },
    [userId, bookmarks, loadBookmarks]
  );


  // CHECK BOOKMARK


  const isBookmarked = useCallback(
    (id) => {
      return bookmarks.some(
        (bookmark) =>
          String(bookmark.id) ===
          String(id)
      );
    },
    [bookmarks]
  );



  const addRecent = useCallback(
    (job) => {
      if (!userId || !recentKey || !job?.id) {
        return;
      }

      setRecent((previous) => {
        const updated = [
          job,
          ...previous.filter(
            (item) =>
              String(item.id) !==
              String(job.id)
          ),
        ].slice(0, 8);

        try {
          localStorage.setItem(
            recentKey,
            JSON.stringify(updated)
          );
        } catch (error) {
          console.error(
            "Failed to save recent jobs:",
            error
          );
        }

        return updated;
      });
    },
    [userId, recentKey]
  );


  // MEMOIZED CONTEXT VALUE


  const contextValue = useMemo(
    () => ({
      bookmarks,
      toggle,
      isBookmarked,
      recent,
      addRecent,
    }),
    [
      bookmarks,
      toggle,
      isBookmarked,
      recent,
      addRecent,
    ]
  );


  // PROVIDER
  

  return (
    <BookmarkContext.Provider
      value={contextValue}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

// CUSTOM HOOK

export function useBookmarkContext() {
  const context =
    useContext(BookmarkContext);

  if (!context) {
    throw new Error(
      "useBookmarkContext must be used within BookmarkProvider"
    );
  }

  return context;
}