import { request } from "./api";

export function fetchApplications() {
  return request("/applications");
}

export function addApplicationApi(data) {
  return request("/applications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateApplicationApi(id, data) {
  return request(`/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteApplicationApi(id) {
  return request(`/applications/${id}`, { method: "DELETE" });
}