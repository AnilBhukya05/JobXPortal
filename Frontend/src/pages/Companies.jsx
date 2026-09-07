import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Search, ExternalLink, Building2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const COMPANIES = [
  // IT SERVICES — INDIA
  { name: "TCS", industry: "IT", location: "Mumbai", url: "https://www.tcs.com/careers", search: "tcs", domain: "tcs.com" },
  { name: "Infosys", industry: "IT", location: "Bangalore", url: "https://www.infosys.com/careers", search: "infosys", domain: "infosys.com" },
  { name: "Wipro", industry: "IT", location: "Bangalore", url: "https://careers.wipro.com", search: "wipro", domain: "wipro.com" },
  { name: "HCL Technologies", industry: "IT", location: "Noida", url: "https://www.hcltech.com/careers", search: "hcl technologies", domain: "hcltech.com" },
  { name: "Tech Mahindra", industry: "IT", location: "Pune", url: "https://careers.techmahindra.com", search: "tech mahindra", domain: "techmahindra.com" },
  { name: "Cognizant", industry: "IT", location: "Chennai", url: "https://careers.cognizant.com", search: "cognizant", domain: "cognizant.com" },
  { name: "Capgemini", industry: "IT", location: "Mumbai", url: "https://www.capgemini.com/in-en/careers", search: "capgemini", domain: "capgemini.com" },
  { name: "Accenture", industry: "IT", location: "Bangalore", url: "https://www.accenture.com/in-en/careers", search: "accenture", domain: "accenture.com" },
  { name: "IBM", industry: "IT", location: "Bangalore", url: "https://www.ibm.com/in-en/employment", search: "ibm india", domain: "ibm.com" },
  { name: "Mphasis", industry: "IT", location: "Bangalore", url: "https://careers.mphasis.com", search: "mphasis", domain: "mphasis.com" },
  { name: "Hexaware", industry: "IT", location: "Mumbai", url: "https://hexaware.com/careers", search: "hexaware", domain: "hexaware.com" },
  { name: "LTIMindtree", industry: "IT", location: "Mumbai", url: "https://www.ltimindtree.com/careers", search: "ltimindtree", domain: "ltimindtree.com" },
  { name: "Persistent Systems", industry: "IT", location: "Pune", url: "https://www.persistent.com/careers", search: "persistent systems", domain: "persistent.com" },
  { name: "Minda Industries", industry: "IT", location: "Gurugram", url: "https://www.mindagroup.com/career", search: "minda", domain: "mindagroup.com" },
  { name: "Zensar", industry: "IT", location: "Pune", url: "https://www.zensar.com/careers", search: "zensar", domain: "zensar.com" },
  { name: "Birlasoft", industry: "IT", location: "Noida", url: "https://www.birlasoft.com/careers", search: "birlasoft", domain: "birlasoft.com" },
  { name: "NIIT Technologies", industry: "IT", location: "Noida", url: "https://www.niit.com/en/careers", search: "niit", domain: "niit.com" },
  { name: "Cyient", industry: "IT", location: "Hyderabad", url: "https://www.cyient.com/careers", search: "cyient", domain: "cyient.com" },
  { name: "Mastech Digital", industry: "IT", location: "Noida", url: "https://www.mastechdigital.com/careers", search: "mastech", domain: "mastechdigital.com" },
  { name: "Kyndryl", industry: "IT", location: "Bangalore", url: "https://www.kyndryl.com/us/en/careers", search: "kyndryl", domain: "kyndryl.com" },

  // GLOBAL TECH
  { name: "Google", industry: "Tech", location: "Hyderabad", url: "https://careers.google.com", search: "google india", domain: "google.com" },
  { name: "Microsoft", industry: "Tech", location: "Hyderabad", url: "https://careers.microsoft.com", search: "microsoft india", domain: "microsoft.com" },
  { name: "Amazon", industry: "Tech", location: "Hyderabad", url: "https://www.amazon.jobs", search: "amazon india", domain: "amazon.com" },
  { name: "Meta", industry: "Tech", location: "Hyderabad", url: "https://www.metacareers.com", search: "meta india", domain: "meta.com" },
  { name: "Apple", industry: "Tech", location: "Hyderabad", url: "https://jobs.apple.com", search: "apple india", domain: "apple.com" },
  { name: "Adobe", industry: "Tech", location: "Noida", url: "https://www.adobe.com/careers.html", search: "adobe india", domain: "adobe.com" },
  { name: "Salesforce", industry: "Tech", location: "Hyderabad", url: "https://www.salesforce.com/company/careers", search: "salesforce india", domain: "salesforce.com" },
  { name: "Cisco", industry: "Tech", location: "Bangalore", url: "https://jobs.cisco.com", search: "cisco india", domain: "cisco.com" },
  { name: "Intel", industry: "Tech", location: "Bangalore", url: "https://jobs.intel.com", search: "intel india", domain: "intel.com" },
  { name: "Qualcomm", industry: "Tech", location: "Hyderabad", url: "https://www.qualcomm.com/company/careers", search: "qualcomm india", domain: "qualcomm.com" },
  { name: "Oracle", industry: "Tech", location: "Hyderabad", url: "https://www.oracle.com/in/corporate/careers", search: "oracle india", domain: "oracle.com" },
  { name: "SAP", industry: "Tech", location: "Bangalore", url: "https://jobs.sap.com", search: "sap india", domain: "sap.com" },
  { name: "Nvidia", industry: "Tech", location: "Pune", url: "https://www.nvidia.com/en-us/about-nvidia/careers", search: "nvidia india", domain: "nvidia.com" },
  { name: "Atlassian", industry: "Tech", location: "Bangalore", url: "https://www.atlassian.com/company/careers", search: "atlassian india", domain: "atlassian.com" },
  { name: "Uber", industry: "Tech", location: "Hyderabad", url: "https://www.uber.com/in/en/careers", search: "uber india", domain: "uber.com" },
  { name: "Airbnb", industry: "Tech", location: "Bangalore", url: "https://careers.airbnb.com", search: "airbnb india", domain: "airbnb.com" },
  { name: "Stripe", industry: "Tech", location: "Bangalore", url: "https://stripe.com/jobs", search: "stripe india", domain: "stripe.com" },
  { name: "Twilio", industry: "Tech", location: "Bangalore", url: "https://www.twilio.com/en-us/company/jobs", search: "twilio india", domain: "twilio.com" },

  // STARTUPS — INDIA
  { name: "Flipkart", industry: "E-commerce", location: "Bangalore", url: "https://www.flipkartcareers.com", search: "flipkart", domain: "flipkart.com" },
  { name: "Swiggy", industry: "FoodTech", location: "Bangalore", url: "https://careers.swiggy.com", search: "swiggy", domain: "swiggy.com" },
  { name: "Zomato", industry: "FoodTech", location: "Gurugram", url: "https://www.zomato.com/careers", search: "zomato", domain: "zomato.com" },
  { name: "Razorpay", industry: "FinTech", location: "Bangalore", url: "https://razorpay.com/jobs", search: "razorpay", domain: "razorpay.com" },
  { name: "CRED", industry: "FinTech", location: "Bangalore", url: "https://careers.cred.club", search: "cred", domain: "cred.club" },
  { name: "PhonePe", industry: "FinTech", location: "Bangalore", url: "https://www.phonepe.com/careers", search: "phonepe", domain: "phonepe.com" },
  { name: "Paytm", industry: "FinTech", location: "Noida", url: "https://jobs.lever.co/paytm", search: "paytm", domain: "paytm.com" },
  { name: "Groww", industry: "FinTech", location: "Bangalore", url: "https://groww.in/p/careers", search: "groww", domain: "groww.in" },
  { name: "Zerodha", industry: "FinTech", location: "Bangalore", url: "https://zerodha.com/careers", search: "zerodha", domain: "zerodha.com" },
  { name: "Ola", industry: "Transport", location: "Bangalore", url: "https://ola.skillate.com", search: "ola cabs", domain: "olacabs.com" },
  { name: "Byju's", industry: "EdTech", location: "Bangalore", url: "https://byjus.com/jobs", search: "byjus", domain: "byjus.com" },
  { name: "Unacademy", industry: "EdTech", location: "Bangalore", url: "https://unacademy.com/careers", search: "unacademy", domain: "unacademy.com" },
  { name: "Meesho", industry: "E-commerce", location: "Bangalore", url: "https://meesho.io/careers", search: "meesho", domain: "meesho.com" },
  { name: "Freshworks", industry: "SaaS", location: "Chennai", url: "https://www.freshworks.com/company/careers", search: "freshworks", domain: "freshworks.com" },
  { name: "Zoho", industry: "SaaS", location: "Chennai", url: "https://www.zoho.com/careers.html", search: "zoho", domain: "zoho.com" },
  { name: "Zepto", industry: "Quick Commerce", location: "Mumbai", url: "https://www.zepto.team/careers", search: "zepto", domain: "zeptonow.com" },
  { name: "Nykaa", industry: "E-commerce", location: "Mumbai", url: "https://www.nykaa.com/careers", search: "nykaa", domain: "nykaa.com" },
  { name: "Dunzo", industry: "Quick Commerce", location: "Bangalore", url: "https://www.dunzo.com/careers", search: "dunzo", domain: "dunzo.com" },
  { name: "ShareChat", industry: "SaaS", location: "Bangalore", url: "https://sharechat.com/careers", search: "sharechat", domain: "sharechat.com" },
  { name: "Postman", industry: "SaaS", location: "Bangalore", url: "https://www.postman.com/company/careers", search: "postman", domain: "postman.com" },
  { name: "BrowserStack", industry: "SaaS", location: "Mumbai", url: "https://www.browserstack.com/careers", search: "browserstack", domain: "browserstack.com" },
  { name: "Chargebee", industry: "SaaS", location: "Chennai", url: "https://www.chargebee.com/careers", search: "chargebee", domain: "chargebee.com" },
  { name: "Clevertap", industry: "SaaS", location: "Mumbai", url: "https://clevertap.com/careers", search: "clevertap", domain: "clevertap.com" },
  { name: "Darwinbox", industry: "SaaS", location: "Hyderabad", url: "https://darwinbox.com/careers", search: "darwinbox", domain: "darwinbox.com" },
  { name: "Lenskart", industry: "E-commerce", location: "Noida", url: "https://www.lenskart.com/careers", search: "lenskart", domain: "lenskart.com" },
  { name: "Mamaearth", industry: "E-commerce", location: "Gurugram", url: "https://mamaearth.in/pages/career", search: "mamaearth", domain: "mamaearth.in" },
  { name: "Ather Energy", industry: "EV", location: "Bangalore", url: "https://www.atherenergy.com/careers", search: "ather energy", domain: "atherenergy.com" },
  { name: "Ola Electric", industry: "EV", location: "Bangalore", url: "https://www.olaelectric.com/careers", search: "ola electric", domain: "olaelectric.com" },

  // BANKING & FINANCE
  { name: "HDFC Bank", industry: "Banking", location: "Mumbai", url: "https://www.hdfcbank.com/content/bbp/repositories/723fb80a-2dde-42a3-9793-7ae1be57c87f/?folderPath=/footer/Careers", search: "hdfc bank", domain: "hdfcbank.com" },
  { name: "ICICI Bank", industry: "Banking", location: "Mumbai", url: "https://www.icicicareers.com", search: "icici bank", domain: "icicibank.com" },
  { name: "Axis Bank", industry: "Banking", location: "Mumbai", url: "https://www.axisbank.com/careers", search: "axis bank", domain: "axisbank.com" },
  { name: "Kotak Mahindra", industry: "Banking", location: "Mumbai", url: "https://www.kotak.com/en/careers", search: "kotak mahindra bank", domain: "kotak.com" },
  { name: "SBI", industry: "Banking", location: "Mumbai", url: "https://sbi.co.in/web/careers", search: "sbi bank", domain: "sbi.co.in" },
  { name: "Goldman Sachs", industry: "Finance", location: "Bangalore", url: "https://www.goldmansachs.com/careers", search: "goldman sachs india", domain: "goldmansachs.com" },
  { name: "JP Morgan", industry: "Finance", location: "Mumbai", url: "https://careers.jpmorgan.com", search: "jp morgan india", domain: "jpmorgan.com" },
  { name: "Morgan Stanley", industry: "Finance", location: "Mumbai", url: "https://www.morganstanley.com/people/india", search: "morgan stanley india", domain: "morganstanley.com" },
  { name: "Barclays", industry: "Finance", location: "Pune", url: "https://search.jobs.barclays/india", search: "barclays india", domain: "barclays.com" },
  { name: "Deutsche Bank", industry: "Finance", location: "Mumbai", url: "https://careers.db.com", search: "deutsche bank india", domain: "db.com" },

  // CONSULTING
  { name: "McKinsey", industry: "Consulting", location: "Mumbai", url: "https://www.mckinsey.com/careers", search: "mckinsey india", domain: "mckinsey.com" },
  { name: "BCG", industry: "Consulting", location: "Mumbai", url: "https://careers.bcg.com", search: "bcg india", domain: "bcg.com" },
  { name: "Deloitte", industry: "Consulting", location: "Mumbai", url: "https://jobs2.deloitte.com/in/en", search: "deloitte india", domain: "deloitte.com" },
  { name: "EY", industry: "Consulting", location: "Mumbai", url: "https://careers.ey.com/ey/India", search: "ey india", domain: "ey.com" },
  { name: "KPMG", industry: "Consulting", location: "Mumbai", url: "https://home.kpmg/in/en/home/careers.html", search: "kpmg india", domain: "kpmg.com" },
  { name: "PwC", industry: "Consulting", location: "Mumbai", url: "https://www.pwc.in/careers.html", search: "pwc india", domain: "pwc.com" },
  { name: "Bain & Company", industry: "Consulting", location: "Mumbai", url: "https://www.bain.com/careers", search: "bain company india", domain: "bain.com" },
  { name: "Gartner", industry: "Consulting", location: "Gurugram", url: "https://jobs.gartner.com", search: "gartner india", domain: "gartner.com" },

  // MANUFACTURING & OTHERS
  { name: "Tata Motors", industry: "Automotive", location: "Mumbai", url: "https://www.tatamotors.com/careers", search: "tata motors", domain: "tatamotors.com" },
  { name: "Mahindra", industry: "Automotive", location: "Mumbai", url: "https://careers.mahindra.com", search: "mahindra", domain: "mahindra.com" },
  { name: "Bajaj Auto", industry: "Automotive", location: "Pune", url: "https://www.bajajauto.com/careers", search: "bajaj auto", domain: "bajajauto.com" },
  { name: "Maruti Suzuki", industry: "Automotive", location: "Gurugram", url: "https://www.marutisuzuki.com/corporate/careers", search: "maruti suzuki", domain: "marutisuzuki.com" },
  { name: "Reliance", industry: "Conglomerate", location: "Mumbai", url: "https://careers.ril.com", search: "reliance industries", domain: "ril.com" },
  { name: "Asian Paints", industry: "Manufacturing", location: "Mumbai", url: "https://www.asianpaints.com/careers", search: "asian paints", domain: "asianpaints.com" },
  { name: "Hindustan Unilever", industry: "FMCG", location: "Mumbai", url: "https://www.hul.co.in/careers", search: "hindustan unilever", domain: "hul.co.in" },
  { name: "Nestle India", industry: "FMCG", location: "Gurugram", url: "https://www.nestle.in/jobs", search: "nestle india", domain: "nestle.in" },
  { name: "ITC Limited", industry: "FMCG", location: "Kolkata", url: "https://www.itcportal.com/careers", search: "itc limited", domain: "itcportal.com" },
  { name: "Dr Reddy's", industry: "Pharma", location: "Hyderabad", url: "https://www.drreddys.com/careers", search: "dr reddys", domain: "drreddys.com" },
  { name: "Sun Pharma", industry: "Pharma", location: "Mumbai", url: "https://www.sunpharma.com/careers", search: "sun pharma", domain: "sunpharma.com" },
  { name: "Cipla", industry: "Pharma", location: "Mumbai", url: "https://www.cipla.com/careers", search: "cipla", domain: "cipla.com" },
  { name: "Biocon", industry: "Pharma", location: "Bangalore", url: "https://www.biocon.com/careers", search: "biocon", domain: "biocon.com" },
];

