import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Jobs", path: "/jobs" },
  { name: "Companies", path: "/companies" },
  { name: "Remote", path: "/remote" },
  { name: "About", path: "/about" },
];

function isItemActive(pathname, itemPath) {
  if (itemPath === "/") return pathname === "/";
  return pathname.startsWith(itemPath);
}

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 relative bg-[#0B0E14]/85 backdrop-blur-xl border-b border-[#1E2330]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="h-20 md:h-24 flex items-center justify-between">
         <Link
            to="/"
            onClick={() => setOpen(false)}
            className="font-display text-3xl md:text-4xl font-bold tracking-tight hover:opacity-90 transition"
          >
            <span className="text-[#F5F3EE]">JOB</span>
            <span className="text-[#FFB020]">XPORTAL</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-2 font-mono text-sm uppercase tracking-wider">
            {navItems.map((item) => {
              const isActive = isItemActive(location.pathname, item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-5 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "text-[#0B0E14] bg-[#FFB020]"
                      : "text-[#8A8F9C] hover:text-[#F5F3EE]"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-lg text-[#8A8F9C] hover:text-[#F5F3EE] transition cursor-pointer font-mono text-sm uppercase tracking-wider"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 rounded-lg font-semibold text-[#0B0E14] bg-[#2DD4BF] hover:bg-[#5eead4] transition-all duration-300 cursor-pointer"
            >
              Register
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-[#F5F3EE]"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-[#1E2330] bg-[#0B0E14]"
          >
            <div className="px-6 py-4 flex flex-col gap-1 font-mono text-sm uppercase tracking-wider">
              {navItems.map((item) => {
                const isActive = isItemActive(location.pathname, item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-lg ${
                      isActive ? "text-[#0B0E14] bg-[#FFB020]" : "text-[#8A8F9C]"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="flex gap-3 mt-3">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center px-5 py-3 rounded-lg border border-[#1E2330] text-[#8A8F9C]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center px-5 py-3 rounded-lg bg-[#2DD4BF] text-[#0B0E14] font-semibold"
                >
                  Register
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[500px] h-px bg-gradient-to-r from-transparent via-[#FFB020] to-transparent" />
    </nav>
  );
}