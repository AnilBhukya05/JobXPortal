import { Link } from "react-router-dom";
import {
  Code2,
  Link2,
  Mail,
  ArrowUpRight,
  BriefcaseBusiness,
} from "lucide-react";

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
    <footer
      style={{
        background: "#FFFFFF",
        borderTop: "1px solid #E2E6F0",
        color: "#0B132B",
      }}
    >

      {/* TOP CTA BAND */}

      <div
        style={{
          background: "#F8FAFF",
          borderBottom: "1px solid #E2E6F0",
          padding: "24px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <div
            className="footer-top-band"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "rgba(79,70,229,0.08)",
                  border: "1px solid rgba(79,70,229,0.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <BriefcaseBusiness size={18} color="#4F46E5" />
              </div>

              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0B132B",
                  margin: 0,
                }}
              >
                Real jobs. Search across every major portal in one place.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/jobs"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  background: "#4F46E5",
                  color: "#FFFFFF",
                  borderRadius: 9,
                  textDecoration: "none",
                  fontFamily: "Poppins",
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                  boxShadow: "0 6px 16px rgba(79,70,229,0.18)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#4338CA";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 22px rgba(79,70,229,0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#4F46E5";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(79,70,229,0.18)";
                }}
              >
                Find Jobs Now
                <ArrowUpRight size={15} />
              </Link>

              <Link
                to="/post-job"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  background: "#FFFFFF",
                  color: "#0B132B",
                  border: "1px solid #D9DEEA",
                  borderRadius: 9,
                  textDecoration: "none",
                  fontFamily: "Poppins",
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#4F46E5";
                  e.currentTarget.style.color = "#4F46E5";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.background = "#F8FAFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#D9DEEA";
                  e.currentTarget.style.color = "#0B132B";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.background = "#FFFFFF";
                }}
              >
                Post a Job — Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MY SERVICES */}

      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E2E6F0",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "42px 24px",
          }}
        >
          <div
            className="my-services-band"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 30,
            }}
          >
            {/* LEFT SIDE */}
            <div>
              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#4F46E5",
                  margin: "0 0 8px",
                }}
              >
                My Services
              </p>

              <h2
                style={{
                  fontFamily: "Poppins",
                  fontSize: "1.45rem",
                  fontWeight: 700,
                  color: "#0B132B",
                  margin: "0 0 9px",
                  letterSpacing: "-0.02em",
                }}
              >
                Custom Digital Solutions for Your Ideas
              </h2>

              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: 13,
                  lineHeight: 1.8,
                  color: "#64748B",
                  maxWidth: 620,
                  margin: 0,
                }}
              >
                I design and develop modern websites, web applications, and
                digital solutions to help businesses and individuals grow
                online.
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div
              style={{
                flexShrink: 0,
                marginRight: 70,
              }}
            >
              <a
                href="/services"
                target="_blank"
                rel="noopener noreferrer"
                className="services-link"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  fontFamily: "Poppins",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#4F46E5",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  padding: "11px 17px",
                  border: "1px solid rgba(79,70,229,0.20)",
                  borderRadius: 10,
                  background: "#F8FAFF",
                  boxShadow: "0 4px 12px rgba(79,70,229,0.08)",
                  transition:
                    "color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease",
                  cursor: "pointer",
                  zIndex: 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#FFFFFF";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(79,70,229,0.20)";

                  const fill = e.currentTarget.querySelector(".services-fill");
                  if (fill) {
                    fill.style.transform = "scaleX(1)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#4F46E5";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(79,70,229,0.08)";

                  const fill = e.currentTarget.querySelector(".services-fill");
                  if (fill) {
                    fill.style.transform = "scaleX(0)";
                  }
                }}
              >
                {/* Blue fill animation */}
                <span
                  className="services-fill"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#4F46E5",
                    transform: "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 0.35s ease",
                    zIndex: -1,
                  }}
                />

                <span style={{ position: "relative", zIndex: 2 }}>
                  Explore My Services
                </span>

                <ArrowUpRight
                  size={17}
                  style={{
                    position: "relative",
                    zIndex: 2,
                  }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "52px 24px 32px",
        }}
      >
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            gap: 34,
          }}
        >

          {/* BRAND */}

          <div>
            <Link
              to="/"
              style={{
                display: "inline-block",
                fontFamily: "Poppins",
                fontWeight: 800,
                fontSize: "1.35rem",
                letterSpacing: "-0.04em",
                marginBottom: 13,
                textDecoration: "none",
              }}
            >
              <span style={{ color: "#0B132B" }}>JOB</span>
              <span style={{ color: "#4F46E5" }}>XPORTAL</span>
            </Link>

            <p
              style={{
                color: "#64748B",
                fontSize: 13,
                lineHeight: 1.8,
                maxWidth: 300,
                marginBottom: 22,
              }}
            >
              One board, every opening. We aggregate live job listings from
              LinkedIn, Naukri, Glassdoor, Indeed, Wellfound and company career
              pages — updated on every search. Employers can post directly,
              free.
            </p>

            {/* STATS */}
            <div
              style={{
                display: "flex",
                gap: 22,
                flexWrap: "wrap",
              }}
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "#4F46E5",
                    }}
                  >
                    {s.value}
                  </div>

                  <div
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 10,
                      color: "#94A3B8",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginTop: 3,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LINK COLUMNS */}

          {footerLinks.map((col) => (
            <div key={col.title}>
              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#0B132B",
                  marginBottom: 17,
                }}
              >
                {col.title}
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 11,
                }}
              >
                {col.links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 13,
                      color: "#64748B",
                      textDecoration: "none",
                      transition: "all 0.18s ease",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#4F46E5";
                      e.currentTarget.style.transform = "translateX(3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#64748B";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM BAR */}

        <div
          className="footer-bottom"
          style={{
            borderTop: "1px solid #E2E6F0",
            marginTop: 44,
            paddingTop: 24,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <p
            style={{
              fontFamily: "Poppins",
              fontSize: 11,
              color: "#94A3B8",
              letterSpacing: "0.04em",
              margin: 0,
            }}
          >
            © 2026 JobXPortal.
          </p>

          {/* SOCIAL LINKS */}
          <div
            style={{
              display: "flex",
              gap: 9,
            }}
          >
            {[
              {
                icon: Code2,
                href: "https://github.com/AnilBhukya05",
                label: "GitHub",
              },
              {
                icon: Link2,
                href: "https://www.linkedin.com/in/anilbhukya05/",
                label: "LinkedIn",
              },
              {
                icon: Mail,
                href: "mailto:hello.jobxportal@gmail.com",
                label: "Email",
              },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #E2E6F0",
                  color: "#64748B",
                  background: "#FFFFFF",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#4F46E5";
                  e.currentTarget.style.borderColor = "#4F46E5";
                  e.currentTarget.style.background = "#F8FAFF";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 15px rgba(79,70,229,0.10)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#64748B";
                  e.currentTarget.style.borderColor = "#E2E6F0";
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>

          <p
            style={{
              fontFamily: "Poppins",
              fontSize: 11,
              color: "#94A3B8",
              letterSpacing: "0.04em",
              margin: 0,
            }}
          >
            Built for job seekers and employers alike.
          </p>
        </div>
      </div>

      {/* RESPONSIVE CSS */}

      <style>{`
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1.4fr 1fr 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .footer-top-band {
            align-items: flex-start !important;
            flex-direction: column !important;
          }

          .footer-top-band > div:last-child {
            width: 100%;
          }

          .footer-top-band a {
            flex: 1;
            justify-content: center;
          }

          .my-services-band {
            align-items: flex-start !important;
            flex-direction: column !important;
          }

          .my-services-band > div:last-child {
            width: 100%;
          }

          .services-link {
            justify-content: flex-start;
          }

          .footer-bottom {
            flex-direction: column !important;
            text-align: center;
          }
        }

        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 38px 24px !important;
          }
        }

        @media (max-width: 420px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }

          .footer-top-band a {
            width: 100%;
            flex: none;
          }
        }
      `}</style>
    </footer>
  );
}
