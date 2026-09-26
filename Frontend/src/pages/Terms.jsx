import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Terms() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Using JobXPortal",
      body: "JobXPortal provides job-search, career, and employer-related features. By using the website, you agree to use the service lawfully and responsibly and not to misuse, disrupt, or attempt to gain unauthorized access to the platform.",
    },
    {
      title: "2. User Accounts",
      body: "You are responsible for providing accurate information when creating an account and for keeping your account credentials secure. You are responsible for activity carried out through your account and should notify JobXPortal if you believe your account has been accessed without authorization.",
    },
    {
      title: "3. Job Seeker Information",
      body: "Job seekers may create profiles, save jobs, track applications, use career tools, and provide resume or other career-related information. Users are responsible for ensuring that information they submit is accurate and does not contain unlawful, fraudulent, or misleading content.",
    },
    {
      title: "4. Employer Accounts and Job Postings",
      body: "Employers are responsible for the accuracy, legality, and completeness of jobs they post on JobXPortal. Employers must not publish fraudulent, misleading, discriminatory, unlawful, or deceptive job opportunities. JobXPortal may review, restrict, remove, or refuse listings that violate these terms or create a security or trust concern.",
    },
    {
      title: "5. External Job Listings",
      body: "JobXPortal may display job opportunities obtained from supported external job-data providers. JobXPortal does not control all external listings and cannot guarantee that every external listing remains available, accurate, complete, current, or suitable for a particular user. Users should verify important job information with the relevant employer or external source before applying.",
    },
    {
      title: "6. External Websites and Applications",
      body: "Some jobs may direct users to external employer websites, career pages, or other third-party services. When you leave JobXPortal, the third party's terms, privacy policy, application process, and security practices apply. JobXPortal is not responsible for the content, availability, security, or conduct of external websites.",
    },
    {
      title: "7. Advertising",
      body: "JobXPortal may display advertisements provided by third-party advertising services, including Google AdSense. Advertisements are provided separately from JobXPortal's job listings and editorial content. Advertising availability and content may vary based on the website, user settings, consent choices, and applicable advertising policies.",
    },
    {
      title: "8. Prohibited Activities",
      body: "Users must not use JobXPortal to post fraudulent jobs, impersonate another person or organization, distribute malicious software, attempt unauthorized access, scrape or abuse the service, interfere with website operation, or use the platform for unlawful purposes.",
    },
    {
      title: "9. Content and Intellectual Property",
      body: "The JobXPortal website, including its original interface, branding, design, software, and original content, may be protected by applicable intellectual-property laws. Users retain responsibility for content they submit and must have the necessary rights to submit that content.",
    },
    {
      title: "10. Service Availability",
      body: "JobXPortal may change, suspend, modify, or discontinue features when necessary for maintenance, security, technical changes, or other operational reasons. External job-data services may also become unavailable or change their data without notice.",
    },
    {
      title: "11. No Guarantee of Employment",
      body: "JobXPortal does not guarantee interviews, employment, compensation, hiring outcomes, application acceptance, or the accuracy of every external job listing. Users are responsible for evaluating job opportunities and employers before applying or sharing information.",
    },
    {
      title: "12. Limitation of Liability",
      body: "To the extent permitted by applicable law, JobXPortal is not responsible for losses resulting from external job listings, third-party websites, employer conduct, hiring decisions, application outcomes, or temporary unavailability of external services.",
    },
    {
      title: "13. Changes to These Terms",
      body: "JobXPortal may update these Terms of Service when features, services, or applicable requirements change. Updated terms will be published on this page with a revised 'Last updated' date. Continued use of the service after an update constitutes use under the updated terms to the extent permitted by applicable law.",
    },
    {
      title: "14. Contact",
      body: "If you have questions about these Terms of Service, please contact JobXPortal through the Contact page available on this website.",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F8FAFF] px-6 py-8 pb-16 text-[#0B132B]">
        <div className="mx-auto max-w-3xl">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 border-none bg-transparent font-mono text-xs text-slate-500 transition-colors duration-200 hover:text-indigo-600"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          {/* Header */}
          <h1 className="mb-4 font-['Poppins'] text-3xl font-extrabold text-[#0B132B]">
            Terms of Service
          </h1>

          <p className="mb-8 font-['Poppins'] text-[13px] text-slate-500">
            Last updated: September 2026
          </p>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-[14px] border border-[#E2E6F0] bg-white px-[22px] py-5 shadow-[0_4px_14px_rgba(15,23,42,0.035)] transition-all duration-200 hover:border-indigo-200 hover:shadow-[0_8px_24px_rgba(79,70,229,0.07)]"
              >
                <h2 className="mb-2 font-['Poppins'] text-base font-bold text-[#0B132B]">
                  {section.title}
                </h2>

                <p className="m-0 font-['Poppins'] text-sm leading-[1.7] text-slate-500">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}