const INDUSTRY_GROUPS = {
  "All": null,
  "IT Services": ["IT"],
  "Global Tech": ["Tech"],
  "Startups": ["E-commerce", "FoodTech", "FinTech", "EdTech", "SaaS", "Quick Commerce", "Transport", "EV"],
  "Banking & Finance": ["Banking", "Finance"],
  "Consulting": ["Consulting"],
  "Manufacturing": ["Automotive", "Manufacturing", "FMCG", "Pharma", "Conglomerate"],
};

function CompanyLogo({ name, domain }) {
  const [srcIndex, setSrcIndex] = useState(0);
  const initial = name.charAt(0).toUpperCase();

  const sources = [
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  ];

  if (srcIndex >= sources.length) {
    return (
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: "linear-gradient(135deg, var(--accent)25, var(--teal)25)",
        border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Poppins", fontWeight: 800, fontSize: 18,
        color: "var(--accent)",
      }}>
        {initial}
      </div>
    );
  }

  return (
    <img
      src={sources[srcIndex]}
      alt={name}
      onError={() => setSrcIndex((i) => i + 1)}
      style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        objectFit: "contain", background: "#fff", padding: 4,
        border: "1px solid var(--border)",
      }}
    />
  );
}

function CompanyCard({ company }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--card-hover)" : "var(--surface)",
        border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
        borderRadius: 14, padding: "16px 18px",
        transition: "all 0.2s",
        display: "flex", flexDirection: "column", gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <CompanyLogo name={company.name} domain={company.domain} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: "Poppins", fontSize: 14, fontWeight: 700,
            color: "var(--text)", marginBottom: 2,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {company.name}
          </h3>
          <p style={{ fontFamily: "Poppins", fontSize: 12, color: "var(--muted)" }}>
            {company.location}
          </p>
        </div>
        <span style={{
          fontFamily: "JetBrains Mono", fontSize: 10,
          padding: "3px 8px", borderRadius: 5,
          background: "var(--surface2)", border: "1px solid var(--border)",
          color: "var(--muted)", flexShrink: 0, whiteSpace: "nowrap",
        }}>
          {company.industry}
        </span>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {/* Career Page — external */}
        <a
          href={company.url}
          target="_blank"
          rel="noreferrer"
          style={{
            flex: 1, display: "flex", alignItems: "center",
            justifyContent: "center", gap: 6,
            padding: "8px", background: "var(--accent)", color: "#09090B",
            borderRadius: 9, textDecoration: "none",
            fontFamily: "Poppins", fontSize: 12, fontWeight: 700,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          <ExternalLink size={13} />
          Career Page
        </a>

        {/* Search Jobs — within JobXPortal */}
        <Link
          to={`/jobs?q=${encodeURIComponent(company.search)}&where=india`}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "8px", background: "none",
            border: "1px solid var(--border)", color: "var(--text)",
            borderRadius: 9, textDecoration: "none",
            fontFamily: "Poppins", fontSize: 12, fontWeight: 600,
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--teal)"; e.currentTarget.style.color = "var(--teal)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text)"; }}
        >
          Search Jobs
        </Link>
      </div>
    </div>
  );
}

