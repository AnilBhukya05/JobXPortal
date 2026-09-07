import { request } from "./api";

export function registerUser(name, email, password, role) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, role }),
  });
}

export function loginUser(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function fetchMe() {
  return request("/auth/me");
}

export function forgotPasswordApi(email) {
  return request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
}

export function resetPasswordApi(token, password) {
  return request("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) });
}