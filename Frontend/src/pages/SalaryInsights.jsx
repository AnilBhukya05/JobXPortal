import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SALARY_DATA = [
  { role: "Frontend Developer", city: "Bangalore", fresher: [3,5], junior: [6,10], mid: [12,20], senior: [22,40] },
  { role: "Frontend Developer", city: "Hyderabad", fresher: [3,4.5], junior: [5,9], mid: [10,18], senior: [18,35] },
  { role: "Frontend Developer", city: "Mumbai", fresher: [3.5,5], junior: [6,11], mid: [12,22], senior: [20,40] },
  { role: "Frontend Developer", city: "Pune", fresher: [2.5,4], junior: [5,8], mid: [9,16], senior: [16,30] },
  { role: "Backend Developer", city: "Bangalore", fresher: [3.5,6], junior: [7,12], mid: [14,25], senior: [25,50] },
  { role: "Backend Developer", city: "Hyderabad", fresher: [3,5], junior: [6,11], mid: [12,22], senior: [20,42] },
  { role: "Backend Developer", city: "Mumbai", fresher: [3.5,6], junior: [7,13], mid: [14,26], senior: [24,45] },
  { role: "Full Stack Developer", city: "Bangalore", fresher: [4,7], junior: [8,14], mid: [16,28], senior: [28,55] },
  { role: "Full Stack Developer", city: "Hyderabad", fresher: [3.5,6], junior: [7,12], mid: [14,24], senior: [24,48] },
  { role: "Data Analyst", city: "Bangalore", fresher: [3,5], junior: [5,9], mid: [10,18], senior: [18,35] },
  { role: "Data Analyst", city: "Hyderabad", fresher: [2.5,4.5], junior: [5,8], mid: [9,16], senior: [16,30] },
  { role: "Data Analyst", city: "Mumbai", fresher: [3,5], junior: [5,9], mid: [10,18], senior: [18,35] },
  { role: "Data Scientist", city: "Bangalore", fresher: [5,8], junior: [9,16], mid: [18,32], senior: [32,65] },
  { role: "Data Scientist", city: "Hyderabad", fresher: [4,7], junior: [8,14], mid: [16,28], senior: [28,55] },
  { role: "DevOps Engineer", city: "Bangalore", fresher: [4,6], junior: [7,12], mid: [14,24], senior: [24,48] },
  { role: "DevOps Engineer", city: "Hyderabad", fresher: [3.5,5.5], junior: [6,11], mid: [12,22], senior: [20,42] },
  { role: "UI/UX Designer", city: "Bangalore", fresher: [3,5], junior: [5,9], mid: [10,18], senior: [18,35] },
  { role: "UI/UX Designer", city: "Mumbai", fresher: [3.5,5.5], junior: [6,10], mid: [12,20], senior: [20,38] },
  { role: "Product Manager", city: "Bangalore", fresher: [6,10], junior: [12,20], mid: [22,40], senior: [40,80] },
  { role: "Product Manager", city: "Mumbai", fresher: [6,10], junior: [12,20], mid: [22,40], senior: [38,75] },
  { role: "QA Engineer", city: "Bangalore", fresher: [2.5,4], junior: [4,8], mid: [8,15], senior: [14,28] },
  { role: "QA Engineer", city: "Hyderabad", fresher: [2,3.5], junior: [3.5,7], mid: [7,13], senior: [12,25] },
  { role: "Machine Learning Engineer", city: "Bangalore", fresher: [5,9], junior: [10,18], mid: [20,38], senior: [38,75] },
  { role: "Machine Learning Engineer", city: "Hyderabad", fresher: [4.5,8], junior: [9,16], mid: [18,34], senior: [34,65] },
  { role: "Android Developer", city: "Bangalore", fresher: [3,5], junior: [6,10], mid: [12,22], senior: [20,40] },
  { role: "iOS Developer", city: "Bangalore", fresher: [3.5,5.5], junior: [7,12], mid: [14,24], senior: [24,48] },
  { role: "Cloud Engineer", city: "Bangalore", fresher: [4,7], junior: [8,14], mid: [16,28], senior: [28,55] },
  { role: "Cybersecurity Analyst", city: "Bangalore", fresher: [3.5,6], junior: [7,12], mid: [14,24], senior: [24,50] },
  { role: "Business Analyst", city: "Bangalore", fresher: [3,5], junior: [5,9], mid: [10,18], senior: [18,36] },
  { role: "Business Analyst", city: "Mumbai", fresher: [3.5,5.5], junior: [6,10], mid: [12,20], senior: [20,40] },
  { role: "HR Manager", city: "Bangalore", fresher: [2.5,4], junior: [4,7], mid: [7,14], senior: [14,28] },
  { role: "HR Manager", city: "Mumbai", fresher: [3,5], junior: [5,9], mid: [9,16], senior: [16,30] },
  { role: "Marketing Manager", city: "Bangalore", fresher: [2.5,4], junior: [4,8], mid: [8,16], senior: [16,35] },
  { role: "Sales Executive", city: "Bangalore", fresher: [2.5,4], junior: [4,8], mid: [8,15], senior: [15,30] },
  { role: "Content Writer", city: "Bangalore", fresher: [2,3.5], junior: [3.5,6], mid: [6,12], senior: [12,24] },
  { role: "Finance Analyst", city: "Mumbai", fresher: [3,5], junior: [5,10], mid: [10,20], senior: [20,45] },
  { role: "Finance Analyst", city: "Bangalore", fresher: [3,5], junior: [5,9], mid: [9,18], senior: [18,40] },
];

