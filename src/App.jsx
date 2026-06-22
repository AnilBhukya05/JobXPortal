import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Companies from "./pages/Companies";
import Remote from "./pages/Remote";
import About from "./pages/About";

import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:portal" element={<Jobs />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/remote" element={<Remote />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <ScrollToTopButton />
    </BrowserRouter>
  );
}

export default App;