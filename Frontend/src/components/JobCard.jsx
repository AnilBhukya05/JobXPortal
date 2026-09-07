import { Link } from "react-router-dom";
import { Bookmark, Share2 } from "lucide-react";
import { useState } from "react";
import { statusFor } from "../data/jobs";
import { useBookmarkContext } from "../context/BookmarkContext";
import { useToast } from "../context/ToastContext";

const statusConfig = {
  NEW: { color: "var(--teal)", border: "rgba(45,212,191,0.3)", bg: "rgba(45,212,191,0.08)" },
  LIVE: { color: "var(--accent)", border: "rgba(0,255,179,0.3)", bg: "rgba(0,255,179,0.08)" },
  "CLOSING SOON": { color: "#fb7185", border: "rgba(251,113,133,0.3)", bg: "rgba(251,113,133,0.08)" },
};

function CompanyLogo({ company }) {
  const [srcIndex, setSrcIndex] = useState(0);
  const initial = company.charAt(0).toUpperCase();

  const cleanName = company
    .toLowerCase()
    .replace(/\s+(pvt|ltd|private|limited|inc|corp|llc|solutions|technologies|tech|software|systems|services|india|group)\.?\s*$/gi, "")
    .trim()
    .replace(/[^a-z0-9]/g, "");

  const domain = cleanName + ".com";

  const sources = [
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  ];

  if (srcIndex >= sources.length) {
    return (
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: "linear-gradient(135deg, var(--accent)22, var(--teal)22)",
        border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Poppins", fontWeight: 800, fontSize: 15,
        color: "var(--accent)",
      }}>
        {initial}
      </div>
    );
  }

  return (
    <img
      src={sources[srcIndex]}
      alt={company}
      onError={() => setSrcIndex((i) => i + 1)}
      style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        objectFit: "contain",
        background: "#fff", padding: 3,
        border: "1px solid var(--border)",
      }}
    />
  );
}

export default function JobCard({ job }) {
  const status = statusFor(job.postedDaysAgo);
  const sc = statusConfig[status] || statusConfig.LIVE;
  const { toggle, isBookmarked } = useBookmarkContext();
  const { toast } = useToast();
  const saved = isBookmarked(job.id);
  const [hovered, setHovered] = useState(false);

  function handleBookmark(e) {
    e.preventDefault();
    toggle(job);
    toast(saved ? "Bookmark removed" : "Job saved!", saved ? "info" : "success");
  }

  function handleShare(e) {
    e.preventDefault();
    navigator.clipboard.writeText(job.applyUrl || window.location.href).then(() => {
      toast("Apply link copied!", "info");
    });
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="ticket-card"
      style={{
        background: hovered ? "var(--card-hover)" : "var(--surface)",
        border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
        borderRadius: 16, padding: "18px 20px",
        transition: "background 0.2s, border-color 0.2s",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
        <CompanyLogo company={job.company} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flex: 1, flexWrap: "wrap" }}>
              <h3 style={{
                fontSize: "clamp(13px, 2vw, 16px)", fontWeight: 700,
                color: "var(--text)", lineHeight: 1.3, fontFamily: "Poppins",
              }}>
                {job.title}
              </h3>
              <span style={{
                fontFamily: "JetBrains Mono", fontSize: 10,
                letterSpacing: "0.08em", padding: "3px 8px",
                borderRadius: 5, flexShrink: 0, marginTop: 2,
                color: sc.color, border: `1px solid ${sc.border}`, background: sc.bg,
              }}>
                {status}
              </span>
            </div>

            <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
              <button onClick={handleShare} title="Copy link" style={{
                width: 28, height: 28, borderRadius: 7,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--muted)", background: "none", border: "none", cursor: "pointer",
                transition: "color 0.15s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
              >
                <Share2 size={13} />
              </button>
              <button onClick={handleBookmark} title={saved ? "Remove" : "Save"} style={{
                width: 28, height: 28, borderRadius: 7,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: saved ? "var(--accent)" : "var(--muted)",
                background: "none", border: "none", cursor: "pointer",
                transition: "color 0.15s",
              }}>
                <Bookmark size={13} style={{ fill: saved ? "var(--accent)" : "none" }} />
              </button>
            </div>
          </div>

          <p style={{
            color: "var(--muted)", marginTop: 4,
            fontFamily: "JetBrains Mono", fontSize: 11,
          }}>
            {job.company} · {job.location} · {job.type}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {job.tags.map((tag) => (
          <span key={tag} style={{
            fontFamily: "JetBrains Mono", fontSize: 11,
            padding: "3px 10px", borderRadius: 5,
            background: "var(--surface2)", border: "1px solid var(--border)",
            color: "var(--muted)",
          }}>
            {tag}
          </span>
        ))}
      </div>

      <div className="perf-divider" />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingTop: 12 }}>
        <span style={{
          fontFamily: "JetBrains Mono", fontSize: 13, fontWeight: 600,
          color: "var(--accent)",
        }}>
          {job.salary}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <Link
            to={"/job/" + job.id}
            onClick={() => {
              try {
                sessionStorage.setItem("jobxportal_preview_" + job.id, JSON.stringify(job));
              } catch {}
            }}
            style={{
              padding: "7px 14px", borderRadius: 8,
              border: "1px solid var(--border)",
              color: "var(--text)", textDecoration: "none",
              fontFamily: "Poppins", fontSize: 12, fontWeight: 600,
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--teal)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
          >
            View
          </Link>
          <a href={job.applyUrl} target="_blank" rel="noreferrer" style={{
            padding: "7px 14px", borderRadius: 8,
            background: "var(--teal)", color: "#09090B",
            textDecoration: "none",
            fontFamily: "Poppins", fontSize: 12, fontWeight: 700,
            transition: "opacity 0.2s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            Apply
          </a>
        </div>
      </div>

      <style>{`
        .ticket-card { overflow: hidden; }
        .ticket-card::before, .ticket-card::after {
          content: "";
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--bg);
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
        }
        .ticket-card::before { left: -8px; }
        .ticket-card::after { right: -8px; }
        .perf-divider {
          border-top: 1px dashed var(--border);
        }
      `}</style>
    </div>
  );
}