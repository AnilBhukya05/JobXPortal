import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { request } from "../services/api";

export default function CompanyProfile() {
  const { employerId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await request(`/companies/${employerId}`);
        setData(res);
      } catch (err) {
        setError(err.message || "Company not found");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [employerId]);

  if (loading) return <><Navbar /><div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--muted)", textAlign: "center", padding: 64, fontFamily: "Poppins" }}>Loading...</div><Footer /></>;
  if (error) return <><Navbar /><div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--muted)", textAlign: "center", padding: 64, fontFamily: "Poppins" }}>{error}</div><Footer /></>;

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", padding: "32px 24px 64px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Link to="/jobs" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--muted)", textDecoration: "none", marginBottom: 24 }}>
            <ArrowLeft size={14} /> Back to jobs
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <div style={{ width: 60, height: 60, borderRadius: 14, background: "linear-gradient(135deg, var(--accent), var(--teal))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Building2 size={26} color="#09090B" />
            </div>
            <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.8rem" }}>{data.company}</h1>
          </div>

          <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 16 }}>
            {data.jobs.length} open role{data.jobs.length !== 1 ? "s" : ""}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.jobs.map((job) => (
              <Link key={job.id} to={`/job/${job.id}`} style={{
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14,
                padding: "16px 20px", textDecoration: "none", color: "var(--text)", display: "block",
              }}>
                <p style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{job.title}</p>
                <p style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--muted)" }}>{job.location} · {job.type}{job.remote ? " · Remote" : ""} · {job.salary}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}