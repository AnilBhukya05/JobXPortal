import { request } from "./api";

export function fetchBookmarks() {
  return request("/bookmarks");
}

export function addBookmarkApi(job) {
  return request("/bookmarks", {
    method: "POST",
    body: JSON.stringify(job),
  });
}

export function removeBookmarkApi(jobId) {
  return request(`/bookmarks/${jobId}`, { method: "DELETE" });
}