import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bookmark, Briefcase, LayoutDashboard, ChevronDown, Plus } from "lucide-react";
import { useBookmarkContext } from "../context/BookmarkContext";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Jobs", path: "/jobs" },
  { name: "Companies", path: "/companies" },
  { name: "Remote", path: "/remote" },
  { name: "Tracker", path: "/tracker", seekerOnly: true },
  { name: "Salary", path: "/salary-insights", seekerOnly: true },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const mobileToolLinks = [
  { name: "Resume Builder", path: "/resume-builder" },
  { name: "Resume Match", path: "/resume-match" },
  { name: "Interview Prep", path: "/interview-prep" },
  { name: "Cover Letter", path: "/cover-letter" },
  { name: "My Profile", path: "/profile" },
  { name: "Bookmarks", path: "/bookmarks" },
];

const employerLinks = [
  { name: "Post a Job", path: "/post-job", icon: Plus },
  { name: "Dashboard", path: "/employer/dashboard", icon: LayoutDashboard },
];

function isItemActive(pathname, itemPath) {
  if (itemPath === "/") return pathname === "/";
  return pathname.startsWith(itemPath);
}

function NavLink({ item, isActive, inactiveColor, hoverColor, activeColor }) {
  const [hovered, setHovered] = useState(false);
  const color = isActive ? activeColor : hovered ? hoverColor : inactiveColor;
  const weight = isActive || hovered ? 700 : 500;

  return (
    <Link
      to={item.path}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        padding: "0 11px",
        height: 64,
        fontFamily: "Poppins, sans-serif",
        fontSize: "11.5px",
        fontWeight: weight,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        textDecoration: "none",
        color: color,
        transition: "color 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {item.name}
    </Link>
  );
}

