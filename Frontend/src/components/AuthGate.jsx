import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, X, LogIn, UserPlus, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthGate({ children, featureName = "this feature" }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) return null;
  if (user) return children;

  function closePopup() {
    // Take them back to wherever they came from; fall back to home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
      }}
    >
      {/* BLURRED BACKGROUND CONTENT */}

      <div
        style={{
          filter: "blur(4px)",
          pointerEvents: "none",
          userSelect: "none",
          opacity: 0.4,
        }}
      >
        {children}
      </div>

      {/* OVERLAY */}

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "rgba(11,19,43,0.45)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {/* POPUP */}

        <div
          className="auth-gate-popup"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E6F0",
            borderRadius: 22,
            padding: "40px 36px 32px",
            maxWidth: 440,
            width: "100%",
            textAlign: "center",
            position: "relative",
            boxShadow: "0 30px 80px rgba(15,23,42,0.20)",
            animation: "authPopupIn 0.35s ease-out",
          }}
        >
          {/* CLOSE BUTTON */}

          <button
            onClick={closePopup}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 34,
              height: 34,
              borderRadius: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#FFFFFF",
              border: "1px solid #E2E6F0",
              color: "#64748B",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#4F46E5";
              e.currentTarget.style.borderColor = "#4F46E5";
              e.currentTarget.style.background = "#F8FAFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748B";
              e.currentTarget.style.borderColor = "#E2E6F0";
              e.currentTarget.style.background = "#FFFFFF";
            }}
          >
            <X size={16} />
          </button>

          {/* LOCK ICON */}

          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(79,70,229,0.10), rgba(16,185,129,0.10))",
              border: "1px solid rgba(79,70,229,0.20)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 8px 24px rgba(79,70,229,0.08)",
            }}
          >
            <Lock size={27} color="#4F46E5" strokeWidth={2} />
          </div>

          {/* TITLE */}

          <h2
            style={{
              fontFamily: "Poppins",
              fontWeight: 800,
              fontSize: "clamp(1.3rem, 4vw, 1.55rem)",
              letterSpacing: "-0.025em",
              color: "#0B132B",
              marginBottom: 11,
              lineHeight: 1.3,
            }}
          >
            Sign in to access {featureName}
          </h2>

          {/* DESCRIPTION */}

          <p
            style={{
              fontFamily: "Poppins",
              fontSize: 13,
              color: "#64748B",
              lineHeight: 1.75,
              margin: "0 auto 28px",
              maxWidth: 370,
            }}
          >
            Create a free account to unlock AI Resume Match, Interview Prep,
            Cover Letter Generator, Resume Builder, Job Tracker and more. Your
            data is stored securely on your device.
          </p>

          {/* ACTIONS */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {/* CREATE ACCOUNT */}

            <Link
              to="/register"
              state={{ from: location.pathname }}
              className="auth-primary-button"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "13px",
                background: "#4F46E5",
                color: "#FFFFFF",
                borderRadius: 11,
                textDecoration: "none",
                fontFamily: "Poppins",
                fontSize: 14,
                fontWeight: 700,
                transition: "all 0.2s ease",
                boxShadow: "0 7px 18px rgba(79,70,229,0.18)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#4338CA";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 11px 24px rgba(79,70,229,0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#4F46E5";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 7px 18px rgba(79,70,229,0.18)";
              }}
            >
              <UserPlus size={17} />
              Create Free Account
            </Link>

            {/* SIGN IN */}

            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="auth-secondary-button"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "13px",
                background: "#FFFFFF",
                border: "1px solid #E2E6F0",
                color: "#0B132B",
                borderRadius: 11,
                textDecoration: "none",
                fontFamily: "Poppins",
                fontSize: 14,
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#4F46E5";
                e.currentTarget.style.color = "#4F46E5";
                e.currentTarget.style.background = "#F8FAFF";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E2E6F0";
                e.currentTarget.style.color = "#0B132B";
                e.currentTarget.style.background = "#FFFFFF";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <LogIn size={17} />
              Sign In
            </Link>
          </div>

          {/* SECURITY NOTE */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              marginTop: 21,
              color: "#94A3B8",
              fontFamily: "JetBrains Mono",
              fontSize: 9.5,
              letterSpacing: "0.045em",
              lineHeight: 1.6,
              flexWrap: "wrap",
            }}
          >
            <ShieldCheck size={13} color="#10B981" />

            <span>No credit card · No backend · Data stays on your device</span>
          </div>
        </div>
      </div>

      {/* ANIMATIONS + RESPONSIVE */}

      <style>{`
        @keyframes authPopupIn {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 520px) {
          .auth-gate-popup {
            padding: 34px 22px 27px !important;
            border-radius: 18px !important;
          }
        }

        @media (max-width: 380px) {
          .auth-gate-popup {
            padding: 30px 18px 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
