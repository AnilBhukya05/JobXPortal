import axios from "axios";

const APP_ID = import.meta.env.VITE_ADZUNA_APP_ID;
const APP_KEY = import.meta.env.VITE_ADZUNA_APP_KEY;
const BASE_URL = "https://api.adzuna.com/v1/api/jobs/in/search";

function decodeHtml(text) {
  if (!text) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
}

function daysAgo(dateString) {
  const created = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  return diff < 0 ? 0 : diff;
}

function formatSalary(min, max) {
  if (!min && !max) return "Not disclosed";
  const toLakh = (n) => "Rs " + (n / 100000).toFixed(1) + "L";
  if (min && max) return toLakh(min) + " - " + toLakh(max);
  return toLakh(min || max);
}

function jobTypeLabel(result) {
  if (result.contract_type === "contract") return "Contract";
  if (result.contract_time === "part_time") return "Part Time";
  return "Full Time";
}

function normalizeJob(result) {
  const location = (result.location && result.location.display_name) || "India";
  const title = decodeHtml(result.title);
  const isRemote = /remote/i.test(location) || /remote/i.test(title);

  return {
    id: result.id,
    title,
    company: (result.company && result.company.display_name) || "Confidential",
    location,
    remote: isRemote,
    type: jobTypeLabel(result),
    portal: "live",
    postedDaysAgo: daysAgo(result.created),
    tags: result.category && result.category.label ? [result.category.label] : ["General"],
    salary: formatSalary(result.salary_min, result.salary_max),
    applyUrl: result.redirect_url,
    description: decodeHtml(result.description),
  };
}

export async function fetchJobs(options) {
  const opts = options || {};
  const what = opts.what || "";
  const where = opts.where || "india";
  const page = opts.page || 1;
  const resultsPerPage = opts.resultsPerPage || 20;

  if (!APP_ID || !APP_KEY) {
    throw new Error(
      "Missing Adzuna API credentials. Add VITE_ADZUNA_APP_ID and VITE_ADZUNA_APP_KEY to your .env file."
    );
  }

  const { data } = await axios.get(BASE_URL + "/" + page, {
    params: {
      app_id: APP_ID,
      app_key: APP_KEY,
      results_per_page: resultsPerPage,
      what,
      where,
      "content-type": "application/json",
    },
  });

  return {
    count: data.count,
    jobs: (data.results || []).map(normalizeJob),
  };
}