const CITIES = ["All Cities", "Bangalore", "Hyderabad", "Mumbai", "Pune"];
const LEVELS = ["fresher", "junior", "mid", "senior"];
const LEVEL_LABELS = { fresher: "Fresher", junior: "Junior", mid: "Mid-level", senior: "Senior" };
const LEVEL_COLORS = { fresher: "#10B981", junior: "#2DD4BF", mid: "#FFB020", senior: "#a78bfa" };

const RANK_COLORS = ["#00FFB3", "#2DD4BF", "#FFB020"];

function avgOf([min, max]) {
  return (min + max) / 2;
}

export default function SalaryInsights() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All Cities");
  const [level, setLevel] = useState("fresher");
  const [expanded, setExpanded] = useState(null);

  const ranked = useMemo(() => {
    const filtered = SALARY_DATA.filter((d) => {
      if (city !== "All Cities" && d.city !== city) return false;
      if (search && !(d.role + " " + d.city).toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    return [...filtered].sort((a, b) => avgOf(b[level]) - avgOf(a[level]));
  }, [search, city, level]);

  const globalMax = Math.max(...ranked.map((d) => d[level][1]), 1);

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 24px 64px" }}>

          <button onClick={() => navigate(-1)} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--muted)",
            background: "none", border: "none", cursor: "pointer", marginBottom: 24,
            letterSpacing: "0.08em",
          }}>
            <ArrowLeft size={14} /> Back
          </button>

          <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
            SALARY INSIGHTS
          </p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: 8 }}>
            Who's earning the most right now
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 28, maxWidth: 560, lineHeight: 1.7 }}>
            Ranked by average pay at the experience level you pick below. Figures are in LPA (Lakhs Per Annum), based on industry surveys — your actual offer will always come down to the specific company and how well you negotiate.
          </p>

          {/* FILTERS */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search a role..."
                style={{
                  paddingLeft: 34, paddingRight: 14, paddingTop: 10, paddingBottom: 10,
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: 10, color: "var(--text)",
                  fontFamily: "Poppins", fontSize: 13, outline: "none", width: 200,
                }}
              />
            </div>

            <select value={city} onChange={(e) => setCity(e.target.value)} style={{
              padding: "10px 14px", background: "var(--surface)",
              border: "1px solid var(--border)", borderRadius: 10,
              color: "var(--text)", fontFamily: "Poppins", fontSize: 13, outline: "none", cursor: "pointer",
            }}>
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>

            <div style={{ display: "flex", gap: 6 }}>
              {LEVELS.map((l) => (
                <button key={l} onClick={() => { setLevel(l); setExpanded(null); }} style={{
                  padding: "8px 14px", borderRadius: 9,
                  border: `1px solid ${level === l ? LEVEL_COLORS[l] : "var(--border)"}`,
                  background: level === l ? LEVEL_COLORS[l] + "18" : "none",
                  color: level === l ? LEVEL_COLORS[l] : "var(--muted)",
                  fontFamily: "Poppins", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.15s",
                }}>
                  {LEVEL_LABELS[l]}
                </button>
              ))}
            </div>
          </div>

          <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "var(--muted)", marginBottom: 20 }}>
            Showing {ranked.length} {ranked.length === 1 ? "role" : "roles"}, ranked by {LEVEL_LABELS[level].toLowerCase()} pay · tap a row to see its full ladder
          </p>

          {/* LEADERBOARD */}
          <div style={{ border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", background: "var(--surface)" }}>
            {ranked.length === 0 && (
              <div style={{ padding: "40px 24px", textAlign: "center", color: "var(--muted)", fontFamily: "Poppins", fontSize: 13 }}>
                No roles match that search. Try a different keyword or city.
              </div>
            )}

            {ranked.map((d, i) => {
              const [min, max] = d[level];
              const avg = avgOf([min, max]).toFixed(1);
              const barPct = Math.max(6, (avg / globalMax) * 100);
              const rankColor = RANK_COLORS[i] || "var(--muted)";
              const isOpen = expanded === i;
              const key = d.role + d.city;

              return (
                <div key={key} style={{ borderBottom: i < ranked.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : i)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 16,
                      padding: "16px 20px", background: isOpen ? "var(--bg)" : "none",
                      border: "none", cursor: "pointer", textAlign: "left",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.background = "var(--bg)"; }}
                    onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.background = "none"; }}
                  >
                    {/* RANK */}
                    <span style={{
                      fontFamily: "JetBrains Mono", fontSize: 18, fontWeight: 700,
                      color: rankColor, width: 32, flexShrink: 0, opacity: i < 3 ? 1 : 0.5,
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* ROLE + BAR */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "Poppins", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                          {d.role}
                        </span>
                        <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "var(--muted)" }}>
                          {d.city}
                        </span>
                      </div>
                      <div style={{ height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", width: barPct + "%",
                          background: rankColor, borderRadius: 3,
                          transition: "width 0.4s ease",
                        }} />
                      </div>
                    </div>

                    {/* AVG */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "JetBrains Mono", fontSize: 17, fontWeight: 700, color: "var(--text)" }}>
                        ₹{avg}L
                      </div>
                      <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "var(--muted)" }}>avg/yr</div>
                    </div>

                    <ChevronDown size={16} style={{
                      color: "var(--muted)", flexShrink: 0,
                      transform: isOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }} />
                  </button>

                  {/* EXPANDED LADDER */}
                  {isOpen && (
                    <div style={{ padding: "0 20px 22px 68px", background: "var(--bg)" }}>
                      <div style={{ display: "flex", gap: 0, position: "relative", marginBottom: 16 }}>
                        {LEVELS.map((l, li) => {
                          const [lMin, lMax] = d[l];
                          const active = l === level;
                          return (
                            <div key={l} style={{ flex: 1, position: "relative", paddingTop: 4 }}>
                              {li > 0 && (
                                <div style={{
                                  position: "absolute", top: 9, left: "-50%", width: "100%", height: 2,
                                  background: "var(--border)",
                                }} />
                              )}
                              <div style={{
                                width: 10, height: 10, borderRadius: "50%",
                                background: active ? LEVEL_COLORS[l] : "var(--border)",
                                border: active ? `2px solid ${LEVEL_COLORS[l]}50` : "none",
                                margin: "0 auto 10px", position: "relative", zIndex: 1,
                              }} />
                              <div style={{ textAlign: "center" }}>
                                <div style={{
                                  fontFamily: "JetBrains Mono", fontSize: 10, textTransform: "uppercase",
                                  color: active ? LEVEL_COLORS[l] : "var(--muted)", marginBottom: 3, fontWeight: active ? 700 : 400,
                                }}>
                                  {LEVEL_LABELS[l]}
                                </div>
                                <div style={{
                                  fontFamily: "JetBrains Mono", fontSize: 12, fontWeight: 600,
                                  color: active ? "var(--text)" : "var(--muted)",
                                }}>
                                  {lMin}–{lMax}L
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <Link
                        to={`/jobs?q=${encodeURIComponent(d.role)}&where=${encodeURIComponent(d.city.toLowerCase())}`}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "8px 16px", background: "var(--surface)",
                          border: "1px solid var(--border)", borderRadius: 8,
                          color: "var(--accent)", textDecoration: "none",
                          fontFamily: "Poppins", fontSize: 12, fontWeight: 600,
                          transition: "border-color 0.15s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                      >
                        Find {d.role} jobs in {d.city} →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{ color: "var(--muted)", fontFamily: "JetBrains Mono", fontSize: 10, marginTop: 24, textAlign: "center", letterSpacing: "0.05em" }}>
            Figures are approximate and vary by company, skills and negotiation.
          </p>
        </div>
        <Footer />
      </div>
    </>
  );
}