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
    if (!email.trim()) { setError("Please enter your email."); return; }
    setError(""); setLoading(true);
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
      <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--muted)", textDecoration: "none", marginBottom: 24 }}>
            <ArrowLeft size={14} /> Back to sign in
          </Link>

          <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.7rem", marginBottom: 8 }}>Reset your password</h1>

          {sent ? (
            <p style={{ fontFamily: "Poppins", fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
              If an account exists for <strong style={{ color: "var(--text)" }}>{email}</strong>, a reset link has been sent. Check your inbox.
            </p>
          ) : (
            <>
              <p style={{ fontFamily: "Poppins", fontSize: 13, color: "var(--muted)", marginBottom: 28 }}>
                Enter your email and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit}>
                <div style={{ position: "relative", marginBottom: 20 }}>
                  <Mail size={16} style={{ position: "absolute", left: 0, top: 13, color: "var(--muted)" }} />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      width: "100%", background: "transparent", border: "none", borderBottom: "1px solid var(--border)",
                      padding: "10px 0 10px 24px", color: "var(--text)", fontFamily: "Poppins", fontSize: 14.5, outline: "none",
                    }}
                  />
                </div>
                {error && <p style={{ color: "#fb7185", fontFamily: "Poppins", fontSize: 13, marginBottom: 16 }}>{error}</p>}
                <button type="submit" disabled={loading} style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "13px", background: "var(--accent)", color: "#09090B",
                  border: "none", borderRadius: 10, cursor: "pointer",
                  fontFamily: "Poppins", fontSize: 14, fontWeight: 700, opacity: loading ? 0.75 : 1,
                }}>
                  {loading ? <Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} /> : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}