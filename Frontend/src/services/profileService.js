import { request } from "./api";

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