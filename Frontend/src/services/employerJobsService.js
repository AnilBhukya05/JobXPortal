import { request } from "./api";

export async function postJobApi(payload) {
  try {
    return await request(
      "/employer/jobs",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  } catch (err) {
    throw new Error(
      err.message ||
        "Failed to post job."
    );
  }
}

export async function fetchMyJobsApi() {
  try {
    return await request(
      "/employer/jobs"
    );
  } catch (err) {
    throw new Error(
      err.message ||
        "Failed to load your job posts."
    );
  }
}

export async function deleteJobApi(id) {
  try {
    return await request(
      `/employer/jobs/${id}`,
      {
        method: "DELETE",
      }
    );
  } catch (err) {
    throw new Error(
      err.message ||
        "Failed to delete job post."
    );
  }
}

export async function fetchPublicJobsApi({
  what = "",
  where = "",
  page = 1,
} = {}) {
  try {
    const params =
      new URLSearchParams();

    if (what) {
      params.set(
        "what",
        what
      );
    }

    if (where) {
      params.set(
        "where",
        where
      );
    }

    params.set(
      "page",
      page
    );

    return await request(
      `/jobs?${params.toString()}`
    );
  } catch (err) {
    throw new Error(
      err.message ||
        "Failed to load posted jobs."
    );
  }
}

export async function recordJobViewApi(id) {
  try {
    return await request(
      `/jobs/${id}/view`,
      {
        method: "POST",
      }
    );
  } catch {
    // Silent fail — a missed view count
    // shouldn't block the page.
  }
}

export async function recordApplicationApi(id) {
  try {
    return await request(
      `/jobs/${id}/apply`,
      {
        method: "POST",
      }
    );
  } catch (err) {
    throw new Error(
      err.message ||
        "Failed to mark as applied."
    );
  }
}

/*
 * Create or reuse an application
 * tracker record for an external job.
 */
export async function addApplicationApi(
  payload
) {
  try {
    return await request(
      "/applications",
      {
        method: "POST",
        body: JSON.stringify(
          payload
        ),
      }
    );
  } catch (err) {
    throw new Error(
      err.message ||
        "Failed to start application."
    );
  }
}

/*
 * Update the application stage
 * after the user returns from
 * the external job platform.
 */
export async function updateApplicationApi(
  id,
  payload
) {
  try {
    return await request(
      `/applications/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(
          payload
        ),
      }
    );
  } catch (err) {
    throw new Error(
      err.message ||
        "Failed to update application."
    );
  }
}