import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please accept the terms to continue.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1100);
  }

  return (
    <>
      <Navbar />

      <div className="bg-[#0B0E14] min-h-screen text-[#F5F3EE] relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#2DD4BF]/5 blur-[160px] rounded-full pointer-events-none" />

        <div className="max-w-md mx-auto px-6 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#12151D] border border-[#1E2330] rounded-3xl overflow-hidden"
          >
            {/* TICKET HEADER */}
            <div className="p-8 pb-6">
              <p className="font-mono text-[11px] tracking-widest text-[#8A8F9C] mb-4">
                NEW BOARDING PASS
              </p>

              <div className="flex items-center justify-between font-mono text-sm">
                <div>
                  <p className="text-[#5b606e] text-[11px] mb-1">FROM</p>
                  <p className="text-[#F5F3EE] font-bold">NEW USER</p>
                </div>
                <div className="text-[#8A8F9C]">-----&gt;</div>
                <div className="text-right">
                  <p className="text-[#5b606e] text-[11px] mb-1">TO</p>
                  <p className="text-[#2DD4BF] font-bold">JOBXPORTAL</p>
                </div>
              </div>

              <h1 className="font-display text-2xl font-bold mt-6">
                Create your account
              </h1>
              <p className="text-[#8A8F9C] text-sm mt-1">
                One board. Every opening. Takes about a minute.
              </p>
            </div>

            {/* PERFORATED DIVIDER */}
            <div className="relative">
              <div className="border-t border-dashed border-[#1E2330]" />
              <span className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-[#0B0E14]" />
              <span className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-[#0B0E14]" />
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-8 pt-6">
              <div className="mb-4">
                <label className="text-xs font-mono text-[#8A8F9C] block mb-2">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-[#0B0E14] border border-[#1E2330] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] placeholder:text-[#5b606e] outline-none focus:border-[#2DD4BF] transition-colors duration-300"
                />
              </div>

              <div className="mb-4">
                <label className="text-xs font-mono text-[#8A8F9C] block mb-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#0B0E14] border border-[#1E2330] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] placeholder:text-[#5b606e] outline-none focus:border-[#2DD4BF] transition-colors duration-300"
                />
              </div>

              <div className="mb-4">
                <label className="text-xs font-mono text-[#8A8F9C] block mb-2">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-[#0B0E14] border border-[#1E2330] rounded-xl px-4 py-3 pr-11 text-sm text-[#F5F3EE] placeholder:text-[#5b606e] outline-none focus:border-[#2DD4BF] transition-colors duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8F9C] hover:text-[#F5F3EE] transition"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <label className="text-xs font-mono text-[#8A8F9C] block mb-2">
                  CONFIRM PASSWORD
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full bg-[#0B0E14] border border-[#1E2330] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] placeholder:text-[#5b606e] outline-none focus:border-[#2DD4BF] transition-colors duration-300"
                />
              </div>

              <label className="flex items-start gap-2.5 mb-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed((a) => !a)}
                  className="accent-[#2DD4BF] mt-0.5"
                />
                <span className="text-xs text-[#8A8F9C]">
                  I agree to the terms of service and privacy policy.
                </span>
              </label>

              {error && (
                <p className="text-xs text-[#fb7185] mb-4 font-mono">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#2DD4BF] text-[#0B0E14] py-3.5 rounded-xl font-semibold hover:bg-[#5eead4] transition-all duration-300 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Printing pass...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="text-center text-sm text-[#8A8F9C] mt-6">
                Already boarding?{" "}
                <Link to="/login" className="text-[#FFB020] hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  );
}