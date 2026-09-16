import React from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const links = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Careers",
    path: "/admin/careers",
    icon: BriefcaseBusiness,
  },
  {
    label: "Applications",
    path: "/admin/applications",
    icon: Users,
  },
];

export default function AdminLayout() {
  const { user, logout } =
    useAuth();

  const navigate =
    useNavigate();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  function handleLogout() {
    logout();

    navigate(
      "/admin/login",
      {
        replace: true,
      }
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#0B132B]">

      {/* MOBILE HEADER */}

      <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 lg:hidden">

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4F46E5] text-white">
            <span className="font-bold">
              J
            </span>
          </div>

          <span className="font-bold">
            JobXPortal
          </span>
        </div>

        <button
          onClick={() =>
            setMobileOpen(
              (value) => !value
            )
          }
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          {mobileOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>

      </div>

      <div className="flex">

        {/* SIDEBAR */}

        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-64
            border-r border-slate-200 bg-white
            transition-transform duration-200
            lg:translate-x-0
            ${
              mobileOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >

          <div className="flex h-full flex-col">

            {/* LOGO */}

            <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4F46E5] text-white">
                <span className="text-lg font-bold">
                  J
                </span>
              </div>

              <div>
                <div className="font-bold">
                  JobXPortal
                </div>

                <div className="text-xs text-slate-500">
                  Admin Panel
                </div>
              </div>

            </div>

            {/* NAVIGATION */}

            <nav className="flex-1 space-y-1 p-4">

              {links.map((link) => {
                const Icon =
                  link.icon;

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-indigo-50 text-[#4F46E5]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-[#4F46E5]"
                      }`
                    }
                  >
                    <Icon size={19} />
                    {link.label}
                  </NavLink>
                );
              })}

            </nav>

            {/* BOTTOM */}

            <div className="border-t border-slate-100 p-4">

              <div className="mb-3 rounded-xl bg-slate-50 p-3">

                <div className="truncate text-sm font-semibold">
                  {user?.name ||
                    "Administrator"}
                </div>

                <div className="truncate text-xs text-slate-500">
                  {user?.email}
                </div>

              </div>

              <button
                onClick={handleLogout}
                className="cursor-pointer flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>

          </div>

        </aside>

        {/* OVERLAY */}

        {mobileOpen && (
          <button
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
            onClick={() =>
              setMobileOpen(false)
            }
            aria-label="Close menu"
          />
        )}

        {/* MAIN */}

        <main className="min-h-screen w-full lg:ml-64">

          {/* DESKTOP TOP BAR */}

          <header className="hidden h-20 items-center justify-between border-b border-slate-200 bg-white px-8 lg:flex">

            <div>
              <h1 className="text-lg font-bold">
                Admin Dashboard
              </h1>

              <p className="text-sm text-slate-500">
                Manage JobXPortal recruitment.
              </p>
            </div>

            <a
              href="/careers"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-indigo-200 hover:text-[#4F46E5]"
            >
              View Careers
              <ExternalLink size={16} />
            </a>

          </header>

          <div className="p-5 md:p-8">
            <Outlet />
          </div>

        </main>

      </div>
    </div>
  );
}