import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
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
import Candidates from "./pages/Candidates";

import Careers from "./pages/Careers";
import CareerDetails from "./pages/CareerDetails";
import CareerApplication from "./pages/CareerApplication";

import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCareers from "./pages/AdminCareers";
import AdminCareerForm from "./pages/AdminCareerForm";
import AdminApplications from "./pages/AdminApplications";

import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import AuthGate from "./components/AuthGate";
import EmployerGate from "./components/EmployerGate";
import SEO from "./components/SEO";
import Chatbot from "./components/Chatbot";
import AdminRoute from "./components/AdminRoute";

import MyServices from "./pages/MyServices";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full overflow-x-hidden">
        <ScrollToTop />

        <Routes>
          <Route path="/services" element={<MyServices />} />

          {/* Public profile */}
          <Route path="/u/:userId" element={<PublicProfile />} />

          {/* Home */}
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

          {/* Candidates */}
          <Route
            path="/candidates"
            element={
              <EmployerGate featureName="Browse Candidates">
                <Candidates />
              </EmployerGate>
            }
          />

          {/* Jobs */}
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

          {/* Job source */}
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

          {/* Role and location */}
          <Route path="/jobs/:role/:location" element={<Jobs />} />

          {/* Role jobs */}
          <Route path="/jobs/:role" element={<Jobs />} />

          {/* Job details */}
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

          {/* Companies */}
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

          {/* Company profile */}
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

          {/* Remote */}
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

          {/* Salary insights */}
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

          {/* Post job */}
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

          {/* About */}
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

          {/* Contact */}
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

          {/* FAQ */}
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

          {/* Terms */}
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

          {/* Privacy */}
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

          {/* Login */}
          <Route
            path="/login"
            element={
              <>
                <SEO title="Login | JobXPortal" path="/login" noindex />

                <Login />
              </>
            }
          />

          {/* Register */}
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

          {/* Forgot password */}
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

          {/* Reset password */}
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

          {/* Verify email */}
          <Route
            path="/verify-email"
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

          {/* Resume match */}
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

          {/* Resume builder */}
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

          {/* Interview prep */}
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

          {/* Cover letter */}
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

          {/* Tracker */}
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

          {/* Bookmarks */}
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

          {/* Profile */}
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

          {/* Careers */}
          <Route
            path="/careers"
            element={
              <>
                <SEO
                  title="Careers at JobXPortal — Join Our Team"
                  description="Explore career opportunities at JobXPortal and join our team building the future of job search and hiring."
                  path="/careers"
                />

                <Careers />
              </>
            }
          />

          <Route
            path="/careers/:slug"
            element={
              <>
                <SEO
                  title="Career Opportunity | JobXPortal"
                  description="Explore this career opportunity at JobXPortal."
                  path="/careers"
                />

                <CareerDetails />
              </>
            }
          />

          <Route
            path="/careers/:slug/apply"
            element={
              <>
                <SEO
                  title="Apply | JobXPortal Careers"
                  description="Apply for a career opportunity at JobXPortal."
                  path="/careers"
                  noindex
                />

                <CareerApplication />
              </>
            }
          />

          {/* Admin login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin panel */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />

            <Route path="dashboard" element={<AdminDashboard />} />

            <Route path="careers" element={<AdminCareers />} />

            <Route path="careers/new" element={<AdminCareerForm />} />

            <Route path="careers/:id/edit" element={<AdminCareerForm />} />

            <Route path="applications" element={<AdminApplications />} />
          </Route>

          {/* Employer dashboard */}
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
