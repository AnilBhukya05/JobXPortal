import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { request } from "../services/api";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function verify() {
      try {
        await request(`/auth/verify-email/${token}`);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    }
    verify();
  }, [token]);

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
        <div>
          {status === "loading" && <Loader2 size={32} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />}
          {status === "success" && (
            <>
              <CheckCircle2 size={40} style={{ color: "var(--accent)", marginBottom: 12 }} />
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.5rem", marginBottom: 10 }}>Email verified</h1>
              <Link to="/profile" style={{ color: "var(--accent)", fontFamily: "Poppins", fontSize: 14, textDecoration: "none", fontWeight: 700 }}>Go to your profile →</Link>
            </>
          )}
          {status === "error" && (
            <>
              <XCircle size={40} style={{ color: "#fb7185", marginBottom: 12 }} />
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.5rem" }}>Link expired or invalid</h1>
            </>
          )}
        </div>
      </div>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}