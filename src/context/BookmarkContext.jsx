import { createContext, useContext } from "react";
import { useBookmarks } from "../hooks/useBookmarks";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";

const BookmarkContext = createContext(null);

export function BookmarkProvider({ children }) {
  const { bookmarks, toggle, isBookmarked } = useBookmarks();
  const { recent, addRecent } = useRecentlyViewed();

  return (
    <BookmarkContext.Provider
      value={{ bookmarks, toggle, isBookmarked, recent, addRecent }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarkContext() {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error("useBookmarkContext must be inside BookmarkProvider");
  return ctx;
}