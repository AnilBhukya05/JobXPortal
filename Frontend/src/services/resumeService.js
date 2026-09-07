import { request } from "./api";

export function fetchResume() {
  return request("/resume");
}

export function saveResumeApi(data) {
  return request("/resume", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}