export default function Companies() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [activeGroup, setActiveGroup] = useState("All");

  const filtered = useMemo(() => {
    let list = COMPANIES;

    if (activeGroup !== "All") {
      const industries = INDUSTRY_GROUPS[activeGroup] || [];
      list = list.filter((c) => industries.includes(c.industry));
    }

    if (keyword.trim()) {
      list = list.filter((c) =>
        (c.name + " " + c.industry + " " + c.location)
          .toLowerCase()
          .includes(keyword.toLowerCase())
      );
    }

    return list;
  }, [keyword, activeGroup]);

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>

          <button onClick={() => navigate(-1)} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--muted)",
            background: "none", border: "none", cursor: "pointer", marginBottom: 24,
            letterSpacing: "0.08em",
          }}>
            <ArrowLeft size={14} /> Back
          </button>

          <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
            COMPANY CAREERS
          </p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: 6 }}>
            Top Companies Hiring
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24, maxWidth: 560 }}>
            {filtered.length} companies · Click <strong style={{ color: "var(--accent)" }}>Career Page</strong> for direct applications or <strong style={{ color: "var(--teal)" }}>Search Jobs</strong> to find live listings on JobXPortal.
          </p>

          {/* SEARCH */}
          <div style={{ position: "relative", maxWidth: 480, marginBottom: 20 }}>
            <Search size={15} style={{
              position: "absolute", left: 14, top: "50%",
              transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none",
            }} />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search companies, industry or city..."
              style={{
                width: "100%", paddingLeft: 40, paddingRight: 16,
                paddingTop: 11, paddingBottom: 11,
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 12, color: "var(--text)",
                fontFamily: "Poppins", fontSize: 13, outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
            />
          </div>

          {/* INDUSTRY GROUP PILLS */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
            {Object.keys(INDUSTRY_GROUPS).map((group) => (
              <button
                key={group}
                onClick={() => setActiveGroup(group)}
                style={{
                  padding: "6px 14px", borderRadius: 999,
                  border: `1px solid ${activeGroup === group ? "var(--accent)" : "var(--border)"}`,
                  background: activeGroup === group ? "var(--accent)" : "transparent",
                  color: activeGroup === group ? "#09090B" : "var(--muted)",
                  fontFamily: "Poppins", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (activeGroup !== group) {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.color = "var(--text)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeGroup !== group) {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--muted)";
                  }
                }}
              >
                {group}
                <span style={{
                  marginLeft: 6, fontFamily: "JetBrains Mono",
                  fontSize: 10, opacity: 0.7,
                }}>
                  {group === "All"
                    ? COMPANIES.length
                    : COMPANIES.filter((c) => (INDUSTRY_GROUPS[group] || []).includes(c.industry)).length
                  }
                </span>
              </button>
            ))}
          </div>

          {/* GRID */}
          {filtered.length === 0 ? (
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 16, padding: "40px", textAlign: "center",
            }}>
              <Building2 size={32} style={{ color: "var(--muted)", margin: "0 auto 12px", display: "block" }} />
              <p style={{ color: "var(--muted)", fontFamily: "Poppins" }}>No companies match your search.</p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 14,
            }}>
              {filtered.map((company) => (
                <CompanyCard key={company.name} company={company} />
              ))}
            </div>
          )}

        </div>
        <Footer />
      </div>
    </>
  );
}