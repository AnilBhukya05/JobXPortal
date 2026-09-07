import { Link } from "react-router-dom";
import { Code2, Link2, Mail } from "lucide-react";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { name: "Jobs", path: "/jobs" },
      { name: "Companies", path: "/companies" },
      { name: "Remote", path: "/remote" },
    ],
  },
  {
    title: "For Employers",
    links: [
      { name: "Post a Job", path: "/post-job" },
      { name: "Employer Dashboard", path: "/employer/dashboard" },
    ],
  },
  {
    title: "Tools",
    links: [
      { name: "Resume Builder", path: "/resume-builder" },
      { name: "Resume Match", path: "/resume-match" },
      { name: "Interview Prep", path: "/interview-prep" },
      { name: "Cover Letter", path: "/cover-letter" },
      { name: "Job Tracker", path: "/tracker" },
      { name: "Salary Insights", path: "/salary-insights" },
      { name: "Bookmarks", path: "/bookmarks" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "FAQs", path: "/faqs" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Privacy Policy", path: "/privacy" },
    ],
  },
];

const stats = [
  { value: "29K+", label: "Live Jobs" },
  { value: "12", label: "Categories" },
  { value: "Free", label: "Always" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>

      {/* TOP BAND */}
      <div style={{
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        padding: "24px 0",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontFamily: "Poppins", fontSize: 14, fontWeight: 600, color: "var(--text)", margin: 0 }}>
              Real jobs. Search across every major portal in one place.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/jobs" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "9px 20px", background: "var(--accent)", color: "#09090B",
                borderRadius: 8, textDecoration: "none",
                fontFamily: "Poppins", fontSize: 13, fontWeight: 700,
                flexShrink: 0,
              }}>
                Find Jobs Now
              </Link>
              <Link to="/post-job" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "9px 20px", background: "none", color: "var(--text)",
                border: "1px solid var(--border)",
                borderRadius: 8, textDecoration: "none",
                fontFamily: "Poppins", fontSize: 13, fontWeight: 700,
                flexShrink: 0, transition: "border-color 0.15s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
              >
                Post a Job — Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 32 }} className="footer-grid">

          {/* BRAND */}
          <div>
            <div style={{
              fontFamily: "Poppins", fontWeight: 800, fontSize: "1.3rem",
              letterSpacing: "-0.03em", marginBottom: 12,
            }}>
              <span style={{ color: "var(--text)" }}>JOB</span>
              <span style={{ color: "var(--accent)" }}>XPORTAL</span>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.75, maxWidth: 280, marginBottom: 20 }}>
              One board, every opening. We aggregate live job listings from
              LinkedIn, Naukri, Glassdoor, Indeed, Wellfound and company career
              pages — updated on every search. Employers can post directly, free.
            </p>

            {/* STATS */}
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {stats.map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)" }}>
                    {s.value}
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LINK COLUMNS */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <p style={{
                fontFamily: "JetBrains Mono", fontSize: 11,
                fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "var(--text)",
                marginBottom: 16,
              }}>
                {col.title}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((link) => (
                  <Link key={link.name} to={link.path} style={{
                    fontFamily: "Poppins", fontSize: 13,
                    color: "var(--muted)", textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM BAR */}
        <div style={{
          borderTop: "1px solid var(--border)",
          marginTop: 40, paddingTop: 24,
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "var(--muted)", letterSpacing: "0.04em" }}>
            (c) 2026 JobXPortal.
          </p>

          {/* SOCIAL LINKS */}
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { icon: Code2, href: "https://github.com/AnilBhukya05", label: "GitHub" },
              { icon: Link2, href: "https://www.linkedin.com/in/anilbhukya05/", label: "LinkedIn" },
              { icon: Mail, href: "mailto:hello.jobxportal@gmail.com", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} style={{
                width: 32, height: 32, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid var(--border)", color: "var(--muted)",
                textDecoration: "none", transition: "color 0.15s, border-color 0.15s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>

          <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "var(--muted)", letterSpacing: "0.04em" }}>
            Built for job seekers and employers alike.
          </p>
        </div>
      </div>

      <style>{`
        @media(max-width: 1024px) {
          .footer-grid { grid-template-columns: 1.4fr 1fr 1fr !important; }
        }
        @media(max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media(max-width: 420px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}