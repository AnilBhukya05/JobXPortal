import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  X,
  ExternalLink,
  ChevronDown,
  Star,
  Briefcase,
} from "lucide-react";
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
  {
    id: "saved",
    label: "Saved",
    color: "#64748B",
    bg: "#F1F5F9",
  },
  {
    id: "applied",
    label: "Applied",
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    id: "interview",
    label: "Interview",
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    id: "offer",
    label: "Offer",
    color: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    id: "rejected",
    label: "Rejected",
    color: "#E11D48",
    bg: "#FFF1F2",
  },
];

function stageMeta(id) {
  return (
    STAGES.find((s) => s.id === id) ||
    STAGES[0]
  );
}

function bookmarkToCard(job) {
  return {
    id: "bm-" + String(job.id),
    title: job.title,
    company: job.company,
    url: job.applyUrl || "",
    addedAt:
      new Date().toLocaleDateString(),
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
    addedAt:
      new Date(
        app.createdAt
      ).toLocaleDateString(),
    fromBookmark: false,
    stage: app.stage,
  };
}

export default function Tracker() {
  const navigate = useNavigate();

  const { bookmarks } =
    useBookmarkContext();

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [activeStage, setActiveStage] =
    useState("all");

  const [openStatusFor, setOpenStatusFor] =
    useState(null);

  const [adding, setAdding] =
    useState(false);

  const [newJob, setNewJob] =
    useState({
      title: "",
      company: "",
      url: "",
      stage: "applied",
    });

  const loadApplications =
    useCallback(async () => {
      try {
        const { applications } =
          await fetchApplications();

        setApplications(
          applications
        );
      } catch (err) {
        setError(
          "Couldn't load your tracker. Is the backend running?"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const allCards = useMemo(() => {
    const tracked =
      applications.map(appToCard);

    const bm =
      bookmarks.map(bookmarkToCard);

    return [...bm, ...tracked];
  }, [
    applications,
    bookmarks,
  ]);

  const counts = useMemo(() => {
    const c = {
      all: allCards.length,
    };

    STAGES.forEach((s) => {
      c[s.id] =
        allCards.filter(
          (card) =>
            card.stage === s.id
        ).length;
    });

    return c;
  }, [allCards]);

  const visibleCards =
    activeStage === "all"
      ? allCards
      : allCards.filter(
          (c) =>
            c.stage === activeStage
        );

  async function addCard() {
    if (!newJob.title.trim())
      return;

    try {
      const { application } =
        await addApplicationApi({
          title:
            newJob.title.trim(),
          company:
            newJob.company.trim(),
          url:
            newJob.url.trim(),
          stage: newJob.stage,
        });

      setApplications((prev) => [
        application,
        ...prev,
      ]);
    } catch (err) {
      setError(
        err.message ||
          "Failed to add"
      );
    }

    setNewJob({
      title: "",
      company: "",
      url: "",
      stage: "applied",
    });

    setAdding(false);
  }

  async function removeCard(card) {
    if (card.fromBookmark)
      return;

    setApplications((prev) =>
      prev.filter(
        (a) => a._id !== card.id
      )
    );

    try {
      await deleteApplicationApi(
        card.id
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to remove"
      );

      loadApplications();
    }
  }

  async function moveCard(
    card,
    targetStageId
  ) {
    setOpenStatusFor(null);

    if (
      card.stage === targetStageId
    ) {
      return;
    }

    if (card.fromBookmark) {
      try {
        const { application } =
          await addApplicationApi({
            title: card.title,
            company: card.company,
            url: card.url,
            stage: targetStageId,
          });

        setApplications((prev) => [
          application,
          ...prev,
        ]);
      } catch (err) {
        setError(
          err.message ||
            "Failed to move"
        );
      }

      return;
    }

    setApplications((prev) =>
      prev.map((a) =>
        a._id === card.id
          ? {
              ...a,
              stage: targetStageId,
            }
          : a
      )
    );

    try {
      await updateApplicationApi(
        card.id,
        {
          stage: targetStageId,
        }
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to move"
      );

      loadApplications();
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <div
          style={{
            background:
              "#F8FAFF",
            minHeight: "100vh",
            color: "#64748B",
            padding:
              "64px 24px",
            textAlign: "center",
            fontFamily:
              "Poppins",
          }}
        >
          Loading your tracker...
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
          background:
            "#F8FAFF",
          minHeight: "100vh",
          color: "#0B132B",
          padding:
            "32px 24px 64px",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {/* BACK */}

          <button
            onClick={() =>
              navigate(-1)
            }
            style={{
              display:
                "inline-flex",
              alignItems:
                "center",
              gap: 8,

              fontFamily:
                "JetBrains Mono",
              fontSize: 12,

              color:
                "#64748B",

              background:
                "transparent",

              border: "none",

              cursor:
                "pointer",

              marginBottom: 24,

              letterSpacing:
                "0.08em",

              padding: 0,

              transition:
                "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color =
                "#4F46E5";

              e.currentTarget.style.transform =
                "translateX(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                "#64748B";

              e.currentTarget.style.transform =
                "translateX(0)";
            }}
          >
            <ArrowLeft size={14} />

            Back
          </button>

          {/* HEADER */}

          <div
            style={{
              display: "flex",
              alignItems:
                "flex-start",
              justifyContent:
                "space-between",
              flexWrap:
                "wrap",
              gap: 12,
              marginBottom: 6,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily:
                    "JetBrains Mono",
                  fontSize: 11,
                  letterSpacing:
                    "0.1em",
                  color:
                    "#64748B",
                  textTransform:
                    "uppercase",
                  marginBottom: 8,
                }}
              >
                APPLICATION TRACKER
              </p>

              <h1
                style={{
                  fontSize:
                    "clamp(1.6rem, 4vw, 2.4rem)",
                  fontWeight: 800,
                  margin: 0,
                  color:
                    "#0B132B",
                  letterSpacing:
                    "-0.035em",
                  lineHeight: 1.1,
                }}
              >
                My Applications
              </h1>
            </div>

            <button
              onClick={() =>
                setAdding(
                  (a) => !a
                )
              }
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: 7,

                padding:
                  "10px 18px",

                background:
                  "linear-gradient(135deg, #4F46E5, #7138E8)",

                color:
                  "#FFFFFF",

                border: "none",

                borderRadius: 10,

                cursor:
                  "pointer",

                fontFamily:
                  "Poppins",

                fontSize: 13,

                fontWeight: 700,

                boxShadow:
                  "0 6px 16px rgba(79,70,229,0.14)",

                transition:
                  "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-1px)";

                e.currentTarget.style.boxShadow =
                  "0 9px 22px rgba(79,70,229,0.20)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";

                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(79,70,229,0.14)";
              }}
            >
              <Plus size={15} />

              Add Application
            </button>
          </div>

          <p
            style={{
              color:
                "#64748B",
              fontSize: 13,
              marginBottom: 20,
              fontFamily:
                "JetBrains Mono",
            }}
          >
            {counts.all} total ·
            Bookmarked jobs land
            in Saved automatically
          </p>

          {/* ERROR */}

          {error && (
            <p
              style={{
                color:
                  "#E11D48",
                fontFamily:
                  "Poppins",
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {error}
            </p>
          )}

          {/* ADD APPLICATION */}

          {adding && (
            <div
              style={{
                background:
                  "#FFFFFF",

                border:
                  "1px solid #E2E8F0",

                borderRadius: 14,

                padding: 16,

                marginBottom: 20,

                boxShadow:
                  "0 6px 20px rgba(15,23,42,0.04)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: 10,
                  marginBottom: 10,
                }}
                className="add-grid"
              >
                <input
                  autoFocus
                  value={
                    newJob.title
                  }
                  onChange={(e) =>
                    setNewJob(
                      (p) => ({
                        ...p,
                        title:
                          e.target
                            .value,
                      })
                    )
                  }
                  placeholder="Job title *"
                  onKeyDown={(e) =>
                    e.key ===
                      "Enter" &&
                    addCard()
                  }
                  style={{
                    background:
                      "#FFFFFF",
                    border:
                      "1px solid #DDE3EE",
                    borderRadius: 8,
                    padding:
                      "9px 12px",
                    color:
                      "#0B132B",
                    fontFamily:
                      "Poppins",
                    fontSize: 13,
                    outline:
                      "none",
                    transition:
                      "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      "#A5B4FC";

                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(79,70,229,0.07)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      "#DDE3EE";

                    e.currentTarget.style.boxShadow =
                      "none";
                  }}
                />

                <input
                  value={
                    newJob.company
                  }
                  onChange={(e) =>
                    setNewJob(
                      (p) => ({
                        ...p,
                        company:
                          e.target
                            .value,
                      })
                    )
                  }
                  placeholder="Company"
                  onKeyDown={(e) =>
                    e.key ===
                      "Enter" &&
                    addCard()
                  }
                  style={{
                    background:
                      "#FFFFFF",
                    border:
                      "1px solid #DDE3EE",
                    borderRadius: 8,
                    padding:
                      "9px 12px",
                    color:
                      "#0B132B",
                    fontFamily:
                      "Poppins",
                    fontSize: 13,
                    outline:
                      "none",
                    transition:
                      "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      "#A5B4FC";

                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(79,70,229,0.07)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      "#DDE3EE";

                    e.currentTarget.style.boxShadow =
                      "none";
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "2fr 1fr",
                  gap: 10,
                  marginBottom: 12,
                }}
                className="add-grid"
              >
                <input
                  value={
                    newJob.url
                  }
                  onChange={(e) =>
                    setNewJob(
                      (p) => ({
                        ...p,
                        url:
                          e.target
                            .value,
                      })
                    )
                  }
                  placeholder="Apply URL (optional)"
                  onKeyDown={(e) =>
                    e.key ===
                      "Enter" &&
                    addCard()
                  }
                  style={{
                    background:
                      "#FFFFFF",
                    border:
                      "1px solid #DDE3EE",
                    borderRadius: 8,
                    padding:
                      "9px 12px",
                    color:
                      "#0B132B",
                    fontFamily:
                      "Poppins",
                    fontSize: 13,
                    outline:
                      "none",
                    transition:
                      "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      "#A5B4FC";

                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(79,70,229,0.07)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      "#DDE3EE";

                    e.currentTarget.style.boxShadow =
                      "none";
                  }}
                />

                <select
                  value={
                    newJob.stage
                  }
                  onChange={(e) =>
                    setNewJob(
                      (p) => ({
                        ...p,
                        stage:
                          e.target
                            .value,
                      })
                    )
                  }
                  style={{
                    background:
                      "#FFFFFF",
                    border:
                      "1px solid #DDE3EE",
                    borderRadius: 8,
                    padding:
                      "9px 12px",
                    color:
                      "#0B132B",
                    fontFamily:
                      "Poppins",
                    fontSize: 13,
                    outline:
                      "none",
                    cursor:
                      "pointer",
                  }}
                >
                  {STAGES.map(
                    (s) => (
                      <option
                        key={s.id}
                        value={s.id}
                      >
                        {s.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                }}
              >
                <button
                  onClick={addCard}
                  style={{
                    padding:
                      "9px 20px",

                    background:
                      "#4F46E5",

                    color:
                      "#FFFFFF",

                    border: "none",

                    borderRadius: 8,

                    cursor:
                      "pointer",

                    fontFamily:
                      "Poppins",

                    fontSize: 12.5,

                    fontWeight: 700,

                    transition:
                      "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "#4338CA";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "#4F46E5";
                  }}
                >
                  Add
                </button>

                <button
                  onClick={() =>
                    setAdding(
                      false
                    )
                  }
                  style={{
                    padding:
                      "9px 16px",

                    background:
                      "#FFFFFF",

                    color:
                      "#64748B",

                    border:
                      "1px solid #DDE3EE",

                    borderRadius: 8,

                    cursor:
                      "pointer",

                    fontFamily:
                      "Poppins",

                    fontSize: 12.5,

                    transition:
                      "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "#A5B4FC";

                    e.currentTarget.style.color =
                      "#4F46E5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "#DDE3EE";

                    e.currentTarget.style.color =
                      "#64748B";
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* FILTER TABS */}

          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 20,
              flexWrap:
                "wrap",

              borderBottom:
                "1px solid #E2E8F0",

              paddingBottom: 14,
            }}
          >
            {[
              {
                id: "all",
                label: "All",
                color:
                  "#4F46E5",
                bg:
                  "#EEF2FF",
              },
              ...STAGES,
            ].map((tab) => {
              const active =
                activeStage ===
                tab.id;

              const count =
                counts[
                  tab.id
                ] || 0;

              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveStage(
                      tab.id
                    )
                  }
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: 6,

                    padding:
                      "7px 14px",

                    borderRadius:
                      999,

                    border: `1px solid ${
                      active
                        ? tab.color
                        : "#E2E8F0"
                    }`,

                    background:
                      active
                        ? tab.bg ||
                          "#EEF2FF"
                        : "#FFFFFF",

                    color: active
                      ? tab.color
                      : "#64748B",

                    cursor:
                      "pointer",

                    fontFamily:
                      "Poppins",

                    fontSize:
                      12.5,

                    fontWeight: 600,

                    transition:
                      "all 0.2s ease",

                    boxShadow:
                      active
                        ? "0 3px 10px rgba(79,70,229,0.06)"
                        : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor =
                        "#C7D2FE";

                      e.currentTarget.style.color =
                        "#4F46E5";

                      e.currentTarget.style.transform =
                        "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor =
                        "#E2E8F0";

                      e.currentTarget.style.color =
                        "#64748B";

                      e.currentTarget.style.transform =
                        "translateY(0)";
                    }
                  }}
                >
                  {tab.label}

                  <span
                    style={{
                      fontFamily:
                        "JetBrains Mono",

                      fontSize: 10,

                      padding:
                        "1px 6px",

                      borderRadius:
                        999,

                      background:
                        active
                          ? "rgba(79,70,229,0.10)"
                          : "#F1F5F9",

                      color:
                        active
                          ? tab.color
                          : "#94A3B8",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* LIST */}

          {visibleCards.length ===
          0 ? (
            <div
              style={{
                background:
                  "#FFFFFF",

                border:
                  "1px dashed #DDE3EE",

                borderRadius: 14,

                padding:
                  "48px 24px",

                textAlign:
                  "center",

                boxShadow:
                  "0 4px 16px rgba(15,23,42,0.025)",
              }}
            >
              <Briefcase
                size={26}
                style={{
                  color:
                    "#94A3B8",
                  marginBottom: 10,
                }}
              />

              <p
                style={{
                  fontFamily:
                    "Poppins",

                  fontSize: 13,

                  color:
                    "#64748B",

                  margin: 0,
                }}
              >
                {activeStage ===
                "saved"
                  ? "Bookmark jobs from search results and they'll appear here automatically."
                  : "No applications in this stage yet."}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: 8,
              }}
            >
              {visibleCards.map(
                (card) => {
                  const meta =
                    stageMeta(
                      card.stage
                    );

                  const statusOpen =
                    openStatusFor ===
                    card.id;

                  return (
                    <div
                      key={card.id}
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap: 14,

                        background:
                          "#FFFFFF",

                        border:
                          "1px solid #E2E8F0",

                        borderRadius: 12,

                        padding:
                          "14px 16px",

                        flexWrap:
                          "wrap",

                        boxShadow:
                          "0 3px 12px rgba(15,23,42,0.025)",

                        transition:
                          "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "#D0D5DD";

                        e.currentTarget.style.boxShadow =
                          "0 8px 24px rgba(15,23,42,0.06)";

                        e.currentTarget.style.transform =
                          "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "#E2E8F0";

                        e.currentTarget.style.boxShadow =
                          "0 3px 12px rgba(15,23,42,0.025)";

                        e.currentTarget.style.transform =
                          "translateY(0)";
                      }}
                    >
                      {/* ICON */}

                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 9,

                          flexShrink: 0,

                          background:
                            meta.bg,

                          border: `1px solid ${meta.color}30`,

                          display: "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          color:
                            meta.color,

                          fontFamily:
                            "Poppins",

                          fontWeight: 800,

                          fontSize: 14,
                        }}
                      >
                        {(
                          card.company ||
                          card.title
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      {/* JOB INFO */}

                      <div
                        style={{
                          flex: 1,
                          minWidth: 160,
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            gap: 6,
                          }}
                        >
                          {card.fromBookmark && (
                            <Star
                              size={11}
                              style={{
                                color:
                                  meta.color,
                                flexShrink: 0,
                              }}
                              fill={
                                meta.color
                              }
                            />
                          )}

                          <p
                            style={{
                              fontFamily:
                                "Poppins",

                              fontWeight:
                                700,

                              fontSize:
                                13.5,

                              color:
                                "#101828",

                              margin: 0,

                              lineHeight:
                                1.4,
                            }}
                          >
                            {
                              card.title
                            }
                          </p>
                        </div>

                        <p
                          style={{
                            fontFamily:
                              "Poppins",

                            fontSize: 12,

                            color:
                              "#667085",

                            margin:
                              "3px 0 0",
                          }}
                        >
                          {card.company ||
                            "—"}{" "}
                          {card.addedAt
                            ? `· ${card.addedAt}`
                            : ""}
                        </p>
                      </div>

                      {/* STATUS */}

                      <div
                        style={{
                          position:
                            "relative",
                          flexShrink: 0,
                        }}
                      >
                        <button
                          onClick={() =>
                            setOpenStatusFor(
                              statusOpen
                                ? null
                                : card.id
                            )
                          }
                          style={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            gap: 6,

                            padding:
                              "6px 12px",

                            borderRadius:
                              999,

                            background:
                              meta.bg,

                            border: `1px solid ${meta.color}35`,

                            color:
                              meta.color,

                            cursor:
                              "pointer",

                            fontFamily:
                              "Poppins",

                            fontSize:
                              11.5,

                            fontWeight:
                              700,

                            transition:
                              "all 0.2s ease",
                          }}
                        >
                          {meta.label}

                          <ChevronDown
                            size={12}
                            style={{
                              transform:
                                statusOpen
                                  ? "rotate(180deg)"
                                  : "none",

                              transition:
                                "transform 0.15s",
                            }}
                          />
                        </button>

                        {statusOpen && (
                          <div
                            style={{
                              position:
                                "absolute",

                              top:
                                "calc(100% + 6px)",

                              right: 0,

                              background:
                                "#FFFFFF",

                              border:
                                "1px solid #E2E8F0",

                              borderRadius:
                                10,

                              minWidth:
                                140,

                              overflow:
                                "hidden",

                              boxShadow:
                                "0 12px 30px rgba(15,23,42,0.12)",

                              zIndex: 20,

                              padding:
                                4,
                            }}
                          >
                            {STAGES.map(
                              (s) => (
                                <button
                                  key={
                                    s.id
                                  }
                                  onClick={() =>
                                    moveCard(
                                      card,
                                      s.id
                                    )
                                  }
                                  style={{
                                    display:
                                      "flex",

                                    alignItems:
                                      "center",

                                    gap: 8,

                                    width:
                                      "100%",

                                    padding:
                                      "9px 12px",

                                    background:
                                      s.id ===
                                      card.stage
                                        ? s.bg
                                        : "transparent",

                                    border:
                                      "none",

                                    borderRadius:
                                      7,

                                    color:
                                      s.id ===
                                      card.stage
                                        ? s.color
                                        : "#344054",

                                    cursor:
                                      "pointer",

                                    fontFamily:
                                      "Poppins",

                                    fontSize:
                                      12,

                                    fontWeight:
                                      600,

                                    textAlign:
                                      "left",

                                    transition:
                                      "all 0.15s ease",
                                  }}
                                  onMouseEnter={(
                                    e
                                  ) => {
                                    e.currentTarget.style.background =
                                      s.bg;

                                    e.currentTarget.style.color =
                                      s.color;
                                  }}
                                  onMouseLeave={(
                                    e
                                  ) => {
                                    e.currentTarget.style.background =
                                      s.id ===
                                      card.stage
                                        ? s.bg
                                        : "transparent";

                                    e.currentTarget.style.color =
                                      s.id ===
                                      card.stage
                                        ? s.color
                                        : "#344054";
                                  }}
                                >
                                  <span
                                    style={{
                                      width: 7,
                                      height: 7,
                                      borderRadius:
                                        "50%",
                                      background:
                                        s.color,
                                      display:
                                        "inline-block",
                                      flexShrink: 0,
                                    }}
                                  />

                                  {
                                    s.label
                                  }
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>

                      {/* OPEN LISTING */}

                      {card.url && (
                        <a
                          href={
                            card.url
                          }
                          target="_blank"
                          rel="noreferrer"
                          title="Open listing"
                          style={{
                            width: 30,
                            height: 30,

                            borderRadius: 8,

                            flexShrink: 0,

                            display:
                              "flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "center",

                            border:
                              "1px solid #E2E8F0",

                            color:
                              "#64748B",

                            background:
                              "#FFFFFF",

                            textDecoration:
                              "none",

                            transition:
                              "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color =
                              "#4F46E5";

                            e.currentTarget.style.borderColor =
                              "#C7D2FE";

                            e.currentTarget.style.background =
                              "#F8FAFF";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color =
                              "#64748B";

                            e.currentTarget.style.borderColor =
                              "#E2E8F0";

                            e.currentTarget.style.background =
                              "#FFFFFF";
                          }}
                        >
                          <ExternalLink
                            size={13}
                          />
                        </a>
                      )}

                      {/* REMOVE */}

                      {!card.fromBookmark && (
                        <button
                          onClick={() =>
                            removeCard(
                              card
                            )
                          }
                          title="Remove"
                          style={{
                            width: 30,
                            height: 30,

                            borderRadius: 8,

                            flexShrink: 0,

                            display:
                              "flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "center",

                            border:
                              "1px solid #E2E8F0",

                            background:
                              "#FFFFFF",

                            color:
                              "#64748B",

                            cursor:
                              "pointer",

                            transition:
                              "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color =
                              "#E11D48";

                            e.currentTarget.style.borderColor =
                              "#FDA4AF";

                            e.currentTarget.style.background =
                              "#FFF1F2";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color =
                              "#64748B";

                            e.currentTarget.style.borderColor =
                              "#E2E8F0";

                            e.currentTarget.style.background =
                              "#FFFFFF";
                          }}
                        >
                          <X
                            size={13}
                          />
                        </button>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* FOOTNOTE */}

          <p
            style={{
              fontFamily:
                "Poppins",

              fontSize: 11.5,

              color:
                "#64748B",

              marginTop: 20,
            }}
          >
            <Star
              size={10}
              style={{
                color:
                  "#D97706",
                verticalAlign:
                  -1,
              }}
              fill="#D97706"
            />{" "}
            marks jobs from your
            bookmarks —
            unbookmark from the
            job card to remove them
            here.
          </p>
        </div>
      </div>

      <Footer />

      <style>
        {`
          @media (max-width: 560px) {
            .add-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 640px) {
            .tracker-page-card {
              align-items: flex-start !important;
            }
          }
        `}
      </style>
    </>
  );
}