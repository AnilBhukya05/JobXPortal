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
  // { name: "Remote", path: "/remote", seekerOnly: true },
  { name: "Tracker", path: "/tracker", seekerOnly: true },
  // { name: "Salary", path: "/salary-insights", seekerOnly: true },
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
  if (itemPath === "/") return pathname === "/";
  return pathname.startsWith(itemPath);
}

function NavLink({ item, isActive }) {
  return (
    <Link
      to={item.path}
      className={`relative flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
        isActive
          ? "bg-white text-[#4F46E5] shadow-sm"
          : "text-slate-600 hover:text-[#4F46E5]"
      }`}
    >
      {item.name}
    </Link>
  );
}

function EmployerMenu({ pathname }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const isActiveGroup = employerLinks.some((l) =>
    isItemActive(pathname, l.path)
  );

  useEffect(() => {
    function onClickOutside(e) {
      if (
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      onClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        onClickOutside
      );
  }, []);

  return (
    <div
      ref={ref}
      className="relative hidden md:block"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
          isActiveGroup
            ? "border-[#4F46E5]/30 bg-[#4F46E5]/10 text-[#4F46E5]"
            : "border-[#E2E6F0] bg-white text-slate-600 hover:border-[#4F46E5]/30 hover:text-[#4F46E5]"
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
        <div className="absolute right-0 top-[calc(100%+8px)] z-[110] min-w-[190px] overflow-hidden rounded-xl border border-[#E2E6F0] bg-white shadow-xl">
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
  const { pathname } = useLocation();
  const { bookmarks } = useBookmarkContext();
  const { user, logout } = useAuth();

  const isEmployer =
    user?.role === "employer";

  const visibleNavItems = navItems.filter(
    (item) =>
      !(isEmployer && item.seekerOnly)
  );

  return (
    <>
      {/* Fixed navbar */}
      <header className="fixed left-0 right-0 top-0 z-[100] border-b border-[#E2E6F0] bg-[#F8FAFF]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">

          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 text-xl font-black tracking-tight"
          >
            <span className="text-[#0B132B]">
              JOB
            </span>
            <span className="text-[#4F46E5]">
              XPORTAL
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 rounded-full border border-white/60 bg-white/40 p-1.5 shadow-sm backdrop-blur-md md:flex">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.name}
                item={item}
                isActive={isItemActive(
                  pathname,
                  item.path
                )}
              />
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex shrink-0 items-center gap-2">

            {user && (
              <Link
                to="/profile"
                className={`flex h-9 w-9 items-center justify-center text-sm font-black text-[#4F46E5] ${
                  isEmployer
                    ? "rounded-lg"
                    : "rounded-full"
                } border border-[#4F46E5]/20 bg-[#EEF2FF]`}
              >
                {user.name
                  .charAt(0)
                  .toUpperCase()}
              </Link>
            )}

            {user && !isEmployer && (
              <Link
                to="/bookmarks"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:text-[#4F46E5]"
              >
                <Bookmark size={17} />

                {bookmarks.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#4F46E5] text-[9px] font-bold text-white">
                    {bookmarks.length > 9
                      ? "9+"
                      : bookmarks.length}
                  </span>
                )}
              </Link>
            )}

            {isEmployer ? (
              <EmployerMenu
                pathname={pathname}
              />
            ) : user ? (
              <Link
                to="/post-job"
                className="hidden items-center gap-2 rounded-xl border border-[#E2E6F0] bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#4F46E5]/30 hover:text-[#4F46E5] md:flex"
              >
                <Briefcase size={15} />
                For Employers
              </Link>
            ) : null}

            {user ? (
              <button
                onClick={logout}
                className="hidden rounded-xl border border-[#E2E6F0] bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-300 hover:text-red-500 md:flex"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-xl border border-[#E2E6F0] bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#4F46E5]/30 hover:text-[#4F46E5] md:flex"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="hidden rounded-xl bg-[#4F46E5] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#4338CA] md:flex"
                >
                  Register Free
                </Link>
              </>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 md:hidden"
            >
              {open ? (
                <svg
                  width="20"
                  height="20"
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
                  width="22"
                  height="16"
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
        </div>
      </header>

      {/* Navbar spacing */}
      <div className="h-16" />

      {/* Mobile dropdown */}
      {open && (
        <div className="fixed inset-x-0 top-16 z-[98] max-h-[calc(100vh-64px)] overflow-y-auto border-b border-[#E2E6F0] bg-white p-5 shadow-xl md:hidden">

          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            Navigate
          </p>

          <nav className="mb-5 flex flex-col divide-y divide-[#E2E6F0]">
            {visibleNavItems.map((item) => {
              const isActive =
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
                  className={`py-3 text-sm font-bold uppercase tracking-wide ${
                    isActive
                      ? "text-[#4F46E5]"
                      : "text-slate-700"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {!isEmployer && (
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
                      className="rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] px-3 py-2.5 text-center text-xs font-semibold text-slate-600"
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>
            </>
          )}

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
                  className="rounded-xl border border-[#E2E6F0] bg-[#F8FAFF] px-3 py-2.5 text-center text-xs font-semibold text-slate-600"
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {user ? (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full rounded-xl border border-[#E2E6F0] py-3 text-sm font-bold uppercase tracking-wide text-slate-600"
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
                className="rounded-xl bg-[#4F46E5] py-3 text-center text-sm font-bold uppercase tracking-wide text-white"
              >
                Register Free
              </Link>

              <Link
                to="/login"
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-xl border border-[#E2E6F0] py-3 text-center text-sm font-bold uppercase tracking-wide text-slate-700"
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