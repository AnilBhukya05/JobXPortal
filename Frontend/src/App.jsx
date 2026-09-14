import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import JobLanding from "./pages/JobLanding";
import Companies from "./pages/Companies";
import Remote from "./pages/Remote";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Bookmarks from "./pages/Bookmarks";
import ResumeMatch from "./pages/ResumeMatch";
import Tracker from "./pages/Tracker";
import InterviewPrep from "./pages/InterviewPrep";
import CoverLetter from "./pages/CoverLetter";
import ResumeBuilder from "./pages/ResumeBuilder";
import Profile from "./pages/Profile";
import SalaryInsights from "./pages/SalaryInsights";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostJob from "./pages/PostJob";
import EmployerDashboard from "./pages/EmployerDashboard";
import FAQ from "./pages/FAQ";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import CompanyProfile from "./pages/CompanyProfile";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import PublicProfile from "./pages/PublicProfile";

import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import AuthGate from "./components/AuthGate";
import EmployerGate from "./components/EmployerGate";
import SEO from "./components/SEO";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full overflow-x-hidden">
        <ScrollToTop />

        <Routes>

          <Route path="/u/:userId" element={<PublicProfile />} />

          <Route
            path="/"
            element={
              <>
                <SEO
                  title="JobXPortal — Find Jobs, Hire Talent & Build Your Career"
                  description="Find jobs from multiple sources, discover company career opportunities, post jobs as an employer, and use AI-powered career tools with JobXPortal."
                  path="/"
                />
                <Home />
              </>
            }
          />

          <Route
            path="/jobs"
            element={
              <>
                <SEO
                  title="Find Jobs in India — Latest Jobs & Career Opportunities | JobXPortal"
                  description="Search the latest jobs in India across multiple job sources and company career pages. Find IT, software, fresher, remote and other career opportunities on JobXPortal."
                  path="/jobs"
                />
                <Jobs />
              </>
            }
          />

          <Route
            path="/jobs/source/:portal"
            element={
              <>
                <SEO
                  title="Latest Jobs & Career Opportunities | JobXPortal"
                  description="Explore the latest job opportunities and career openings on JobXPortal."
                  path="/jobs"
                />
                <Jobs />
              </>
            }
          />

          <Route path="/jobs/:role/:location" element={<JobLanding />} />

          <Route path="/jobs/:role" element={<JobLanding />} />

          <Route
            path="/job/:id"
            element={
              <>
                <SEO
                  title="Job Opportunity | JobXPortal"
                  description="View job details, requirements, location and application information on JobXPortal."
                  path="/job"
                />
                <JobDetails />
              </>
            }
          />

          <Route
            path="/companies"
            element={
              <>
                <SEO
                  title="Companies Hiring — Explore Companies & Careers | JobXPortal"
                  description="Explore companies, discover career opportunities and find jobs from employers hiring across India with JobXPortal."
                  path="/companies"
                />
                <Companies />
              </>
            }
          />

          <Route
            path="/company/:employerId"
            element={
              <>
                <SEO
                  title="Company Profile & Jobs | JobXPortal"
                  description="Explore company information, job openings and career opportunities on JobXPortal."
                  path="/company"
                />
                <CompanyProfile />
              </>
            }
          />

          <Route
            path="/remote"
            element={
              <>
                <SEO
                  title="Remote Jobs in India — Work From Home Opportunities | JobXPortal"
                  description="Find remote and work-from-home job opportunities in India. Search remote software, IT, developer and other jobs on JobXPortal."
                  path="/remote"
                />
                <Remote />
              </>
            }
          />

          <Route
            path="/salary-insights"
            element={
              <>
                <SEO
                  title="Salary Insights — Compare Job Salaries | JobXPortal"
                  description="Explore salary insights and compare compensation for different jobs, skills and career opportunities."
                  path="/salary-insights"
                />
                <SalaryInsights />
              </>
            }
          />

          <Route
            path="/post-job"
            element={
              <>
                <SEO
                  title="Post a Job & Hire Talent | JobXPortal"
                  description="Employers can create a JobXPortal account, post job openings and connect with candidates looking for their next career opportunity."
                  path="/post-job"
                  noindex
                />
                <EmployerGate featureName="Post a Job">
                  <PostJob />
                </EmployerGate>
              </>
            }
          />

          <Route
            path="/about"
            element={
              <>
                <SEO
                  title="About JobXPortal — Jobs & Hiring Platform"
                  description="Learn about JobXPortal, an all-in-one career platform connecting job seekers with opportunities and helping employers find talent."
                  path="/about"
                />
                <About />
              </>
            }
          />

          <Route
            path="/contact"
            element={
              <>
                <SEO
                  title="Contact JobXPortal"
                  description="Get in touch with the JobXPortal team for questions, feedback, partnerships and support."
                  path="/contact"
                />
                <Contact />
              </>
            }
          />

          <Route
            path="/faqs"
            element={
              <>
                <SEO
                  title="JobXPortal FAQs — Frequently Asked Questions"
                  description="Find answers to frequently asked questions about JobXPortal, job searching, employer job posting and career tools."
                  path="/faqs"
                />
                <FAQ />
              </>
            }
          />

          <Route
            path="/terms"
            element={
              <>
                <SEO
                  title="Terms of Service | JobXPortal"
                  description="Read the terms and conditions for using JobXPortal."
                  path="/terms"
                />
                <Terms />
              </>
            }
          />

          <Route
            path="/privacy"
            element={
              <>
                <SEO
                  title="Privacy Policy | JobXPortal"
                  description="Read the JobXPortal privacy policy and learn how information is handled."
                  path="/privacy"
                />
                <Privacy />
              </>
            }
          />

          <Route
            path="/login"
            element={
              <>
                <SEO title="Login | JobXPortal" path="/login" noindex />
                <Login />
              </>
            }
          />

          <Route
            path="/register"
            element={
              <>
                <SEO
                  title="Create Account | JobXPortal"
                  path="/register"
                  noindex
                />
                <Register />
              </>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <>
                <SEO
                  title="Forgot Password | JobXPortal"
                  path="/forgot-password"
                  noindex
                />
                <ForgotPassword />
              </>
            }
          />

          <Route
            path="/reset-password"
            element={
              <>
                <SEO
                  title="Reset Password | JobXPortal"
                  path="/reset-password"
                  noindex
                />
                <ResetPassword />
              </>
            }
          />

          <Route
            path="/verify-email/:token"
            element={
              <>
                <SEO
                  title="Verify Email | JobXPortal"
                  path="/verify-email"
                  noindex
                />
                <VerifyEmail />
              </>
            }
          />

          <Route
            path="/resume-match"
            element={
              <>
                <SEO
                  title="AI Resume Match | JobXPortal"
                  path="/resume-match"
                  noindex
                />
                <AuthGate featureName="Resume Match">
                  <ResumeMatch />
                </AuthGate>
              </>
            }
          />

          <Route
            path="/resume-builder"
            element={
              <>
                <SEO
                  title="Resume Builder | JobXPortal"
                  path="/resume-builder"
                  noindex
                />
                <AuthGate featureName="Resume Builder">
                  <ResumeBuilder />
                </AuthGate>
              </>
            }
          />

          <Route
            path="/interview-prep"
            element={
              <>
                <SEO
                  title="Interview Preparation | JobXPortal"
                  path="/interview-prep"
                  noindex
                />
                <AuthGate featureName="Interview Prep">
                  <InterviewPrep />
                </AuthGate>
              </>
            }
          />

          <Route
            path="/cover-letter"
            element={
              <>
                <SEO
                  title="AI Cover Letter Generator | JobXPortal"
                  path="/cover-letter"
                  noindex
                />
                <AuthGate featureName="Cover Letter Generator">
                  <CoverLetter />
                </AuthGate>
              </>
            }
          />

          <Route
            path="/tracker"
            element={
              <>
                <SEO
                  title="Job Application Tracker | JobXPortal"
                  path="/tracker"
                  noindex
                />
                <AuthGate featureName="Job Tracker">
                  <Tracker />
                </AuthGate>
              </>
            }
          />

          <Route
            path="/bookmarks"
            element={
              <>
                <SEO
                  title="Saved Jobs | JobXPortal"
                  path="/bookmarks"
                  noindex
                />
                <AuthGate featureName="Bookmarks">
                  <Bookmarks />
                </AuthGate>
              </>
            }
          />

          <Route
            path="/profile"
            element={
              <>
                <SEO title="My Profile | JobXPortal" path="/profile" noindex />
                <AuthGate featureName="Profile">
                  <Profile />
                </AuthGate>
              </>
            }
          />

          <Route
            path="/employer/dashboard"
            element={
              <>
                <SEO
                  title="Employer Dashboard | JobXPortal"
                  path="/employer/dashboard"
                  noindex
                />
                <EmployerGate featureName="Employer Dashboard">
                  <EmployerDashboard />
                </EmployerGate>
              </>
            }
          />
        </Routes>

        <ScrollToTopButton />
        <Chatbot />
      </div>
    </BrowserRouter>
  );
}

export default App;
