import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { JobsProvider } from "./context/JobsContext";
import { BookmarkProvider } from "./context/BookmarkContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <JobsProvider>
        <BookmarkProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </BookmarkProvider>
      </JobsProvider>
    </ThemeProvider>
  </React.StrictMode>
);