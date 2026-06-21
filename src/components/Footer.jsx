import { Link } from "react-router-dom";

const footerLinks = [
  { name: "Jobs", path: "/jobs" },
  { name: "Companies", path: "/companies" },
  { name: "Remote", path: "/remote" },
  { name: "About", path: "/about" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#1E2330] py-12 bg-[#0B0E14]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <h2 className="font-display text-2xl font-bold">
            <span className="text-[#F5F3EE]">JOB</span>
            <span className="text-[#FFB020]">XPORTAL</span>
          </h2>
          <p className="text-[#8A8F9C] mt-3 max-w-sm">
            One board, every opening. We pull listings from LinkedIn, Naukri,
            Foundit, Indeed, Wellfound and company career pages so you only
            have to check one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm uppercase tracking-wider">
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

      <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-[#1E2330] flex flex-col md:flex-row justify-between gap-2 text-[#5b606e] text-sm font-mono">
        <p>© 2026 JobXPortal. All gates monitored 24/7.</p>
        <p>Built for job seekers, not recruiters.</p>
      </div>
    </footer>
  );
}