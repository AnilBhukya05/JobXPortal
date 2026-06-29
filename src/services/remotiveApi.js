import axios from "axios";

const BASE_URL = "https://remotive.com/api/remote-jobs";

function daysAgo(dateString) {
  if (!dateString) return 0;
  const created = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  return diff < 0 ? 0 : diff;
}

function jobTypeLabel(type) {
  if (!type) return "Full Time";
  if (type === "part_time") return "Part Time";
  if (type === "contract") return "Contract";
  if (type === "freelance") return "Contract";
  if (type === "internship") return "Internship";
  return "Full Time";
}

function normalizeJob(result) {
  return {
    id: "remotive-" + result.id,
    title: result.title || "Untitled Role",
    company: result.company_name || "Confidential",
    location: result.candidate_required_location || "Worldwide",
    remote: true,
    type: jobTypeLabel(result.job_type),
    portal: "live",
    source: "Remotive",
    experienceBucket: "unknown",
    postedDaysAgo: daysAgo(result.publication_date),
    tags: result.tags
      ? result.tags.slice(0, 3)
      : [result.category || "General"],
    salary: result.salary || "Not disclosed",
    applyUrl: result.url,
    description: result.description
      ? result.description.replace(/<[^>]+>/g, "").slice(0, 600) + "..."
      : "",
  };
}

export async function fetchRemotiveJobs({ search = "", limit = 20, offset = 0 } = {}) {
  const params = { limit };
  if (search) params.search = search;

  const { data } = await axios.get(BASE_URL, { params });

  const allJobs = (data.jobs || []).map(normalizeJob);
  const sliced = allJobs.slice(offset, offset + limit);

  return {
    count: data["job-count"] || 0,
    total: allJobs.length,
    jobs: sliced,
    hasMore: offset + limit < allJobs.length,
  };
}