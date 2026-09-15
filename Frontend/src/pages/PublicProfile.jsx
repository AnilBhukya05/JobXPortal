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

  if (loading) {
    return (
      <>
        <Navbar />

        <div
          style={{
            background: "#F8FAFF",
            minHeight: "100vh",
            color: "#64748B",
            textAlign: "center",
            padding: 64,
            fontFamily: "Poppins",
          }}
        >
          Loading...
        </div>

        <Footer />
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Navbar />

        <div
          style={{
            background: "#F8FAFF",
            minHeight: "100vh",
            color: "#64748B",
            textAlign: "center",
            padding: 64,
            fontFamily: "Poppins",
          }}
        >
          {error || "Profile not found"}
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          background: "#F8FAFF",
          color: "#0B132B",
          minHeight: "100vh",
          padding: "48px 24px 72px",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          {/* Profile Header */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E6F0",
              borderRadius: 20,
              padding: "28px",
              marginBottom: 18,
              boxShadow: "0 8px 30px rgba(15,23,42,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 78,
                  height: 78,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #EEF2FF, #F5F3FF)",
                  border: "1px solid #DDE3F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Poppins",
                  fontWeight: 800,
                  fontSize: 28,
                  color: "#4F46E5",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  profile.name?.charAt(0).toUpperCase() || (
                    <User size={28} />
                  )
                )}
              </div>

              <div style={{ minWidth: 0 }}>
                <h1
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 800,
                    fontSize: "clamp(1.4rem, 4vw, 1.8rem)",
                    color: "#0B132B",
                    margin: 0,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {profile.name || "JobXPortal User"}
                </h1>

                {profile.headline && (
                  <p
                    style={{
                      color: "#64748B",
                      fontFamily: "Poppins",
                      fontSize: 14,
                      margin: "5px 0 0",
                    }}
                  >
                    {profile.headline}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* About */}
          {profile.about && (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E6F0",
                borderRadius: 16,
                padding: "22px 24px",
                marginBottom: 18,
                boxShadow: "0 6px 24px rgba(15,23,42,0.03)",
              }}
            >
              <p
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color: "#4F46E5",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                About
              </p>

              <p
                style={{
                  color: "#334155",
                  fontFamily: "Poppins",
                  fontSize: 14,
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                {profile.about}
              </p>
            </div>
          )}

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E6F0",
                borderRadius: 16,
                padding: "22px 24px",
                marginBottom: 18,
                boxShadow: "0 6px 24px rgba(15,23,42,0.03)",
              }}
            >
              <p
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color: "#4F46E5",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Skills
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {profile.skills.map((s) => (
                  <span
                    key={s}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      background: "#F4F3FF",
                      border: "1px solid #E0E7FF",
                      color: "#4F46E5",
                      fontSize: 12,
                      fontFamily: "Poppins",
                      fontWeight: 500,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {profile.experience?.length > 0 && (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E6F0",
                borderRadius: 16,
                padding: "22px 24px",
                marginBottom: 18,
                boxShadow: "0 6px 24px rgba(15,23,42,0.03)",
              }}
            >
              <p
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color: "#4F46E5",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Experience
              </p>

              {profile.experience.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 14,
                    paddingBottom:
                      i !== profile.experience.length - 1 ? 18 : 0,
                    marginBottom:
                      i !== profile.experience.length - 1 ? 18 : 0,
                    borderBottom:
                      i !== profile.experience.length - 1
                        ? "1px solid #EEF1F6"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: "#EEF2FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Briefcase
                      size={17}
                      style={{ color: "#4F46E5" }}
                    />
                  </div>

                  <div>
                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#0B132B",
                        margin: "0 0 3px",
                      }}
                    >
                      {item.title || item.role}
                    </p>

                    <p
                      style={{
                        color: "#64748B",
                        fontFamily: "Poppins",
                        fontSize: 13,
                        margin: 0,
                      }}
                    >
                      {item.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {profile.education?.length > 0 && (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E6F0",
                borderRadius: 16,
                padding: "22px 24px",
                marginBottom: 18,
                boxShadow: "0 6px 24px rgba(15,23,42,0.03)",
              }}
            >
              <p
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color: "#4F46E5",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Education
              </p>

              {profile.education.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 14,
                    marginBottom:
                      i !== profile.education.length - 1 ? 16 : 0,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: "#F5F3FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <GraduationCap
                      size={18}
                      style={{ color: "#7138E8" }}
                    />
                  </div>

                  <div>
                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#0B132B",
                        margin: "0 0 3px",
                      }}
                    >
                      {item.degree || item.title}
                    </p>

                    <p
                      style={{
                        color: "#64748B",
                        fontFamily: "Poppins",
                        fontSize: 13,
                        margin: 0,
                      }}
                    >
                      {item.institution || item.school}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Links */}
          {(profile.linkedin || profile.github) && (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E6F0",
                borderRadius: 16,
                padding: "20px 24px",
                boxShadow: "0 6px 24px rgba(15,23,42,0.03)",
              }}
            >
              <p
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color: "#4F46E5",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Professional Links
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "9px 14px",
                      background: "#F4F3FF",
                      border: "1px solid #E0E7FF",
                      borderRadius: 9,
                      color: "#4F46E5",
                      fontFamily: "Poppins",
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#EEF2FF";
                      e.currentTarget.style.borderColor = "#C7D2FE";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#F4F3FF";
                      e.currentTarget.style.borderColor = "#E0E7FF";
                    }}
                  >
                    <Globe size={14} />
                    LinkedIn
                  </a>
                )}

                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "9px 14px",
                      background: "#F8FAFC",
                      border: "1px solid #E2E6F0",
                      borderRadius: 9,
                      color: "#334155",
                      fontFamily: "Poppins",
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#F1F5F9";
                      e.currentTarget.style.borderColor = "#CBD5E1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#F8FAFC";
                      e.currentTarget.style.borderColor = "#E2E6F0";
                    }}
                  >
                    <Code2 size={14} />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 640px) {
          .public-profile-container {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      `}</style>
    </>
  );
}