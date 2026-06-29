import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Bookmark } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useBookmarkContext } from "../context/BookmarkContext";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Jobs", path: "/jobs" },
  { name: "Companies", path: "/companies" },
  { name: "Remote", path: "/remote" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
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
        padding: "0 16px",
        height: 64,
        fontFamily: "Poppins, sans-serif",
        fontSize: "12px",
        fontWeight: weight,
        letterSpacing: "0.08em",
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

function IconBtn({ onClick, label, dark, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 34,
        height: 34,
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: hovered ? (dark ? "#fff" : "#09090B") : "#888",
        background: "none",
        border: "none",
        cursor: "pointer",
        transition: "color 0.15s",
      }}
    >
      {children}
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { dark, toggleTheme } = useTheme();
  const { bookmarks } = useBookmarkContext();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const bg = dark
    ? scrolled || open
      ? "rgba(6,6,6,0.99)"
      : "rgba(8,8,8,0.88)"
    : scrolled || open
      ? "rgba(248,248,248,0.99)"
      : "rgba(250,250,250,0.92)";

  const bdr = dark
    ? scrolled
      ? "rgba(255,255,255,0.1)"
      : "rgba(255,255,255,0.05)"
    : scrolled
      ? "rgba(0,0,0,0.10)"
      : "rgba(0,0,0,0.06)";

  const inactiveColor = "#888";
  const hoverColor = dark ? "#fff" : "#09090B";
  const activeColor = "#00FFB3";

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 64,
          background: bg,
          borderBottom: `1px solid ${bdr}`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 28px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* LOGO */}
          <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 800,
                fontSize: "1.3rem",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              <span style={{ color: dark ? "#fff" : "#09090B" }}>JOB</span>
              <span style={{ color: "#FFB020" }}>XPORTAL</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav
            className="hidden md:flex"
            style={{
              alignItems: "stretch",
              height: 64,
              flex: 1,
              justifyContent: "center",
              gap: 0,
            }}
          >
            {navItems.map((item) => (
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

          {/* RIGHT */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            {/* THEME */}
            <IconBtn onClick={toggleTheme} label="Toggle theme" dark={dark}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </IconBtn>

            {/* BOOKMARKS */}
            <Link
              to="/bookmarks"
              style={{
                position: "relative",
                width: 34,
                height: 34,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#888",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00FFB3")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
            >
              <Bookmark size={15} />
              {bookmarks.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#00FFB3",
                    color: "#09090B",
                    fontSize: 9,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {bookmarks.length > 9 ? "9+" : bookmarks.length}
                </span>
              )}
            </Link>

            {/* FIND JOBS CTA — desktop only */}
            <Link
              to="/jobs"
              className="hidden md:flex"
              style={{
                alignItems: "center",
                padding: "9px 20px",
                background: "#00FFB3",
                color: "#09090B",
                borderRadius: 6,
                fontFamily: "Poppins, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#00e6a0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#00FFB3")
              }
            >
              Find Jobs
            </Link>

            {/* HAMBURGER — mobile only, no inline display so md:hidden works */}
            <button
              className="md:hidden flex items-center justify-center cursor-pointer"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                padding: 0,
                width: "auto",
                height: "auto",
                zIndex: 101,
              }}
            >
              {open ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <line
                    x1="5"
                    y1="5"
                    x2="19"
                    y2="19"
                    stroke="#00FFB3"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="19"
                    y1="5"
                    x2="5"
                    y2="19"
                    stroke="#00FFB3"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                  <line
                    x1="1"
                    y1="2"
                    x2="23"
                    y2="2"
                    stroke={dark ? "#fff" : "#111"}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="5"
                    y1="9"
                    x2="23"
                    y2="9"
                    stroke="#00FFB3"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="9"
                    y1="16"
                    x2="23"
                    y2="16"
                    stroke={dark ? "#fff" : "#111"}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-DOWN MENU */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          top: 64,
          left: 0,
          right: 0,
          zIndex: 98,
          background: dark ? "#0a0a0a" : "#fff",
          borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          transform: open ? "translateY(0)" : "translateY(-110%)",
          transition: "transform 0.38s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: open ? "0 20px 60px rgba(0,0,0,0.4)" : "none",
          overflowY: "auto",
          maxHeight: "calc(100vh - 64px)",
        }}
      >
        <div style={{ padding: "8px 24px 28px" }}>
          <nav>
            {navItems.map((item) => {
              const isActive = isItemActive(pathname, item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 0",
                    borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                    textDecoration: "none",
                    color: isActive ? "#00FFB3" : dark ? "#ccc" : "#333",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#00FFB3";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.color = dark ? "#ccc" : "#333";
                  }}
                >
                  <span>{item.name}</span>
                  <span
                    style={{
                      color: isActive
                        ? "#00FFB3"
                        : dark
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(0,0,0,0.2)",
                      fontSize: 20,
                    }}
                  >
                    ›
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* MOBILE CTA */}
          <div style={{ marginTop: 24 }}>
            <Link
              to="/jobs"
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                textAlign: "center",
                padding: "14px",
                background: "#00FFB3",
                color: "#09090B",
                borderRadius: 8,
                fontFamily: "Poppins, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Find Jobs Now
            </Link>
          </div>

          {/* LIVE BADGE */}
          <div
            style={{
              marginTop: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#00FFB3",
                display: "inline-block",
              }}
            />
            <span
              style={{
                color: "#00FFB3",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              LIVE BOARD
            </span>
            <span
              style={{
                color: dark ? "#444" : "#999",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 11,
              }}
            >
              · Updated every search
            </span>
          </div>
        </div>
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          className="md:hidden"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            top: 64,
            zIndex: 97,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}
    </>
  );
}