function EmployerMenu({ pathname }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isActiveGroup = employerLinks.some((l) => isItemActive(pathname, l.path));

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="hidden md:block" style={{ position: "relative", marginRight: 4 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 12px",
          background: isActiveGroup ? "rgba(0,255,179,0.08)" : "none",
          border: `1px solid ${isActiveGroup ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 8, color: isActiveGroup ? "var(--accent)" : "var(--muted)",
          fontFamily: "Poppins", fontSize: 12, fontWeight: 600,
          cursor: "pointer", transition: "all 0.15s",
        }}
      >
        <Briefcase size={13} /> Employer <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 10, minWidth: 170, overflow: "hidden",
          boxShadow: "0 12px 32px rgba(0,0,0,0.4)", zIndex: 110,
        }}>
          {employerLinks.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(pathname, item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 14px",
                  color: active ? "var(--accent)" : "var(--text)",
                  background: active ? "rgba(0,255,179,0.06)" : "transparent",
                  textDecoration: "none",
                  fontFamily: "Poppins", fontSize: 12.5, fontWeight: 600,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg)"}
                onMouseLeave={(e) => e.currentTarget.style.background = active ? "rgba(0,255,179,0.06)" : "transparent"}
              >
                <Icon size={14} style={{ color: "var(--accent)" }} /> {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { bookmarks } = useBookmarkContext();
  const { user, logout } = useAuth();
  const isEmployer = user?.role === "employer";

  const inactiveColor = "#71717A";
  const hoverColor = "#fff";
  const activeColor = "var(--accent)";

  const visibleNavItems = navItems.filter((item) => !(isEmployer && item.seekerOnly));

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        background: "rgba(9,9,11,0.92)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          padding: "0 20px", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12,
        }}>

          <Link to="/" onClick={() => setOpen(false)} style={{
            fontFamily: "Poppins, sans-serif", fontWeight: 800,
            fontSize: "1.2rem", letterSpacing: "-0.03em",
            textDecoration: "none", flexShrink: 0,
          }}>
            <span style={{ color: "var(--text)" }}>JOB</span>
            <span style={{ color: "#FFB020" }}>XPORTAL</span>
          </Link>

          <nav className="hidden md:flex" style={{ alignItems: "stretch", height: 64, flexShrink: 1, minWidth: 0 }}>
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.name}
                item={item}
                isActive={isItemActive(pathname, item.path)}
                inactiveColor={inactiveColor}
                hoverColor={hoverColor}
                activeColor={activeColor}
              />
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>

            {user && (
              <Link to="/profile" style={{
                width: 32, height: 32, borderRadius: isEmployer ? 9 : "50%",
                background: "linear-gradient(135deg, var(--accent), var(--teal))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Poppins", fontWeight: 800, fontSize: 12.5,
                color: "#09090B", textDecoration: "none", flexShrink: 0,
              }}>
                {user.name.charAt(0).toUpperCase()}
              </Link>
            )}

            {user && !isEmployer && (
              <Link to="/bookmarks" style={{
                position: "relative", width: 32, height: 32, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#71717A", textDecoration: "none", transition: "color 0.15s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#71717A"}
              >
                <Bookmark size={16} />
                {bookmarks.length > 0 && (
                  <span style={{
                    position: "absolute", top: -2, right: -2,
                    width: 15, height: 15, borderRadius: "50%",
                    background: "var(--accent)", color: "#09090B",
                    fontSize: 8.5, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {bookmarks.length > 9 ? "9+" : bookmarks.length}
                  </span>
                )}
              </Link>
            )}

            {isEmployer ? (
              <EmployerMenu pathname={pathname} />
            ) : (
              <Link to="/post-job" className="hidden md:flex" style={{
                alignItems: "center", gap: 6, padding: "8px 12px",
                background: "none", border: "1px solid var(--border)",
                borderRadius: 8, color: "var(--muted)",
                fontFamily: "Poppins", fontSize: 12, fontWeight: 600,
                textDecoration: "none", transition: "all 0.15s", marginRight: 4,
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
              >
                <Briefcase size={13} /> For Employers
              </Link>
            )}

            {user ? (
              <button
                onClick={logout}
                className="hidden md:flex"
                style={{
                  alignItems: "center", padding: "8px 14px",
                  background: "none", border: "1px solid var(--border)",
                  borderRadius: 8, color: "var(--muted)",
                  fontFamily: "Poppins", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#fb7185"; e.currentTarget.style.color = "#fb7185"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/login" className="hidden md:flex" style={{
                  alignItems: "center", padding: "8px 14px",
                  background: "none", border: "1px solid var(--border)",
                  borderRadius: 8, color: "var(--muted)",
                  fontFamily: "Poppins", fontSize: 12, fontWeight: 600,
                  textDecoration: "none", transition: "all 0.15s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--text)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                >
                  Sign In
                </Link>
                <Link to="/register" className="hidden md:flex" style={{
                  alignItems: "center", padding: "8px 16px",
                  background: "var(--accent)", color: "#09090B",
                  borderRadius: 8, textDecoration: "none",
                  fontFamily: "Poppins", fontSize: 12, fontWeight: 700,
                  transition: "opacity 0.2s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                >
                  Register Free
                </Link>
              </>
            )}

            <button
              className="md:hidden flex items-center justify-center cursor-pointer"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                padding: 6,
                marginLeft: 4,
                width: "auto",
                height: "auto",
                zIndex: 101,
              }}
            >
              {open ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <line x1="5" y1="5" x2="19" y2="19" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="19" y1="5" x2="5" y2="19" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                  <line x1="1" y1="2" x2="23" y2="2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <line x1="5" y1="9" x2="23" y2="9" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="9" y1="16" x2="23" y2="16" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div style={{ height: 64 }} />

      <div
        className="md:hidden"
        style={{
          position: "fixed",
          top: 64, left: 0, right: 0, zIndex: 98,
          background: "#0a0a0a",
          borderBottom: "1px solid var(--border)",
          transform: open ? "translateY(0)" : "translateY(-110%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: open ? "0 20px 60px rgba(0,0,0,0.5)" : "none",
          overflowY: "auto",
          maxHeight: "calc(100vh - 64px)",
        }}
      >
        <div style={{ padding: "8px 24px 24px" }}>

          <p style={{
            fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: "0.1em",
            color: "var(--muted)", textTransform: "uppercase", marginBottom: 8, marginTop: 16,
          }}>
            Navigate
          </p>
          <nav>
            {visibleNavItems.map((item) => {
              const isActive = isItemActive(pathname, item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "13px 0",
                    borderBottom: "1px solid var(--border)",
                    textDecoration: "none",
                    color: isActive ? "var(--accent)" : "#ccc",
                    fontFamily: "Poppins", fontSize: 13,
                    fontWeight: isActive ? 700 : 600,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    transition: "color 0.2s",
                  }}
                >
                  <span>{item.name}</span>
                  <span style={{ color: isActive ? "var(--accent)" : "rgba(255,255,255,0.15)", fontSize: 18 }}>›</span>
                </Link>
              );
            })}
          </nav>

          {!isEmployer && (
            <>
              <p style={{
                fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: "0.1em",
                color: "var(--muted)", textTransform: "uppercase", marginBottom: 8, marginTop: 24,
              }}>
                Career Tools
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {mobileToolLinks.map((item) => {
                  const isActive = isItemActive(pathname, item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "10px 8px", borderRadius: 10,
                        border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                        background: isActive ? "rgba(0,255,179,0.08)" : "var(--surface)",
                        textDecoration: "none",
                        color: isActive ? "var(--accent)" : "#aaa",
                        fontFamily: "Poppins", fontSize: 11, fontWeight: 600,
                        textAlign: "center", transition: "all 0.15s",
                      }}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          <p style={{
            fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: "0.1em",
            color: "var(--muted)", textTransform: "uppercase", marginBottom: 8, marginTop: 24,
          }}>
            For Employers
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {employerLinks.map((item) => {
              const isActive = isItemActive(pathname, item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "10px 8px", borderRadius: 10,
                    border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                    background: isActive ? "rgba(0,255,179,0.08)" : "var(--surface)",
                    textDecoration: "none",
                    color: isActive ? "var(--accent)" : "#aaa",
                    fontFamily: "Poppins", fontSize: 11, fontWeight: 600,
                    textAlign: "center", transition: "all 0.15s",
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <p style={{
            fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: "0.1em",
            color: "var(--muted)", textTransform: "uppercase", marginBottom: 8, marginTop: 24,
          }}>
            Account
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {user ? (
              <button
                onClick={() => { logout(); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "13px", background: "none",
                  border: "1px solid var(--border)", borderRadius: 10,
                  color: "var(--muted)", fontFamily: "Poppins", fontSize: 13, fontWeight: 700,
                  letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block", textAlign: "center", padding: "13px",
                    background: "var(--accent)", color: "#09090B", borderRadius: 10,
                    fontFamily: "Poppins", fontSize: 13, fontWeight: 700,
                    letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none",
                  }}
                >
                  Register Free
                </Link>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block", textAlign: "center", padding: "13px",
                    background: "none", border: "1px solid var(--border)", color: "var(--text)",
                    borderRadius: 10, fontFamily: "Poppins", fontSize: 13, fontWeight: 600,
                    letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none",
                  }}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {!isEmployer && (
            <div style={{ marginTop: 20 }}>
              <Link
                to="/resume-builder"
                onClick={() => setOpen(false)}
                style={{
                  display: "block", textAlign: "center",
                  padding: "14px",
                  background: "var(--accent)", color: "#09090B",
                  borderRadius: 10,
                  fontFamily: "Poppins", fontSize: 13, fontWeight: 700,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Build My Resume — Free
              </Link>
            </div>
          )}

          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
            <span style={{ color: "var(--accent)", fontFamily: "JetBrains Mono", fontSize: 11, fontWeight: 600 }}>
              LIVE BOARD
            </span>
            <span style={{ color: "#444", fontFamily: "JetBrains Mono", fontSize: 11 }}>
              · Updated every search
            </span>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="md:hidden"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, top: 64, zIndex: 97,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}
    </>
  );
}