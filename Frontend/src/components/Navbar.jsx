import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bookmark,
  Briefcase,
  LayoutDashboard,
  ChevronDown,
  Plus,
  UserSearch,
} from "lucide-react";

import { useBookmarkContext } from "../context/BookmarkContext";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Jobs", path: "/jobs", seekerOnly: true },
  { name: "Companies", path: "/companies" },
  { name: "About", path: "/about" },
  { name: "Careers", path: "/careers" },
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
  {
    name: "Post a Job",
    path: "/post-job",
    icon: Plus,
  },
  {
    name: "Browse Candidates",
    path: "/candidates",
    icon: UserSearch,
  },
  {
    name: "Dashboard",
    path: "/employer/dashboard",
    icon: LayoutDashboard,
  },
];

function isItemActive(pathname, itemPath) {
  if (itemPath === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(itemPath);
}

function NavLink({ item, isActive }) {
  return (
    <Link
      to={item.path}
      className={`flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
        isActive
          ? "bg-white/70 text-[#4F46E5] shadow-sm backdrop-blur-sm"
          : "text-slate-600 hover:bg-white/40 hover:text-[#4F46E5]"
      }`}
    >
      {item.name}
    </Link>
  );
}

function EmployerMenu({ pathname }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const isActiveGroup = employerLinks.some((item) =>
    isItemActive(pathname, item.path)
  );

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative hidden md:block"
    >
      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
          isActiveGroup
            ? "bg-[#4F46E5] text-white"
            : "bg-[#0B132B] text-white hover:bg-[#0B132B]/90"
        }`}
      >
        <Briefcase size={15} />

        Employer

        <ChevronDown
          size={14}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-[110] min-w-[190px] overflow-hidden rounded-2xl border border-[#E2E6F0] bg-white shadow-xl">
          {employerLinks.map((item) => {
            const Icon = item.icon;

            const active = isItemActive(
              pathname,
              item.path
            );

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-[#EEF2FF] text-[#4F46E5]"
                    : "text-slate-600 hover:bg-[#F8FAFF]"
                }`}
              >
                <Icon
                  size={15}
                  className="text-[#4F46E5]"
                />

                {item.name}
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
  const [scrolled, setScrolled] = useState(false);

  const { pathname } = useLocation();

  const { bookmarks } =
    useBookmarkContext();

  const { user, logout } = useAuth();

  const isEmployer =
    user?.role === "employer";

  const isAdmin =
    user?.role === "admin";

  const visibleNavItems =
    navItems.filter(
      (item) =>
        !(isEmployer && item.seekerOnly)
    );

  // Scroll background
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  // Close mobile menu
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Navbar */}

      <div className="fixed inset-x-0 top-0 z-[9999] flex justify-center px-4 pt-4">
        <header
          className={`flex w-full max-w-6xl items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-300 ${
            scrolled
              ? "border border-white/80 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.10)] backdrop-blur-xl"
              : "border border-transparent bg-transparent shadow-none"
          }`}
        >
          {/* Logo */}

          <Link
            to="/"
            className="shrink-0 pl-2 text-lg font-black tracking-tight"
          >
            <span className="text-[#0B132B]">
              JOB
            </span>

            <span className="text-[#4F46E5]">
              XPORTAL
            </span>
          </Link>

          {/* Desktop navigation */}

          <nav className="hidden items-center gap-1 md:flex">
            {visibleNavItems.map(
              (item) => (
                <NavLink
                  key={item.name}
                  item={item}
                  isActive={isItemActive(
                    pathname,
                    item.path
                  )}
                />
              )
            )}
          </nav>

          {/* Right side */}

          <div className="flex shrink-0 items-center gap-2">
            {/* Profile */}

            {user && (
              <Link
                to={
                  isAdmin
                    ? "/admin"
                    : "/profile"
                }
                className={`flex h-9 w-9 items-center justify-center border border-[#4F46E5]/20 bg-[#EEF2FF] text-sm font-black text-[#4F46E5] transition hover:bg-[#E0E7FF] ${
                  isEmployer
                    ? "rounded-xl"
                    : "rounded-full"
                }`}
              >
                {user.name
                  ?.charAt(0)
                  .toUpperCase()}
              </Link>
            )}

            {/* Bookmarks */}

            {user &&
              !isEmployer &&
              !isAdmin && (
                <Link
                  to="/bookmarks"
                  className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-white/50 hover:text-[#4F46E5]"
                >
                  <Bookmark size={17} />

                  {bookmarks.length > 0 && (
                    <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#4F46E5] text-[9px] font-bold text-white">
                      {bookmarks.length > 9
                        ? "9+"
                        : bookmarks.length}
                    </span>
                  )}
                </Link>
              )}

            {/* Admin */}

            {isAdmin ? (
              <Link
                to="/admin"
                className="hidden items-center gap-2 rounded-full bg-[#0B132B] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0B132B]/90 md:flex"
              >
                Admin Dashboard
              </Link>
            ) : isEmployer ? (
              <EmployerMenu
                pathname={pathname}
              />
            ) : user ? (
              <Link
                to="/post-job"
                className="hidden items-center gap-2 rounded-full bg-[#0B132B] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0B132B]/90 md:flex"
              >
                For Employers
              </Link>
            ) : null}

            {/* Authentication */}

            {user ? (
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-1 rounded-full bg-[#0B132B] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#0B132B]/90 md:flex"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white/40 hover:text-[#4F46E5] md:flex"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="hidden items-center gap-1 rounded-full bg-[#0B132B] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#0B132B]/90 md:flex"
                >
                  Sign up

                  <span aria-hidden>
                    →
                  </span>
                </Link>
              </>
            )}

            {/* Mobile */}

            <button
              type="button"
              onClick={() =>
                setOpen(!open)
              }
              aria-label="Toggle menu"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 md:hidden"
            >
              {open ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <line
                    x1="5"
                    y1="5"
                    x2="19"
                    y2="19"
                    stroke="#4F46E5"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <line
                    x1="19"
                    y1="5"
                    x2="5"
                    y2="19"
                    stroke="#4F46E5"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="14"
                  viewBox="0 0 24 18"
                  fill="none"
                >
                  <line
                    x1="1"
                    y1="2"
                    x2="23"
                    y2="2"
                    stroke="#0B132B"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <line
                    x1="5"
                    y1="9"
                    x2="23"
                    y2="9"
                    stroke="#4F46E5"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <line
                    x1="9"
                    y1="16"
                    x2="23"
                    y2="16"
                    stroke="#0B132B"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </header>
      </div>

      {/* Page spacing */}

      <div className="h-16 md:h-20" />

      {/* Mobile menu */}

      {open && (
        <div className="fixed inset-x-4 top-20 z-[9998] max-h-[calc(100vh-96px)] overflow-y-auto rounded-3xl border border-white/70 bg-white/95 p-5 shadow-2xl backdrop-blur-xl md:hidden">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            Navigate
          </p>

          <nav className="mb-5 flex flex-col divide-y divide-[#E2E6F0]">
            {visibleNavItems.map(
              (item) => {
                const active =
                  isItemActive(
                    pathname,
                    item.path
                  );

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() =>
                      setOpen(false)
                    }
                    className={`flex items-center justify-between py-3 text-sm font-bold uppercase tracking-wide ${
                      active
                        ? "text-[#4F46E5]"
                        : "text-slate-700"
                    }`}
                  >
                    <span>
                      {item.name}
                    </span>

                    <span>&rsaquo;</span>
                  </Link>
                );
              }
            )}
          </nav>

          {!isEmployer &&
            !isAdmin && (
              <>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Career Tools
                </p>

                <div className="mb-5 grid grid-cols-2 gap-2">
                  {mobileToolLinks.map(
                    (item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() =>
                          setOpen(false)
                        }
                        className="rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] px-3 py-2.5 text-center text-xs font-semibold text-slate-600 transition hover:border-[#4F46E5]/30 hover:text-[#4F46E5]"
                      >
                        {item.name}
                      </Link>
                    )
                  )}
                </div>
              </>
            )}

          {!isAdmin && (
            <>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                For Employers
              </p>

              <div className="mb-5 grid grid-cols-2 gap-2">
                {employerLinks.map(
                  (item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() =>
                        setOpen(false)
                      }
                      className="rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] px-3 py-2.5 text-center text-xs font-semibold text-slate-600 transition hover:border-[#4F46E5]/30 hover:text-[#4F46E5]"
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() =>
                setOpen(false)
              }
              className="mb-4 block w-full rounded-xl bg-[#EEF2FF] px-3 py-3 text-center text-sm font-bold text-[#4F46E5]"
            >
              Admin Dashboard
            </Link>
          )}

          {user ? (
            <button
              type="button"
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full rounded-full bg-[#0B132B] py-3 text-sm font-bold uppercase tracking-wide text-white"
            >
              Sign Out
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/register"
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-full bg-[#0B132B] py-3 text-center text-sm font-bold uppercase tracking-wide text-white"
              >
                Sign up
              </Link>

              <Link
                to="/login"
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-full border border-[#E2E6F0] py-3 text-center text-sm font-bold uppercase tracking-wide text-slate-700"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}