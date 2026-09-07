import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X, ExternalLink, ChevronDown, Star, Briefcase } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useBookmarkContext } from "../context/BookmarkContext";
import {
  fetchApplications,
  addApplicationApi,
  updateApplicationApi,
  deleteApplicationApi,
} from "../services/applicationService";

const STAGES = [
  { id: "saved", label: "Saved", color: "#71717A", bg: "rgba(113,113,122,0.12)" },
  { id: "applied", label: "Applied", color: "#00FFB3", bg: "rgba(0,255,179,0.12)" },
  { id: "interview", label: "Interview", color: "#FFB020", bg: "rgba(255,176,32,0.12)" },
  { id: "offer", label: "Offer", color: "#4ade80", bg: "rgba(74,222,128,0.12)" },
  { id: "rejected", label: "Rejected", color: "#fb7185", bg: "rgba(251,113,133,0.12)" },
];

function stageMeta(id) {
  return STAGES.find((s) => s.id === id) || STAGES[0];
}

function bookmarkToCard(job) {
  return {
    id: "bm-" + String(job.id),
    title: job.title,
    company: job.company,
    url: job.applyUrl || "",
    addedAt: new Date().toLocaleDateString(),
    fromBookmark: true,
    stage: "saved",
  };
}

function appToCard(app) {
  return {
    id: app._id,
    title: app.title,
    company: app.company,
    url: app.url,
    addedAt: new Date(app.createdAt).toLocaleDateString(),
    fromBookmark: false,
    stage: app.stage,
  };
}

