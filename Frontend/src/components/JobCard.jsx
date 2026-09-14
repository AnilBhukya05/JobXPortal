import { Link } from "react-router-dom";
import { Bookmark, Share2 } from "lucide-react";
import { useState } from "react";

import { statusFor } from "../data/jobs";
import { useBookmarkContext } from "../context/BookmarkContext";
import { useToast } from "../context/ToastContext";

const statusConfig = {
  NEW: {
    color: "#059669",
    border: "#A7F3D0",
    bg: "#ECFDF5",
  },

  LIVE: {
    color: "#059669",
    border: "#A7F3D0",
    bg: "#ECFDF5",
  },

  "CLOSING SOON": {
    color: "#E11D48",
    border: "#FECDD3",
    bg: "#FFF1F2",
  },
};

function CompanyLogo({ company }) {
  const [srcIndex, setSrcIndex] = useState(0);

  const initial =
    company?.charAt(0)?.toUpperCase() || "C";

  const cleanName = company
    ?.toLowerCase()
    .replace(
      /\s+(pvt|ltd|private|limited|inc|corp|llc|solutions|technologies|tech|software|systems|services|india|group)\.?\s*$/gi,
      ""
    )
    .trim()
    .replace(/[^a-z0-9]/g, "");

  const domain =
    cleanName + ".com";

  const sources = [
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  ];

  if (srcIndex >= sources.length) {
    return (
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          flexShrink: 0,
          background:
            "linear-gradient(135deg, #EEF2FF, #F5F3FF)",
          border:
            "1px solid #E4E7EC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Poppins",
          fontWeight: 800,
          fontSize: 17,
          color: "#4F46E5",
        }}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={sources[srcIndex]}
      alt={company}
      onError={() =>
        setSrcIndex((i) => i + 1)
      }
      style={{
        width: 42,
        height: 42,
        borderRadius: 10,
        flexShrink: 0,
        objectFit: "contain",
        background: "#FFFFFF",
        padding: 4,
        border: "1px solid #E4E7EC",
      }}
    />
  );
}

