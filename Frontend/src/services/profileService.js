import { request } from "./api";
import { getToken } from "./api";

export async function fetchProfile() {
  try {
    return await request("/profile");
  } catch (err) {
    throw new Error(err.message || "Failed to load profile.");
  }
}

export async function saveProfileApi(payload) {
  try {
    return await request("/profile", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (err) {
    throw new Error(err.message || "Failed to save profile.");
  }
}

export async function fetchPublicProfileApi(userId) {
  try {
    return await request(`/profile/public/${userId}`);
  } catch (err) {
    throw new Error(err.message || "Failed to load profile.");
  }
}

export async function uploadResumeApi(file) {
  const formData = new FormData();
  formData.append("resume", file);

  const token = getToken();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const res = await fetch(`${API_URL}/profile/resume`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to upload resume");
  return data;
}

export async function searchCandidatesApi({ q = "", skill = "", location = "" } = {}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (skill) params.set("skill", skill);
  if (location) params.set("location", location);
  try {
    return await request(`/profile/candidates?${params.toString()}`);
  } catch (err) {
    throw new Error(err.message || "Failed to search candidates.");
  }
}