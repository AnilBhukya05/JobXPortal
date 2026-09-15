import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, User } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { searchCandidatesApi } from "../services/profileService";

export default function Candidates() {
  const [q, setQ] = useState("");
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await searchCandidatesApi({ q, skill, location });
      setCandidates(res.candidates || []);
      setSearched(true);
    } catch (err) {
      setError(err.message);
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
          padding: "40px 24px 72px",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {/* Header */}
          <p
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 11,
              letterSpacing: "0.12em",
              color: "#64748B",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            FOR EMPLOYERS
          </p>

          <h1
            style={{
              fontFamily: "Poppins",
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "#0B132B",
              letterSpacing: "-0.03em",
              marginBottom: 28,
            }}
          >
            Browse Candidates
          </h1>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr auto",
              gap: 10,
              marginBottom: 32,
            }}
            className="cand-grid"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or headline..."
              style={{
                background: "#FFFFFF",
                border: "1px solid #D9E0EC",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#0B132B",
                fontFamily: "Poppins",
                fontSize: 13,
                outline: "none",
                boxShadow: "0 2px 8px rgba(15,23,42,0.03)",
              }}
            />

            <input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="Skill (e.g. React)"
              style={{
                background: "#FFFFFF",
                border: "1px solid #D9E0EC",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#0B132B",
                fontFamily: "Poppins",
                fontSize: 13,
                outline: "none",
                boxShadow: "0 2px 8px rgba(15,23,42,0.03)",
              }}
            />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              style={{
                background: "#FFFFFF",
                border: "1px solid #D9E0EC",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#0B132B",
                fontFamily: "Poppins",
                fontSize: 13,
                outline: "none",
                boxShadow: "0 2px 8px rgba(15,23,42,0.03)",
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "12px 20px",
                background: "linear-gradient(135deg, #4F46E5, #7138E8)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 10,
                fontFamily: "Poppins",
                fontSize: 13,
                fontWeight: 700,
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.75 : 1,
                boxShadow: "0 8px 20px rgba(79,70,229,0.16)",
              }}
            >
              <Search size={15} />
              {loading ? "..." : "Search"}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "#FFF1F2",
                border: "1px solid #FECDD3",
                borderRadius: 10,
                padding: "11px 14px",
                color: "#E11D48",
                fontFamily: "Poppins",
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              {error}
            </div>
          )}

          {/* Empty */}
          {searched && candidates.length === 0 && !loading && (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E6F0",
                borderRadius: 16,
                padding: "48px 24px",
                textAlign: "center",
                boxShadow: "0 8px 30px rgba(15,23,42,0.04)",
              }}
            >
              <User
                size={30}
                style={{
                  color: "#A5B4FC",
                  marginBottom: 12,
                }}
              />

              <p
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#0B132B",
                  marginBottom: 6,
                }}
              >
                No candidates matched your search.
              </p>

              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: 13,
                  color: "#64748B",
                }}
              >
                Try adjusting your search, skill, or location.
              </p>
            </div>
          )}

          {/* Candidates */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {candidates.map((c) => (
              <Link
                key={c.userId}
                to={`/u/${c.userId}`}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "18px",
                  textDecoration: "none",
                  color: "var(--text)",
                  display: "block",
                }}
              >
                {/* Candidate Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #EEF2FF, #F5F3FF)",
                      border: "1px solid #DDE3F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "Poppins",
                      fontWeight: 800,
                      color: "#4F46E5",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {c.photo ? (
                      <img
                        src={c.photo}
                        alt={c.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      c.name?.charAt(0).toUpperCase() || <User size={18} />
                    )}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#0B132B",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        margin: 0,
                      }}
                    >
                      {c.name}
                    </p>

                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontSize: 12,
                        color: "#64748B",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        margin: "3px 0 0",
                      }}
                    >
                      {c.headline}
                    </p>
                  </div>
                </div>

                {/* Location */}
                {c.address && (
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontFamily: "JetBrains Mono",
                      fontSize: 11,
                      color: "#64748B",
                      marginBottom: 12,
                    }}
                  >
                    <MapPin size={11} style={{ color: "#4F46E5" }} />
                    {c.address}
                  </p>
                )}

                {/* Skills */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  {c.skills.map((s) => (
                    <span
                      key={s}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 20,
                        background: "#F4F3FF",
                        border: "1px solid #E0E7FF",
                        color: "#4F46E5",
                        fontSize: 11,
                        fontFamily: "Poppins",
                        fontWeight: 500,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Availability */}
                {c.available && (
                  <p
                    style={{
                      marginTop: 12,
                      marginBottom: 0,
                      fontFamily: "JetBrains Mono",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#059669",
                    }}
                  >
                    ● Available now
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        input::placeholder {
          color: #94A3B8;
        }

        input:focus {
          border-color: #A5B4FC !important;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.08) !important;
        }

        @media(max-width:700px) {
          .cand-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
