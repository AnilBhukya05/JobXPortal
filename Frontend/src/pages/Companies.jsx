import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Search, ExternalLink, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  All: null,
  "IT Services": ["IT"],
  "Global Tech": ["Tech"],
  Startups: [
    "E-commerce",
    "FoodTech",
    "FinTech",
    "EdTech",
    "SaaS",
    "Quick Commerce",
    "Transport",
    "EV",
  ],
  "Banking & Finance": ["Banking", "Finance"],
  Consulting: ["Consulting"],
  Manufacturing: [
    "Automotive",
    "Manufacturing",
    "FMCG",
    "Pharma",
    "Conglomerate",
  ],
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
      <motion.div
        whileHover={{ scale: 1.08, rotate: 2 }}
        transition={{ duration: 0.2 }}
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          flexShrink: 0,
          background: "linear-gradient(135deg, #EEF2FF, #ECFDF5)",
          border: "1px solid #D9DFEA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Poppins",
          fontWeight: 800,
          fontSize: 18,
          color: "#4F46E5",
        }}
      >
        {initial}
      </motion.div>
    );
  }

  return (
    <motion.img
      src={sources[srcIndex]}
      alt={name}
      onError={() => setSrcIndex((i) => i + 1)}
      whileHover={{ scale: 1.08, rotate: 2 }}
      transition={{ duration: 0.2 }}
      style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        flexShrink: 0,
        objectFit: "contain",
        background: "#FFFFFF",
        padding: 4,
        border: "1px solid #E2E8F0",
      }}
    />
  );
}

function CompanyCard({ company }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 25, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.97 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 },
      }}
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 14,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 4px 14px rgba(15,23,42,0.04)",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#4F46E5";
        e.currentTarget.style.boxShadow =
          "0 14px 35px rgba(79,70,229,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#E2E8F0";
        e.currentTarget.style.boxShadow =
          "0 4px 14px rgba(15,23,42,0.04)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <CompanyLogo
          name={company.name}
          domain={company.domain}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontFamily: "Poppins",
              fontSize: 14,
              fontWeight: 700,
              color: "#0B132B",
              marginBottom: 2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {company.name}
          </h3>

          <p
            style={{
              fontFamily: "Poppins",
              fontSize: 12,
              color: "#64748B",
            }}
          >
            {company.location}
          </p>
        </div>

        <motion.span
          whileHover={{ scale: 1.05 }}
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 10,
            padding: "3px 8px",
            borderRadius: 5,
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            color: "#64748B",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          {company.industry}
        </motion.span>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <motion.a
          href={company.url}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "8px",
            background: "#4F46E5",
            color: "#FFFFFF",
            borderRadius: 9,
            textDecoration: "none",
            fontFamily: "Poppins",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <ExternalLink size={13} />
          Career Page
        </motion.a>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{ flex: 1 }}
        >
          <Link
            to={`/jobs?q=${encodeURIComponent(company.search)}&where=india`}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              boxSizing: "border-box",
              background: "#FFFFFF",
              border: "1px solid #D9DFEA",
              color: "#0B132B",
              borderRadius: 9,
              textDecoration: "none",
              fontFamily: "Poppins",
              fontSize: 12,
              fontWeight: 600,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#14B8A6";
              e.currentTarget.style.color = "#0F766E";
              e.currentTarget.style.background = "#F0FDFA";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#D9DFEA";
              e.currentTarget.style.color = "#0B132B";
              e.currentTarget.style.background = "#FFFFFF";
            }}
          >
            Search Jobs
          </Link>
        </motion.div>
      </div>
    </motion.div>
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
      list = list.filter((c) =>
        industries.includes(c.industry)
      );
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background: "#F8FAFF",
          minHeight: "100vh",
          color: "#0B132B",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "32px 24px 64px",
          }}
        >
          <motion.button
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate(-1)}
            whileHover={{ x: -3 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "JetBrains Mono",
              fontSize: 12,
              color: "#64748B",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginBottom: 24,
              letterSpacing: "0.08em",
            }}
          >
            <ArrowLeft size={14} />
            Back
          </motion.button>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "#64748B",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            COMPANY CAREERS
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 800,
              marginBottom: 6,
              color: "#0B132B",
            }}
          >
            Top Companies Hiring
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              color: "#64748B",
              fontSize: 14,
              marginBottom: 24,
              maxWidth: 560,
            }}
          >
            {filtered.length} companies · Click{" "}
            <strong style={{ color: "#4F46E5" }}>
              Career Page
            </strong>{" "}
            for direct applications or{" "}
            <strong style={{ color: "#0F766E" }}>
              Search Jobs
            </strong>{" "}
            to find live listings on JobXPortal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              position: "relative",
              maxWidth: 480,
              marginBottom: 20,
            }}
          >
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748B",
                pointerEvents: "none",
              }}
            />

            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search companies, industry or city..."
              style={{
                width: "100%",
                paddingLeft: 40,
                paddingRight: 16,
                paddingTop: 11,
                paddingBottom: 11,
                background: "#FFFFFF",
                border: "1px solid #D9DFEA",
                borderRadius: 12,
                color: "#0B132B",
                fontFamily: "Poppins",
                fontSize: 13,
                outline: "none",
                transition:
                  "border-color 0.15s, box-shadow 0.15s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#4F46E5";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(79,70,229,0.10)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#D9DFEA";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.06,
                  delayChildren: 0.25,
                },
              },
            }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 28,
            }}
          >
            {Object.keys(INDUSTRY_GROUPS).map((group) => (
              <motion.button
                key={group}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 10,
                    scale: 0.95,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  },
                }}
                whileHover={{
                  y: -2,
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                onClick={() => setActiveGroup(group)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: `1px solid ${
                    activeGroup === group
                      ? "#4F46E5"
                      : "#D9DFEA"
                  }`,
                  background:
                    activeGroup === group
                      ? "#4F46E5"
                      : "#FFFFFF",
                  color:
                    activeGroup === group
                      ? "#FFFFFF"
                      : "#64748B",
                  fontFamily: "Poppins",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow:
                    activeGroup === group
                      ? "0 4px 12px rgba(79,70,229,0.16)"
                      : "none",
                }}
              >
                {group}

                <span
                  style={{
                    marginLeft: 6,
                    fontFamily: "JetBrains Mono",
                    fontSize: 10,
                    opacity: 0.7,
                  }}
                >
                  {group === "All"
                    ? COMPANIES.length
                    : COMPANIES.filter((c) =>
                        (
                          INDUSTRY_GROUPS[group] || []
                        ).includes(c.industry)
                      ).length}
                </span>
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{
                  opacity: 0,
                  y: 15,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: 16,
                  padding: "40px",
                  textAlign: "center",
                  boxShadow:
                    "0 4px 18px rgba(15,23,42,0.04)",
                }}
              >
                <Building2
                  size={32}
                  style={{
                    color: "#94A3B8",
                    margin: "0 auto 12px",
                    display: "block",
                  }}
                />

                <p
                  style={{
                    color: "#64748B",
                    fontFamily: "Poppins",
                  }}
                >
                  No companies match your search.
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 14,
                }}
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((company) => (
                    <CompanyCard
                      key={company.name}
                      company={company}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Footer />
      </motion.div>
    </>
  );
}