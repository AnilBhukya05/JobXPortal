import { Link } from "react-router-dom";

const footerLinks = [
  { name: "Jobs", path: "/jobs" },
  { name: "Companies", path: "/companies" },
  { name: "Remote", path: "/remote" },
  { name: "About", path: "/about" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#1E2330] py-10 md:py-12 bg-[#0B0E14]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold">
            <span className="text-[#F5F3EE]">JOB</span>
            <span className="text-[#FFB020]">XPORTAL</span>
          </h2>
          <p className="text-[#8A8F9C] mt-2 md:mt-3 max-w-sm text-sm">
            One board, every opening. Real listings from LinkedIn, Naukri,
            Glassdoor, Indeed and more.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs md:text-sm uppercase tracking-wider">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-[#8A8F9C] hover:text-[#FFB020] transition"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8 pt-6 border-t border-[#1E2330] flex flex-col md:flex-row justify-between gap-2 text-[#5b606e] text-xs font-mono">
        <p>(c) 2026 JobXPortal. All gates monitored 24/7.</p>
        <p>Built for job seekers, not recruiters.</p>
      </div>
    </footer>
  );
}