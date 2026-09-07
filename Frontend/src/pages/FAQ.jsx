import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, HelpCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FAQ_SECTIONS = [
  {
    title: "General",
    items: [
      {
        q: "What is JobXPortal?",
        a: "JobXPortal is a job board that pulls live listings from LinkedIn, Naukri, Glassdoor, Indeed, Wellfound and company career pages into one place, refreshed on every search. Employers can also post roles directly, free.",
      },
      {
        q: "Is it free to use?",
        a: "Yes, completely free — searching jobs, saving bookmarks, using the resume and interview tools, and posting jobs as an employer all cost nothing.",
      },
      {
        q: "Do I need an account to search for jobs?",
        a: "No. Browsing and searching jobs works without signing in. An account is only needed for features tied to your data — bookmarks, resume builder, job tracker, and posting jobs as an employer.",
      },
      {
        q: "How often are listings updated?",
        a: "Search results are pulled fresh from live sources every time you search, not from a stored cache. Listings from employers who post directly on JobXPortal appear immediately.",
      },
    ],
  },
  {
    title: "For Job Seekers",
    items: [
      {
        q: "How do I save a job for later?",
        a: "Click the bookmark icon on any job card. Your saved jobs are available anytime from the Bookmarks page once you're signed in.",
      },
      {
        q: "What's the difference between Resume Builder and Resume Match?",
        a: "Resume Builder lets you create and download a clean PDF resume from scratch. Resume Match compares your existing resume against a specific job description to highlight gaps and overlap.",
      },
      {
        q: "Does JobXPortal apply to jobs on my behalf?",
        a: "No. JobXPortal links you directly to the employer's application page or apply link — applications happen on the employer's or source portal's site, not inside JobXPortal.",
      },
      {
        q: "Can I track jobs I've applied to?",
        a: "Yes, the Job Tracker lets you log applications and their status so you can keep everything in one place instead of across email threads and browser tabs.",
      },
    ],
  },
  {
    title: "For Employers",
    items: [
      {
        q: "How do I post a job?",
        a: "Register an account and choose \"I'm hiring\" during sign-up (or register as an employer directly from the \"For Employers\" prompt). Once registered, use Post a Job from the navbar to publish a listing — it goes live immediately.",
      },
      {
        q: "Is posting a job really free?",
        a: "Yes. There's no cost to post, no credit card required, and no limit on how many roles you can list.",
      },
      {
        q: "Where do candidates see my job posting?",
        a: "Your listing appears in regular search results and category browsing across JobXPortal, mixed in with listings pulled from other sources — it isn't hidden in a separate employer-only area.",
      },
      {
        q: "Can I edit or remove a job after posting?",
        a: "You can delete a listing anytime from the Employer Dashboard. Editing an existing post isn't available yet — for now, delete and repost with updated details.",
      },
      {
        q: "How do candidates apply to my listing?",
        a: "Whatever you set at posting time — either the Apply URL you provide (your own careers page or application form) or, if left blank, your contact email instead.",
      },
    ],
  },
];

function FAQItem({ q, a, isOpen, onToggle }) {
  return (
    <div style={{
      border: "1px solid var(--border)", borderRadius: 12,
      background: "var(--surface)", overflow: "hidden",
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, padding: "16px 18px", background: "none", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 14, color: "var(--text)" }}>
          {q}
        </span>
        <ChevronDown
          size={18}
          style={{
            color: "var(--accent)", flexShrink: 0,
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>
      <div style={{
        maxHeight: isOpen ? 300 : 0,
        overflow: "hidden",
        transition: "max-height 0.25s ease",
      }}>
        <p style={{
          fontFamily: "Poppins", fontSize: 13.5, color: "var(--muted)",
          lineHeight: 1.7, padding: "0 18px 18px",
        }}>
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const navigate = useNavigate();
  const [openKey, setOpenKey] = useState(null);

  function toggle(key) {
    setOpenKey((prev) => (prev === key ? null : key));
  }

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", padding: "32px 24px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          <button onClick={() => navigate(-1)} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--muted)",
            background: "none", border: "none", cursor: "pointer", marginBottom: 24,
            letterSpacing: "0.08em",
          }}>
            <ArrowLeft size={14} /> Back
          </button>

          <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
            HELP CENTER
          </p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <HelpCircle size={28} style={{ color: "var(--accent)" }} />
            Frequently Asked Questions
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 36 }}>
            Common questions from job seekers and employers. Can't find what you need? Reach out on the Contact page.
          </p>

          {FAQ_SECTIONS.map((section, sIdx) => (
            <div key={section.title} style={{ marginBottom: 36 }}>
              <p style={{
                fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em",
                color: "var(--accent)", textTransform: "uppercase", marginBottom: 14,
              }}>
                {section.title}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {section.items.map((item, iIdx) => {
                  const key = `${sIdx}-${iIdx}`;
                  return (
                    <FAQItem
                      key={key}
                      q={item.q}
                      a={item.a}
                      isOpen={openKey === key}
                      onToggle={() => toggle(key)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}