export default function JobCard({ job }) {
  const status = statusFor(
    job.postedDaysAgo
  );

  const sc =
    statusConfig[status] ||
    statusConfig.LIVE;

  const {
    toggle,
    isBookmarked,
  } = useBookmarkContext();

  const { toast } = useToast();

  const saved = isBookmarked(job.id);

  const [hovered, setHovered] =
    useState(false);

  function handleBookmark(e) {
    e.preventDefault();
    e.stopPropagation();

    toggle(job);

    toast(
      saved
        ? "Bookmark removed"
        : "Job saved!",
      saved ? "info" : "success"
    );
  }

  function handleShare(e) {
    e.preventDefault();
    e.stopPropagation();

    const link =
      job.applyUrl ||
      window.location.href;

    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast(
          "Apply link copied!",
          "info"
        );
      })
      .catch(() => {
        toast(
          "Unable to copy link",
          "error"
        );
      });
  }

  return (
    <div
      onMouseEnter={() =>
        setHovered(true)
      }
      onMouseLeave={() =>
        setHovered(false)
      }
      className="ticket-card"
      style={{
        background: "#FFFFFF",
        border: `1px solid ${
          hovered
            ? "#D0D5DD"
            : "#E4E7EC"
        }`,
        borderRadius: 18,
        padding: "20px 24px",
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        transform: hovered
          ? "translateY(-2px)"
          : "translateY(0)",
        boxShadow: hovered
          ? "0 18px 45px rgba(16,24,40,0.10)"
          : "0 4px 18px rgba(16,24,40,0.05)",
        position: "relative",
        color: "#101828",
      }}
    >
      {/* TOP */}

      <div
        style={{
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <CompanyLogo
          company={job.company}
        />

        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent:
                "space-between",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems:
                  "flex-start",
                gap: 9,
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize:
                    "clamp(14px, 2vw, 17px)",
                  fontWeight: 800,
                  color: "#101828",
                  lineHeight: 1.35,
                  fontFamily:
                    "Poppins",
                }}
              >
                {job.title}
              </h3>

              <span
                style={{
                  fontFamily:
                    "JetBrains Mono",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing:
                    "0.08em",
                  padding: "4px 9px",
                  borderRadius: 6,
                  flexShrink: 0,
                  marginTop: 1,
                  color: sc.color,
                  border: `1px solid ${sc.border}`,
                  background: sc.bg,
                }}
              >
                {status}
              </span>
            </div>

            {/* SHARE + BOOKMARK */}

            <div
              style={{
                display: "flex",
                gap: 4,
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                onClick={
                  handleShare
                }
                title="Copy link"
                className="cursor-pointer"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  color: hovered
                    ? "#475467"
                    : "#98A2B3",
                  background:
                    "transparent",
                  border: "none",
                  transition:
                    "color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color =
                    "#4F46E5";
                  e.currentTarget.style.background =
                    "#F5F3FF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    "#98A2B3";
                  e.currentTarget.style.background =
                    "transparent";
                }}
              >
                <Share2 size={15} />
              </button>

              <button
                type="button"
                onClick={
                  handleBookmark
                }
                title={
                  saved
                    ? "Remove"
                    : "Save"
                }
                className="cursor-pointer"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  color: saved
                    ? "#4F46E5"
                    : "#98A2B3",
                  background:
                    "transparent",
                  border: "none",
                  transition:
                    "color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!saved) {
                    e.currentTarget.style.color =
                      "#4F46E5";
                    e.currentTarget.style.background =
                      "#F5F3FF";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saved) {
                    e.currentTarget.style.color =
                      "#98A2B3";
                    e.currentTarget.style.background =
                      "transparent";
                  }
                }}
              >
                <Bookmark
                  size={15}
                  style={{
                    fill: saved
                      ? "#4F46E5"
                      : "none",
                  }}
                />
              </button>
            </div>
          </div>

          {/* COMPANY */}

          <p
            style={{
              color: "#667085",
              marginTop: 5,
              marginBottom: 0,
              fontFamily:
                "JetBrains Mono",
              fontSize: 11,
              lineHeight: 1.6,
            }}
          >
            {job.company} ·{" "}
            {job.location} ·{" "}
            {job.type}
          </p>
        </div>
      </div>

      {/* TAGS */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 7,
          marginBottom: 15,
        }}
      >
        {job.tags?.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily:
                "JetBrains Mono",
              fontSize: 10,
              padding: "4px 10px",
              borderRadius: 6,
              background: "#F8FAFC",
              border:
                "1px solid #E4E7EC",
              color: "#667085",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* DIVIDER */}

      <div className="perf-divider" />

      {/* BOTTOM */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: 12,
          paddingTop: 14,
        }}
      >
        {/* SALARY */}

        <span
          style={{
            fontFamily:
              "JetBrains Mono",
            fontSize: 13,
            fontWeight: 700,
            color: "#00A67D",
          }}
        >
          {job.salary}
        </span>

        {/* ACTIONS */}

        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          {/* VIEW */}

          <Link
            to={"/job/" + job.id}
            onClick={() => {
              try {
                sessionStorage.setItem(
                  "jobxportal_preview_" +
                    job.id,
                  JSON.stringify(job)
                );
              } catch {}
            }}
            className="cursor-pointer"
            style={{
              padding:
                "8px 16px",
              borderRadius: 9,
              border:
                "1px solid #E4E7EC",
              background: "#FFFFFF",
              color: "#344054",
              textDecoration:
                "none",
              fontFamily:
                "Poppins",
              fontSize: 12,
              fontWeight: 700,
              transition:
                "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                "#4F46E5";
              e.currentTarget.style.color =
                "#4F46E5";
              e.currentTarget.style.background =
                "#F8F7FF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                "#E4E7EC";
              e.currentTarget.style.color =
                "#344054";
              e.currentTarget.style.background =
                "#FFFFFF";
            }}
          >
            View
          </Link>

          {/* APPLY */}

          <a
            href={job.applyUrl}
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer"
            style={{
              padding:
                "8px 17px",
              borderRadius: 9,
              background:
                "#20C9B0",
              color: "#052E27",
              textDecoration:
                "none",
              fontFamily:
                "Poppins",
              fontSize: 12,
              fontWeight: 800,
              transition:
                "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "#00BFA5";
              e.currentTarget.style.transform =
                "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(0,200,150,0.20)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "#20C9B0";
              e.currentTarget.style.transform =
                "translateY(0)";
              e.currentTarget.style.boxShadow =
                "none";
            }}
          >
            Apply
          </a>
        </div>
      </div>

      <style>{`
        .ticket-card {
          overflow: hidden;
        }

        .ticket-card::before,
        .ticket-card::after {
          content: "";
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
        }

        .ticket-card::before {
          left: -9px;
        }

        .ticket-card::after {
          right: -9px;
        }

        .perf-divider {
          border-top: 1px dashed #E4E7EC;
        }

        @media (max-width: 640px) {
          .ticket-card {
            padding: 16px !important;
            border-radius: 15px !important;
          }

          .ticket-card > div:last-of-type {
            flex-direction: column;
            align-items: stretch !important;
          }

          .ticket-card > div:last-of-type > div {
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
}