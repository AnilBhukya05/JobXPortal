import axios from "axios";

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST = "jsearch.p.rapidapi.com";
const BASE_URL = "https://jsearch.p.rapidapi.com/search";

function daysAgo(dateString) {
  if (!dateString) return 0;
  const created = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  return diff < 0 ? 0 : diff;
}

function jobTypeLabel(employmentType) {
  if (employmentType === "PARTTIME") return "Part Time";
  if (employmentType === "CONTRACTOR" || employmentType === "INTERN") return "Contract";
  return "Full Time";
}

function formatSalary(min, max, currency) {
  if (!min && !max) return "Not disclosed";
  const code = currency || "INR";
  const format = (n) => {
    if (code === "INR") return "Rs " + (n / 100000).toFixed(1) + "L";
    return code + " " + Math.round(n).toLocaleString();
  };
  if (min && max) return format(min) + " - " + format(max);
  return format(min || max);
}

function experienceBucket(result) {
  // 1) Use JSearch's actual field if available
  const exp = result.job_required_experience;
  if (exp) {
    if (exp.no_experience_required) return "fresher";
    if (typeof exp.required_experience_in_months === "number") {
      const months = exp.required_experience_in_months;
      if (months <= 12) return "fresher";
      if (months <= 24) return "junior";
      if (months <= 60) return "mid";
      return "senior";
    }
  }

  // 2) Fall back to reading the title + description for clues
  const text = ((result.job_title || "") + " " + (result.job_description || "")).toLowerCase();

  // Senior signals
  if (
    /\b(senior|sr\.?|lead|principal|staff|architect|manager|director|head of|vp |vice president|8\+|9\+|10\+|7\+|6\+)\b/.test(text)
  ) return "senior";

  // Mid signals
  if (
    /\b(3[\+\s-]*years?|4[\+\s-]*years?|5[\+\s-]*years?|mid[\s-]?level|intermediate|experienced)\b/.test(text)
  ) return "mid";

  // Junior signals
  if (
    /\b(junior|jr\.?|1[\+\s-]*years?|2[\+\s-]*years?|entry[\s-]?level|associate)\b/.test(text)
  ) return "junior";

  // Fresher signals
  if (
    /\b(fresher|fresh graduate|0[\s-]*years?|no experience|entry level|intern|trainee|graduate)\b/.test(text)
  ) return "fresher";

  // Can't determine — let it pass through all filters
  return "unknown";
}


function normalizeJob(result) {
  const locationParts = [result.job_city, result.job_state, result.job_country].filter(Boolean);
  const location = locationParts.length ? locationParts.join(", ") : "India";

  return {
    id: result.job_id,
    title: result.job_title || "Untitled Role",
    company: result.employer_name || "Confidential",
    location,
    remote: !!result.job_is_remote,
    type: jobTypeLabel(result.job_employment_type),
    portal: "live",
    source: result.job_publisher || "Web",
    experienceBucket: experienceBucket(result),
    postedDaysAgo: daysAgo(result.job_posted_at_datetime_utc),
    tags:
      Array.isArray(result.job_required_skills) && result.job_required_skills.length
        ? result.job_required_skills.slice(0, 3)
        : ["General"],
    salary: formatSalary(result.job_min_salary, result.job_max_salary, result.job_salary_currency),
    applyUrl: result.job_apply_link,
    description: result.job_description || "",
  };
}

export async function fetchJSearchJobs(options) {
  const opts = options || {};
  const what = opts.what || "jobs";
  const where = opts.where || "india";
  const page = opts.page || 1;

  if (!RAPIDAPI_KEY) {
    throw new Error("Missing RapidAPI key. Add VITE_RAPIDAPI_KEY to your .env file.");
  }

  const query = what + " in " + where;

  const { data } = await axios.get(BASE_URL, {
    params: {
      query,
      page,
      num_pages: 1,
      country: "in",
    },
    headers: {
      "X-RapidAPI-Key": RAPIDAPI_KEY,
      "X-RapidAPI-Host": RAPIDAPI_HOST,
    },
  });

  if (data.status === "ERROR") {
    throw new Error((data.error && data.error.message) || "JSearch request failed.");
  }

  const results = data.data || [];

  return {
    count: results.length,
    jobs: results.map(normalizeJob),
  };
}