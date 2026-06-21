import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SplitFlap from "../components/SplitFlap";
import { Radar, Layers, CheckCircle2 } from "lucide-react";

const steps = [
  {
    n: "01",
    title: "We scan every gate",
    desc: "LinkedIn, Naukri, Foundit, Indeed, Wellfound and company career pages, checked continuously.",
    icon: Radar,
  },
  {
    n: "02",
    title: "We normalize the listing",
    desc: "Titles, locations and salary bands are cleaned up so jobs from different sources read the same way.",
    icon: Layers,
  },
  {
    n: "03",
    title: "It lands on your board",
    desc: "One search, one list, ranked by how recently it was posted.",
    icon: CheckCircle2,
  },
];

export default function About() {
  return (
    <>
      <Navbar />
      <div className="bg-[#0B0E14] min-h-screen text-[#F5F3EE]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="font-mono text-xs tracking-widest text-[#8A8F9C] mb-3">
            ABOUT THE BOARD
          </p>
          <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight mb-6">
            Built for{" "}
            <SplitFlap
              words={[
                "JOB SEEKERS",
                "CAREER CHANGERS",
                "FRESH GRADS",
                "REMOTE WORKERS",
              ]}
              className="text-[#FFB020]"
            />
          </h1>
          <p className="text-[#8A8F9C] text-lg max-w-2xl mb-16">
            OmniJobs exists because checking six different job sites every
            morning is a waste of a job search. We pull listings into one
            board so you can spend your time on applications, not tabs.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.n}
                className="bg-[#12151D] border border-[#1E2330] rounded-2xl p-7"
              >
                <span className="font-mono text-xs text-[#FFB020]">
                  {step.n}
                </span>
                <step.icon className="text-[#2DD4BF] mt-4 mb-4" size={28} />
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-[#8A8F9C] text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}