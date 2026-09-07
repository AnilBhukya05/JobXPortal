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

import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import AuthGate from "./components/AuthGate";
import EmployerGate from "./components/EmployerGate";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full overflow-x-hidden">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:portal" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/remote" element={<Remote />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/salary-insights" element={<SalaryInsights />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/faqs" element={<FAQ />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/company/:employerId" element={<CompanyProfile />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          <Route path="/resume-match" element={
            <AuthGate featureName="Resume Match">
              <ResumeMatch />
            </AuthGate>
          } />
          <Route path="/resume-builder" element={
            <AuthGate featureName="Resume Builder">
              <ResumeBuilder />
            </AuthGate>
          } />
          <Route path="/interview-prep" element={
            <AuthGate featureName="Interview Prep">
              <InterviewPrep />
            </AuthGate>
          } />
          <Route path="/cover-letter" element={
            <AuthGate featureName="Cover Letter Generator">
              <CoverLetter />
            </AuthGate>
          } />
          <Route path="/tracker" element={
            <AuthGate featureName="Job Tracker">
              <Tracker />
            </AuthGate>
          } />
          <Route path="/bookmarks" element={
            <AuthGate featureName="Bookmarks">
              <Bookmarks />
            </AuthGate>
          } />
          <Route path="/profile" element={
            <AuthGate featureName="Profile">
              <Profile />
            </AuthGate>
          } />

          <Route path="/post-job" element={
            <EmployerGate featureName="Post a Job">
              <PostJob />
            </EmployerGate>
          } />
          <Route path="/employer/dashboard" element={
            <EmployerGate featureName="Employer Dashboard">
              <EmployerDashboard />
            </EmployerGate>
          } />
        </Routes>
        <ScrollToTopButton />
      </div>
    </BrowserRouter>
  );
}

export default App;