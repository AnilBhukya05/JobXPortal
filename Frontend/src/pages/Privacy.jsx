import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Privacy() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Information We Collect",
      body: "JobXPortal may collect information that you provide when you create an account, use career tools, save jobs, track applications, create an employer profile, or post a job. This may include your name, email address, account role, profile information, resume information, job preferences, saved jobs, application-related information, and employer-provided job information.",
    },
    {
      title: "2. How We Use Information",
      body: "We use information to create and manage user accounts, provide job-search and career features, save bookmarks and application activity, provide resume and career tools, support employer job postings, communicate with users about their accounts, maintain website security, and improve the functionality of JobXPortal.",
    },
    {
      title: "3. Job Listings and Third-Party Sources",
      body: "JobXPortal displays job opportunities obtained from supported external job-data providers and employer-posted listings. External job information may include job title, company, location, description, salary information when available, posting date, and an external application link. When you select an external application link, you may be directed to another website. That website has its own privacy policy and terms, and JobXPortal does not control how that third party processes your information.",
    },
    {
      title: "4. Employer and Job Seeker Information",
      body: "Job seekers may choose to provide profile, resume, application, or other career information through JobXPortal. Employers may provide company and job-posting information. Information that is intentionally made public through a profile or job listing may be visible to other users. Do not submit unnecessary sensitive personal information through the website.",
    },
    {
      title: "5. Cookies and Similar Technologies",
      body: "JobXPortal may use cookies, local storage, session storage, and similar technologies that are necessary to operate features such as authentication, preferences, saved jobs, and website functionality. Advertising and consent-related technologies may also use cookies or similar technologies where applicable.",
    },
    {
      title: "6. Advertising and Google AdSense",
      body: "JobXPortal may display advertisements through Google AdSense. Advertising providers may use cookies or similar technologies to provide, measure, and personalize advertising, subject to applicable settings and consent requirements. JobXPortal uses Google's consent-management functionality for users in regions where consent is required. Users can manage applicable advertising consent choices through the consent controls provided on the website.",
    },
    {
      title: "7. Data Sharing",
      body: "JobXPortal does not sell personal information as a business practice. Information may be processed by service providers that help operate the website, hosting, authentication, job-data services, advertising, email, or other requested functionality. Information may also be disclosed when required by applicable law or when necessary to protect the security and integrity of the service.",
    },
    {
      title: "8. Data Security",
      body: "We take reasonable measures to protect information used by JobXPortal. However, no internet-based service can guarantee absolute security. Users should use strong passwords and avoid submitting unnecessary sensitive information.",
    },
    {
      title: "9. Data Retention and Account Deletion",
      body: "We retain account and feature-related information for as long as reasonably necessary to provide the requested services, maintain records, comply with applicable obligations, and protect the service. You may request deletion of your JobXPortal account and associated personal information through the Contact page, subject to information that we may be required or permitted to retain.",
    },
    {
      title: "10. Your Choices and Rights",
      body: "Depending on applicable law, you may have rights relating to access, correction, deletion, or restriction of your personal information. You may also manage applicable advertising consent choices through the consent controls provided on the website.",
    },
    {
      title: "11. External Websites",
      body: "JobXPortal may contain links to external job portals, employer websites, career pages, and other third-party services. We are not responsible for the privacy practices, content, security, or availability of external websites. Review the privacy policy of the relevant third party before providing personal information.",
    },
    {
      title: "12. Changes to This Privacy Policy",
      body: "We may update this Privacy Policy when JobXPortal's features, services, advertising configuration, or applicable requirements change. The updated version will be published on this page with a revised 'Last updated' date.",
    },
    {
      title: "13. Contact",
      body: "If you have questions about this Privacy Policy, your personal information, or an account-deletion request, please contact JobXPortal through the Contact page available on this website.",
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
            Privacy Policy
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