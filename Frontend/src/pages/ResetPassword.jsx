import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { resetPasswordApi } from "../services/authService";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (!token) { setError("Missing or invalid reset link."); return; }

    setError(""); setLoading(true);
    try {
      await resetPasswordApi(token, password);
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.7rem", marginBottom: 8 }}>Set a new password</h1>

          {done ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent)", fontFamily: "Poppins", fontSize: 14 }}>
              <CheckCircle2 size={18} /> Password updated — redirecting to sign in...
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {[{ v: password, set: setPassword, label: "New password" }, { v: confirm, set: setConfirm, label: "Confirm password" }].map((f, i) => (
                <div key={i} style={{ position: "relative", marginBottom: 20 }}>
                  <Lock size={16} style={{ position: "absolute", left: 0, top: 13, color: "var(--muted)" }} />
                  <input
                    type="password" value={f.v} onChange={(e) => f.set(e.target.value)}
                    placeholder={f.label}
                    style={{
                      width: "100%", background: "transparent", border: "none", borderBottom: "1px solid var(--border)",
                      padding: "10px 0 10px 24px", color: "var(--text)", fontFamily: "Poppins", fontSize: 14.5, outline: "none",
                    }}
                  />
                </div>
              ))}
              {error && <p style={{ color: "#fb7185", fontFamily: "Poppins", fontSize: 13, marginBottom: 16 }}>{error}</p>}
              <button type="submit" disabled={loading} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "13px", background: "var(--accent)", color: "#09090B",
                border: "none", borderRadius: 10, cursor: "pointer",
                fontFamily: "Poppins", fontSize: 14, fontWeight: 700, opacity: loading ? 0.75 : 1,
              }}>
                {loading ? <Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} /> : "Reset Password"}
              </button>
              <p style={{ textAlign: "center", marginTop: 20 }}>
                <Link to="/login" style={{ color: "var(--accent)", fontFamily: "Poppins", fontSize: 13, textDecoration: "none" }}>Back to sign in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}