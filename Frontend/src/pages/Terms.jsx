import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div
        style={{
          background: "#F8FAFF",
          color: "#0B132B",
          minHeight: "100vh",
          padding: "32px 24px 64px",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "JetBrains Mono",
              fontSize: 12,
              color: "#64748B",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginBottom: 24,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#4F46E5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748B";
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <h1
            style={{
              fontFamily: "Poppins",
              fontWeight: 800,
              fontSize: "2rem",
              marginBottom: 16,
              color: "#0B132B",
            }}
          >
            Terms of Service
          </h1>

          <p
            style={{
              color: "#64748B",
              fontFamily: "Poppins",
              fontSize: 13,
              marginBottom: 32,
            }}
          >
            Last updated: September 2026
          </p>

          {[
            [
              "Using JobXPortal",
              "JobXPortal aggregates job listings and allows registered employers to post roles directly. By using this site you agree to use it lawfully and not to post false, misleading, or fraudulent job listings.",
            ],
            [
              "Accounts",
              "You're responsible for keeping your account credentials secure. One account may be registered as either a job seeker or an employer, not both roles simultaneously.",
            ],
            [
              "Job Postings",
              "Employers are solely responsible for the accuracy of listings they post. JobXPortal may remove any listing that violates these terms or is reported as fraudulent.",
            ],
            [
              "Third-Party Listings",
              "Some listings are pulled from third-party sources (LinkedIn, Naukri, Glassdoor, and others). JobXPortal does not control or guarantee the accuracy of third-party listings.",
            ],
            [
              "Limitation of Liability",
              "JobXPortal is provided as-is. We are not liable for hiring outcomes, application results, or third-party employer conduct.",
            ],
          ].map(([title, body]) => (
            <div
              key={title}
              style={{
                marginBottom: 24,
                padding: "20px 22px",
                background: "#FFFFFF",
                border: "1px solid #E2E6F0",
                borderRadius: 14,
                boxShadow: "0 4px 14px rgba(15, 23, 42, 0.035)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#C7D2FE";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(79, 70, 229, 0.07)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E2E6F0";
                e.currentTarget.style.boxShadow =
                  "0 4px 14px rgba(15, 23, 42, 0.035)";
              }}
            >
              <h2
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: 16,
                  marginBottom: 8,
                  color: "#0B132B",
                }}
              >
                {title}
              </h2>

              <p
                style={{
                  color: "#64748B",
                  fontFamily: "Poppins",
                  fontSize: 14,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}