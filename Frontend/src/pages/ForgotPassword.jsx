import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { forgotPasswordApi } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await forgotPasswordApi(email.trim());
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          background: "#F8FAFF",
          color: "#0B132B",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 380,
            background: "#FFFFFF",
            border: "1px solid #E2E6F0",
            borderRadius: 16,
            padding: "32px 28px",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
          }}
        >
          <Link
            to="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "JetBrains Mono",
              fontSize: 12,
              color: "#64748B",
              textDecoration: "none",
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
            <ArrowLeft size={14} /> Back to sign in
          </Link>

          <h1
            style={{
              fontFamily: "Poppins",
              fontWeight: 800,
              fontSize: "1.7rem",
              marginBottom: 8,
              color: "#0B132B",
            }}
          >
            Reset your password
          </h1>

          {sent ? (
            <p
              style={{
                fontFamily: "Poppins",
                fontSize: 14,
                color: "#64748B",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              If an account exists for{" "}
              <strong style={{ color: "#0B132B" }}>{email}</strong>, a reset
              link has been sent. Check your inbox.
            </p>
          ) : (
            <>
              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: 13,
                  color: "#64748B",
                  marginBottom: 28,
                  lineHeight: 1.6,
                }}
              >
                Enter your email and we'll send you a link to reset your
                password.
              </p>

              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    position: "relative",
                    marginBottom: 20,
                  }}
                >
                  <Mail
                    size={16}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 13,
                      color: "#94A3B8",
                    }}
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid #D9DEEA",
                      padding: "10px 0 10px 24px",
                      color: "#0B132B",
                      fontFamily: "Poppins",
                      fontSize: 14.5,
                      outline: "none",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderBottomColor = "#4F46E5";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderBottomColor = "#D9DEEA";
                    }}
                  />
                </div>

                {error && (
                  <p
                    style={{
                      color: "#E11D48",
                      fontFamily: "Poppins",
                      fontSize: 13,
                      marginBottom: 16,
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "13px",
                    background: "#4F46E5",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: 10,
                    cursor: loading ? "default" : "pointer",
                    fontFamily: "Poppins",
                    fontSize: 14,
                    fontWeight: 700,
                    opacity: loading ? 0.75 : 1,
                    boxShadow: "0 8px 20px rgba(79, 70, 229, 0.18)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "#4338CA";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#4F46E5";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {loading ? (
                    <Loader2
                      size={17}
                      style={{
                        animation: "spin 1s linear infinite",
                      }}
                    />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}