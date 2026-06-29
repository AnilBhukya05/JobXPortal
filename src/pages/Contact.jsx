import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, User, Send, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import emailjs from "@emailjs/browser";

const topics = [
  "General Question",
  "Job Listing Issue",
  "Wrong Job Details",
  "Suggest a Feature",
  "Report a Bug",
  "Partnership Inquiry",
  "Other",
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      return "Please enter a valid email address.";
    if (!form.topic) return "Please select a topic.";
    if (!form.message.trim() || form.message.trim().length < 10)
      return "Message must be at least 10 characters.";
    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          topic: form.topic,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setLoading(false);
        setSubmitted(true);
      })
      .catch((err) => {
        setLoading(false);
        setError("Failed to send message. Please try again or email us directly.");
        console.error("EmailJS error:", err);
      });
  }

  return (
    <>
      <Navbar />
      <div className="bg-[#0B0E14] min-h-screen text-[#F5F3EE]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">

          {/* HEADER */}
          <p className="font-mono text-xs tracking-widest text-[#8A8F9C] mb-3">
            GET IN TOUCH
          </p>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-[#8A8F9C] max-w-xl mb-12 md:mb-16 text-sm md:text-base">
            Have a question, spotted a wrong listing, or want to suggest
            something? Fill in the form and we will get back to you.
          </p>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">

            {/* LEFT — INFO CARDS */}
            <div className="flex flex-col gap-4">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  value: "anilbhukya1106@gmail.com",
                  sub: "We reply within 24 hours",
                },
                {
                  icon: MessageSquare,
                  title: "Feedback",
                  value: "Tell us what to improve",
                  sub: "Feature requests welcome",
                },
                {
                  icon: User,
                  title: "Built by",
                  value: "Anil Bhukya",
                  sub: "B.Tech Graduate, Founder",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-[#12151D] border border-[#1E2330] rounded-2xl p-5 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-[#10B981]" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-widest text-[#8A8F9C] mb-1">
                      {item.title.toUpperCase()}
                    </p>
                    <p className="text-sm font-semibold text-[#F5F3EE]">
                      {item.value}
                    </p>
                    <p className="text-xs text-[#8A8F9C] mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT — FORM */}
            <div className="md:col-span-2">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#12151D] border border-[#10B981]/40 rounded-2xl p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                >
                  <CheckCircle2
                    size={52}
                    className="text-[#10B981] mb-5"
                  />
                  <h2 className="text-2xl font-display font-bold mb-3">
                    Message sent!
                  </h2>
                  <p className="text-[#8A8F9C] max-w-sm text-sm">
                    Thanks {form.name.split(" ")[0]}, we got your message and
                    will reply to {form.email} within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", topic: "", message: "" });
                    }}
                    className="mt-8 px-6 py-3 rounded-xl border border-[#1E2330] text-[#8A8F9C] hover:text-[#F5F3EE] hover:border-[#10B981] transition font-mono text-sm"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#12151D] border border-[#1E2330] rounded-2xl p-6 md:p-8"
                >
                  {/* TICKET TOP */}
                  <div className="flex items-center justify-between mb-6 font-mono text-xs">
                    <span className="text-[#8A8F9C] tracking-widest">
                      NEW MESSAGE
                    </span>
                    <span className="flex items-center gap-1.5 text-[#10B981]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                      OPEN
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* NAME + EMAIL */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono text-[#8A8F9C] block mb-2">
                          YOUR NAME
                        </label>
                        <input
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Anil Bhukya"
                          className="w-full bg-[#0B0E14] border border-[#1E2330] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] placeholder:text-[#5b606e] outline-none focus:border-[#10B981] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-[#8A8F9C] block mb-2">
                          EMAIL ADDRESS
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="w-full bg-[#0B0E14] border border-[#1E2330] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] placeholder:text-[#5b606e] outline-none focus:border-[#10B981] transition-colors"
                        />
                      </div>
                    </div>

                    {/* TOPIC */}
                    <div>
                      <label className="text-xs font-mono text-[#8A8F9C] block mb-2">
                        TOPIC
                      </label>
                      <select
                        name="topic"
                        value={form.topic}
                        onChange={handleChange}
                        className="w-full bg-[#0B0E14] border border-[#1E2330] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] outline-none focus:border-[#10B981] transition-colors"
                      >
                        <option value="">Select a topic...</option>
                        {topics.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* MESSAGE */}
                    <div>
                      <label className="text-xs font-mono text-[#8A8F9C] block mb-2">
                        MESSAGE
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Describe your question or issue in detail..."
                        rows={5}
                        className="w-full bg-[#0B0E14] border border-[#1E2330] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] placeholder:text-[#5b606e] outline-none focus:border-[#10B981] transition-colors resize-none"
                      />
                      <p className="text-right text-xs text-[#5b606e] mt-1 font-mono">
                        {form.message.length} chars
                      </p>
                    </div>

                    {error && (
                      <p className="text-xs text-[#fb7185] font-mono">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-[#10B981] text-[#0B0E14] py-3.5 rounded-xl font-semibold hover:bg-[#34D399] transition-all duration-300 disabled:opacity-70 text-sm"
                    >
                      {loading ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send size={16} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}