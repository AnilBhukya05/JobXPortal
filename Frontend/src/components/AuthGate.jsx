import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, X, LogIn, UserPlus } from "lucide-react";
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

  // Show content with an overlay popup
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* BLURRED BACKGROUND CONTENT */}
      <div style={{ filter: "blur(4px)", pointerEvents: "none", userSelect: "none", opacity: 0.4 }}>
        {children}
      </div>

      {/* OVERLAY */}
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "rgba(9,9,11,0.7)",
        backdropFilter: "blur(6px)",
      }}>
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: "40px 36px",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          position: "relative",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}>

          {/* CLOSE BUTTON */}
          <button
            onClick={closePopup}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 30,
              height: 30,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--muted)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <X size={15} />
          </button>

          {/* LOCK ICON */}
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "rgba(0,255,179,0.1)",
            border: "2px solid rgba(0,255,179,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <Lock size={26} style={{ color: "var(--accent)" }} />
          </div>

          <h2 style={{
            fontFamily: "Poppins", fontWeight: 800,
            fontSize: "1.4rem", color: "var(--text)", marginBottom: 10,
          }}>
            Sign in to access {featureName}
          </h2>

          <p style={{
            fontFamily: "Poppins", fontSize: 13, color: "var(--muted)",
            lineHeight: 1.7, marginBottom: 28,
          }}>
            Create a free account to unlock AI Resume Match, Interview Prep,
            Cover Letter Generator, Resume Builder, Job Tracker and more.
            Your data is stored securely on your device.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link
              to="/register"
              state={{ from: location.pathname }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "13px", background: "var(--accent)", color: "#09090B",
                borderRadius: 12, textDecoration: "none",
                fontFamily: "Poppins", fontSize: 14, fontWeight: 700,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              <UserPlus size={17} />
              Create Free Account
            </Link>

            <Link
              to="/login"
              state={{ from: location.pathname }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "13px", background: "none",
                border: "1px solid var(--border)", color: "var(--text)",
                borderRadius: 12, textDecoration: "none",
                fontFamily: "Poppins", fontSize: 14, fontWeight: 600,
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <LogIn size={17} />
              Sign In
            </Link>
          </div>

          <p style={{
            fontFamily: "JetBrains Mono", fontSize: 10, color: "var(--muted)",
            marginTop: 20, letterSpacing: "0.05em",
          }}>
            No credit card · No backend · Data stays on your device
          </p>
        </div>
      </div>
    </div>
  );
}