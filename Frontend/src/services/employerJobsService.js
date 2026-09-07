import { request } from "./api";

export async function postJobApi(payload) {
  try {
    return await request("/employer/jobs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (err) {
    throw new Error(err.message || "Failed to post job.");
  }
}

export async function fetchMyJobsApi() {
  try {
    return await request("/employer/jobs");
  } catch (err) {
    throw new Error(err.message || "Failed to load your job posts.");
  }
}

export async function deleteJobApi(id) {
  try {
    return await request(`/employer/jobs/${id}`, {
      method: "DELETE",
    });
  } catch (err) {
    throw new Error(err.message || "Failed to delete job post.");
  }
}

export async function fetchPublicJobsApi({ what = "", where = "", page = 1 } = {}) {
  try {
    const params = new URLSearchParams();
    if (what) params.set("what", what);
    if (where) params.set("where", where);
    params.set("page", page);
    return await request(`/jobs?${params.toString()}`);
  } catch (err) {
    throw new Error(err.message || "Failed to load posted jobs.");
  }
}

export async function recordJobViewApi(id) {
  try {
    return await request(`/jobs/${id}/view`, { method: "POST" });
  } catch {
    // Silent fail — a missed view count shouldn't block the page from rendering.
  }
}

export async function recordApplicationApi(id) {
  try {
    return await request(`/jobs/${id}/apply`, { method: "POST" });
  } catch (err) {
    throw new Error(err.message || "Failed to mark as applied.");
  }
}