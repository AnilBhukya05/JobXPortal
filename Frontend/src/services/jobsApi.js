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

function experienceBucket(title, description) {
  const text = ((title || "") + " " + (description || "")).toLowerCase();

  if (/\b(senior|sr\.?|lead|principal|staff|architect|manager|director|head of|vp |8\+|9\+|10\+|7\+|6\+)\b/.test(text))
    return "senior";
  if (/\b(3[\+\s-]*year|4[\+\s-]*year|5[\+\s-]*year|mid[\s-]?level|intermediate|experienced)\b/.test(text))
    return "mid";
  if (/\b(junior|jr\.?|1[\+\s-]*year|2[\+\s-]*year|entry[\s-]?level|associate)\b/.test(text))
    return "junior";
  if (/\b(fresher|fresh graduate|0[\s-]*year|no experience|entry level|intern|trainee|graduate)\b/.test(text))
    return "fresher";

  return "unknown";
}

function normalizeJob(result) {
  const location = (result.location && result.location.display_name) || "India";
  const title = decodeHtml(result.title);
  const description = decodeHtml(result.description);
  const isRemote = /remote/i.test(location) || /remote/i.test(title);

  return {
    id: result.id,
    title,
    company: (result.company && result.company.display_name) || "Confidential",
    location,
    remote: isRemote,
    type: jobTypeLabel(result),
    portal: "live",
    experienceBucket: experienceBucket(title, description),
    postedDaysAgo: daysAgo(result.created),
    tags: result.category && result.category.label ? [result.category.label] : ["General"],
    salary: formatSalary(result.salary_min, result.salary_max),
    applyUrl: result.redirect_url,
    description,
  };
}

export async function fetchJobs(options) {
  const opts = options || {};
  const what = opts.what || "";
  const where = opts.where || "india";
  const page = opts.page || 1;
  const resultsPerPage = opts.resultsPerPage || 20;

  if (!APP_ID || !APP_KEY) {
    throw new Error("Missing Adzuna API credentials.");
  }

  // For fresher/internship searches, boost with Adzuna's max_days_old
  const isFresherSearch = /fresher|intern|trainee|entry|graduate/i.test(what);

  const { data } = await axios.get(BASE_URL + "/" + page, {
    params: {
      app_id: APP_ID,
      app_key: APP_KEY,
      results_per_page: resultsPerPage,
      what,
      where,
      ...(isFresherSearch && { max_days_old: 30 }),
      "content-type": "application/json",
    },
  });

  return {
    count: data.count,
    jobs: (data.results || []).map(normalizeJob),
  };
}