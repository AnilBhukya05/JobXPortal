import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User, Briefcase, GraduationCap, Globe, Code2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchPublicProfileApi } from "../services/profileService";

export default function PublicProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchPublicProfileApi(userId);
        setProfile(res.profile);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  if (loading) return <><Navbar /><div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--muted)", textAlign: "center", padding: 64, fontFamily: "Poppins" }}>Loading...</div><Footer /></>;
  if (error || !profile) return <><Navbar /><div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--muted)", textAlign: "center", padding: 64, fontFamily: "Poppins" }}>{error || "Profile not found"}</div><Footer /></>;

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", padding: "32px 24px 64px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--teal))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins", fontWeight: 800, fontSize: 26, color: "#09090B" }}>
              {profile.photo ? <img src={profile.photo} alt={profile.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : (profile.name?.charAt(0).toUpperCase() || <User size={28} />)}
            </div>
            <div>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.6rem" }}>{profile.name || "JobXPortal User"}</h1>
              <p style={{ color: "var(--muted)", fontFamily: "Poppins", fontSize: 14 }}>{profile.headline}</p>
            </div>
          </div>

          {profile.about && <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>{profile.about}</p>}

          {profile.skills?.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 10 }}>Skills</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {profile.skills.map((s) => <span key={s} style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(0,255,179,0.08)", border: "1px solid rgba(0,255,179,0.25)", color: "var(--accent)", fontSize: 12, fontFamily: "Poppins" }}>{s}</span>)}
              </div>
            </div>
          )}

          {profile.experience?.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 10 }}>Experience</p>
              {profile.experience.map((item, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <p style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 14 }}>{item.title || item.role}</p>
                  <p style={{ color: "var(--muted)", fontFamily: "Poppins", fontSize: 13 }}>{item.company}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontFamily: "Poppins", fontSize: 13, textDecoration: "none" }}><Globe size={14} style={{ verticalAlign: -2 }} /> LinkedIn</a>}
            {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontFamily: "Poppins", fontSize: 13, textDecoration: "none" }}><Code2 size={14} style={{ verticalAlign: -2 }} /> GitHub</a>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}