export default function Tracker() {
  const navigate = useNavigate();
  const { bookmarks } = useBookmarkContext();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeStage, setActiveStage] = useState("all");
  const [openStatusFor, setOpenStatusFor] = useState(null);

  const [adding, setAdding] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", company: "", url: "", stage: "applied" });

  const loadApplications = useCallback(async () => {
    try {
      const { applications } = await fetchApplications();
      setApplications(applications);
    } catch (err) {
      setError("Couldn't load your tracker. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const allCards = useMemo(() => {
    const tracked = applications.map(appToCard);
    const bm = bookmarks.map(bookmarkToCard);
    return [...bm, ...tracked];
  }, [applications, bookmarks]);

  const counts = useMemo(() => {
    const c = { all: allCards.length };
    STAGES.forEach((s) => { c[s.id] = allCards.filter((card) => card.stage === s.id).length; });
    return c;
  }, [allCards]);

  const visibleCards = activeStage === "all" ? allCards : allCards.filter((c) => c.stage === activeStage);

  async function addCard() {
    if (!newJob.title.trim()) return;
    try {
      const { application } = await addApplicationApi({
        title: newJob.title.trim(),
        company: newJob.company.trim(),
        url: newJob.url.trim(),
        stage: newJob.stage,
      });
      setApplications((prev) => [application, ...prev]);
    } catch (err) {
      setError(err.message || "Failed to add");
    }
    setNewJob({ title: "", company: "", url: "", stage: "applied" });
    setAdding(false);
  }

  async function removeCard(card) {
    if (card.fromBookmark) return;
    setApplications((prev) => prev.filter((a) => a._id !== card.id));
    try {
      await deleteApplicationApi(card.id);
    } catch (err) {
      setError(err.message || "Failed to remove");
      loadApplications();
    }
  }

  async function moveCard(card, targetStageId) {
    setOpenStatusFor(null);
    if (card.stage === targetStageId) return;

    if (card.fromBookmark) {
      try {
        const { application } = await addApplicationApi({
          title: card.title,
          company: card.company,
          url: card.url,
          stage: targetStageId,
        });
        setApplications((prev) => [application, ...prev]);
      } catch (err) {
        setError(err.message || "Failed to move");
      }
      return;
    }

    setApplications((prev) =>
      prev.map((a) => (a._id === card.id ? { ...a, stage: targetStageId } : a))
    );
    try {
      await updateApplicationApi(card.id, { stage: targetStageId });
    } catch (err) {
      setError(err.message || "Failed to move");
      loadApplications();
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--muted)", padding: "64px 24px", textAlign: "center", fontFamily: "Poppins" }}>
          Loading your tracker...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", padding: "32px 24px 64px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          <button onClick={() => navigate(-1)} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--muted)",
            background: "none", border: "none", cursor: "pointer", marginBottom: 24,
            letterSpacing: "0.08em",
          }}>
            <ArrowLeft size={14} /> Back
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 6 }}>
            <div>
              <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
                APPLICATION TRACKER
              </p>
              <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, margin: 0 }}>
                My Applications
              </h1>
            </div>
            <button onClick={() => setAdding((a) => !a)} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "10px 18px", background: "var(--accent)", color: "#09090B",
              border: "none", borderRadius: 10, cursor: "pointer",
              fontFamily: "Poppins", fontSize: 13, fontWeight: 700,
            }}>
              <Plus size={15} /> Add Application
            </button>
          </div>

          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 20, fontFamily: "JetBrains Mono" }}>
            {counts.all} total · Bookmarked jobs land in Saved automatically
          </p>

          {error && (
            <p style={{ color: "#fb7185", fontFamily: "Poppins", fontSize: 13, marginBottom: 16 }}>{error}</p>
          )}

          {adding && (
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 14, padding: 16, marginBottom: 20,
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }} className="add-grid">
                <input
                  autoFocus
                  value={newJob.title}
                  onChange={(e) => setNewJob((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Job title *"
                  onKeyDown={(e) => e.key === "Enter" && addCard()}
                  style={{
                    background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
                    padding: "9px 12px", color: "var(--text)", fontFamily: "Poppins", fontSize: 13, outline: "none",
                  }}
                />
                <input
                  value={newJob.company}
                  onChange={(e) => setNewJob((p) => ({ ...p, company: e.target.value }))}
                  placeholder="Company"
                  onKeyDown={(e) => e.key === "Enter" && addCard()}
                  style={{
                    background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
                    padding: "9px 12px", color: "var(--text)", fontFamily: "Poppins", fontSize: 13, outline: "none",
                  }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10, marginBottom: 12 }} className="add-grid">
                <input
                  value={newJob.url}
                  onChange={(e) => setNewJob((p) => ({ ...p, url: e.target.value }))}
                  placeholder="Apply URL (optional)"
                  onKeyDown={(e) => e.key === "Enter" && addCard()}
                  style={{
                    background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
                    padding: "9px 12px", color: "var(--text)", fontFamily: "Poppins", fontSize: 13, outline: "none",
                  }}
                />
                <select
                  value={newJob.stage}
                  onChange={(e) => setNewJob((p) => ({ ...p, stage: e.target.value }))}
                  style={{
                    background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
                    padding: "9px 12px", color: "var(--text)", fontFamily: "Poppins", fontSize: 13, outline: "none", cursor: "pointer",
                  }}
                >
                  {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={addCard} style={{
                  padding: "9px 20px", background: "var(--accent)", color: "#09090B",
                  border: "none", borderRadius: 8, cursor: "pointer",
                  fontFamily: "Poppins", fontSize: 12.5, fontWeight: 700,
                }}>
                  Add
                </button>
                <button onClick={() => setAdding(false)} style={{
                  padding: "9px 16px", background: "none", color: "var(--muted)",
                  border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer",
                  fontFamily: "Poppins", fontSize: 12.5,
                }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* FILTER TABS */}
          <div style={{
            display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap",
            borderBottom: "1px solid var(--border)", paddingBottom: 14,
          }}>
            {[{ id: "all", label: "All", color: "var(--accent)" }, ...STAGES].map((tab) => {
              const active = activeStage === tab.id;
              const count = counts[tab.id] || 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveStage(tab.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "7px 14px", borderRadius: 999,
                    border: `1px solid ${active ? tab.color : "var(--border)"}`,
                    background: active ? (tab.bg || "rgba(0,255,179,0.1)") : "var(--surface)",
                    color: active ? tab.color : "var(--muted)",
                    cursor: "pointer", fontFamily: "Poppins", fontSize: 12.5, fontWeight: 600,
                    transition: "all 0.15s",
                  }}
                >
                  {tab.label}
                  <span style={{
                    fontFamily: "JetBrains Mono", fontSize: 10,
                    padding: "1px 6px", borderRadius: 999,
                    background: active ? "rgba(0,0,0,0.2)" : "var(--bg)",
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* LIST */}
          {visibleCards.length === 0 ? (
            <div style={{
              background: "var(--surface)", border: "1px dashed var(--border)", borderRadius: 14,
              padding: "48px 24px", textAlign: "center",
            }}>
              <Briefcase size={26} style={{ color: "var(--muted)", marginBottom: 10 }} />
              <p style={{ fontFamily: "Poppins", fontSize: 13, color: "var(--muted)" }}>
                {activeStage === "saved"
                  ? "Bookmark jobs from search results and they'll appear here automatically."
                  : "No applications in this stage yet."}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {visibleCards.map((card) => {
                const meta = stageMeta(card.stage);
                const statusOpen = openStatusFor === card.id;
                return (
                  <div key={card.id} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: 12, padding: "14px 16px", flexWrap: "wrap",
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                      background: meta.bg, border: `1px solid ${meta.color}40`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: meta.color, fontFamily: "Poppins", fontWeight: 800, fontSize: 14,
                    }}>
                      {(card.company || card.title).charAt(0).toUpperCase()}
                    </div>

                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {card.fromBookmark && <Star size={11} style={{ color: meta.color, flexShrink: 0 }} fill={meta.color} />}
                        <p style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 13.5, color: "var(--text)" }}>
                          {card.title}
                        </p>
                      </div>
                      <p style={{ fontFamily: "Poppins", fontSize: 12, color: "var(--muted)" }}>
                        {card.company || "—"} {card.addedAt ? `· ${card.addedAt}` : ""}
                      </p>
                    </div>

                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <button
                        onClick={() => setOpenStatusFor(statusOpen ? null : card.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "6px 12px", borderRadius: 999,
                          background: meta.bg, border: `1px solid ${meta.color}40`,
                          color: meta.color, cursor: "pointer",
                          fontFamily: "Poppins", fontSize: 11.5, fontWeight: 700,
                        }}
                      >
                        {meta.label}
                        <ChevronDown size={12} style={{ transform: statusOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                      </button>

                      {statusOpen && (
                        <div style={{
                          position: "absolute", top: "calc(100% + 6px)", right: 0,
                          background: "var(--bg)", border: "1px solid var(--border)",
                          borderRadius: 10, minWidth: 140, overflow: "hidden",
                          boxShadow: "0 12px 32px rgba(0,0,0,0.5)", zIndex: 20,
                        }}>
                          {STAGES.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => moveCard(card, s.id)}
                              style={{
                                display: "flex", alignItems: "center", gap: 8,
                                width: "100%", padding: "9px 12px", background: "none", border: "none",
                                color: s.id === card.stage ? s.color : "var(--text)",
                                cursor: "pointer", fontFamily: "Poppins", fontSize: 12, fontWeight: 600,
                                textAlign: "left",
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface)"}
                              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                            >
                              <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, display: "inline-block" }} />
                              {s.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {card.url && (
                      <a href={card.url} target="_blank" rel="noreferrer" title="Open listing" style={{
                        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1px solid var(--border)", color: "var(--muted)", textDecoration: "none",
                      }}>
                        <ExternalLink size={13} />
                      </a>
                    )}

                    {!card.fromBookmark && (
                      <button
                        onClick={() => removeCard(card)}
                        title="Remove"
                        style={{
                          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: "1px solid var(--border)", background: "none",
                          color: "var(--muted)", cursor: "pointer", transition: "color 0.15s, border-color 0.15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#fb7185"; e.currentTarget.style.borderColor = "#fb7185"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <p style={{ fontFamily: "Poppins", fontSize: 11.5, color: "var(--muted)", marginTop: 20 }}>
            <Star size={10} style={{ color: "var(--accent)", verticalAlign: -1 }} fill="var(--accent)" /> marks jobs from your bookmarks — unbookmark from the job card to remove them here.
          </p>

        </div>
      </div>
      <Footer />
      <style>{`
        @media(max-width: 560px) {
          .add-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}