import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { JobsProvider } from "./context/JobsContext";
import { BookmarkProvider } from "./context/BookmarkContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <JobsProvider>
        <BookmarkProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </BookmarkProvider>
      </JobsProvider>
    </AuthProvider>
  </React.StrictMode>
);