import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MessageSquare,
  User,
  Send,
  CheckCircle2,
  Briefcase,
  AlertCircle,
  Sparkles,
  Bug,
  Building2,
  Users,
  Clock,
} from "lucide-react";
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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

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
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
        setError(
          "Failed to send message. Please try again or email us directly."
        );
        console.error("EmailJS error:", err);
      });
  }

  const helpCards = [
    {
      icon: Briefcase,
      title: "Job Listing Issue",
      description:
        "Found a job that is expired, unavailable, or not opening correctly?",
    },
    {
      icon: AlertCircle,
      title: "Wrong Job Details",
      description:
        "Let us know if a job has incorrect information, salary, location, or company details.",
    },
    {
      icon: Sparkles,
      title: "Suggest a Feature",
      description:
        "Have an idea that could make JobXPortal more useful for job seekers or employers?",
    },
    {
      icon: Bug,
      title: "Report a Bug",
      description:
        "Something is not working as expected? Send us the details and help us improve.",
    },
    {
      icon: Building2,
      title: "Employer Inquiry",
      description:
        "Interested in creating an employer profile or posting jobs on JobXPortal?",
    },
    {
      icon: Users,
      title: "Partnership",
      description:
        "Want to collaborate with JobXPortal or explore a partnership opportunity?",
    },
  ];

  const supportCards = [
    {
      icon: Mail,
      title: "Email Support",
      description:
        "For detailed questions, send us a message using the contact form.",
    },
    {
      icon: Clock,
      title: "Response Time",
      description:
        "We aim to respond to genuine queries within 24 hours.",
    },
    {
      icon: MessageSquare,
      title: "Your Feedback Matters",
      description:
        "Your suggestions help shape future JobXPortal features and improvements.",
    },
  ];

  const faqs = [
    {
      question: "I found an incorrect job. What should I do?",
      answer:
        "Select “Wrong Job Details” or “Job Listing Issue” and include the job link and what appears to be incorrect.",
    },
    {
      question: "Can employers post jobs on JobXPortal?",
      answer:
        "Yes. JobXPortal also supports employers by allowing them to create accounts and post job opportunities.",
    },
    {
      question: "Can I suggest a new feature?",
      answer:
        "Absolutely. Select “Suggest a Feature” and describe your idea. Useful suggestions can help guide future improvements.",
    },
    {
      question: "Is JobXPortal only for job seekers?",
      answer:
        "No. JobXPortal is designed for both job seekers and employers, combining job discovery with career tools and hiring features.",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="bg-[#F8FAFF] min-h-screen text-[#0B132B] overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">

          {/* ========================================================= */}
          {/* HEADER */}
          {/* ========================================================= */}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.p
              variants={fadeUp}
              className="font-mono text-xs tracking-widest text-[#64748B] mb-3"
            >
              GET IN TOUCH
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-3xl md:text-5xl font-display font-bold mb-4 text-[#0B132B]"
            >
              Contact Us
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-[#475569] max-w-xl mb-12 md:mb-16 text-sm md:text-base"
            >
              Have a question, spotted a wrong listing, or want to suggest
              something? Fill in the form and we will get back to you.
            </motion.p>
          </motion.div>

          {/* ========================================================= */}
          {/* CONTACT AREA */}
          {/* ========================================================= */}

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">

            {/* LEFT — INFO CARDS */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex flex-col gap-4"
            >
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
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  className="
                    bg-white
                    border border-[#E2E6F0]
                    rounded-2xl
                    p-5
                    flex items-start gap-4
                    shadow-[0_4px_18px_rgba(15,23,42,0.05)]
                    hover:border-[#4F46E5]/40
                    hover:shadow-[0_14px_35px_rgba(79,70,229,0.10)]
                    transition-shadow
                    duration-300
                  "
                >
                  <motion.div
                    whileHover={{
                      scale: 1.08,
                      rotate: 3,
                    }}
                    className="
                      w-10 h-10 rounded-xl
                      bg-[#4F46E5]/10
                      border border-[#4F46E5]/20
                      flex items-center justify-center
                      shrink-0
                    "
                  >
                    <item.icon size={18} className="text-[#4F46E5]" />
                  </motion.div>

                  <div>
                    <p className="font-mono text-[10px] tracking-widest text-[#64748B] mb-1">
                      {item.title.toUpperCase()}
                    </p>

                    <p className="text-sm font-semibold text-[#0B132B]">
                      {item.value}
                    </p>

                    <p className="text-xs text-[#64748B] mt-0.5">
                      {item.sub}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* RIGHT — FORM */}
            <motion.div
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
              className="md:col-span-2"
            >
              {submitted ? (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className="
                    bg-white
                    border border-[#10B981]/40
                    rounded-2xl
                    p-10
                    flex flex-col items-center justify-center
                    text-center
                    h-full
                    min-h-[400px]
                    shadow-[0_8px_30px_rgba(15,23,42,0.06)]
                  "
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.15,
                      duration: 0.4,
                      type: "spring",
                      stiffness: 180,
                    }}
                  >
                    <CheckCircle2
                      size={52}
                      className="text-[#10B981] mb-5"
                    />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-2xl font-display font-bold mb-3 text-[#0B132B]"
                  >
                    Message sent!
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="text-[#475569] max-w-sm text-sm"
                  >
                    Thanks {form.name.split(" ")[0]}, we got your message and
                    will reply to {form.email} within 24 hours.
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        topic: "",
                        message: "",
                      });
                    }}
                    className="
                      mt-8
                      px-6 py-3
                      rounded-xl
                      border border-[#E2E6F0]
                      text-[#475569]
                      hover:text-[#4F46E5]
                      hover:border-[#4F46E5]
                      hover:bg-[#4F46E5]/5
                      transition
                      font-mono text-sm
                      cursor-pointer
                    "
                  >
                    Send another message
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  className="
                    bg-white
                    border border-[#E2E6F0]
                    rounded-2xl
                    p-6 md:p-8
                    shadow-[0_8px_30px_rgba(15,23,42,0.06)]
                  "
                >
                  {/* TICKET TOP */}
                  <div className="flex items-center justify-between mb-6 font-mono text-xs">
                    <span className="text-[#64748B] tracking-widest">
                      NEW MESSAGE
                    </span>

                    <span className="flex items-center gap-1.5 text-[#10B981]">
                      <motion.span
                        animate={{
                          opacity: [1, 0.35, 1],
                          scale: [1, 0.8, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                        className="w-1.5 h-1.5 rounded-full bg-[#10B981]"
                      />
                      OPEN
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">

                    {/* NAME + EMAIL */}
                    <div className="grid sm:grid-cols-2 gap-4">

                      <div>
                        <label className="text-xs font-mono text-[#64748B] block mb-2">
                          YOUR NAME
                        </label>

                        <motion.input
                          whileFocus={{
                            scale: 1.005,
                          }}
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Anil Bhukya"
                          className="
                            w-full
                            bg-[#F8FAFF]
                            border border-[#E2E6F0]
                            rounded-xl
                            px-4 py-3
                            text-sm
                            text-[#0B132B]
                            placeholder:text-[#94A3B8]
                            outline-none
                            focus:border-[#4F46E5]
                            focus:ring-2
                            focus:ring-[#4F46E5]/10
                            transition-all
                          "
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono text-[#64748B] block mb-2">
                          EMAIL ADDRESS
                        </label>

                        <motion.input
                          whileFocus={{
                            scale: 1.005,
                          }}
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="
                            w-full
                            bg-[#F8FAFF]
                            border border-[#E2E6F0]
                            rounded-xl
                            px-4 py-3
                            text-sm
                            text-[#0B132B]
                            placeholder:text-[#94A3B8]
                            outline-none
                            focus:border-[#4F46E5]
                            focus:ring-2
                            focus:ring-[#4F46E5]/10
                            transition-all
                          "
                        />
                      </div>

                    </div>

                    {/* TOPIC */}
                    <div>
                      <label className="text-xs font-mono text-[#64748B] block mb-2">
                        TOPIC
                      </label>

                      <motion.select
                        whileFocus={{
                          scale: 1.005,
                        }}
                        name="topic"
                        value={form.topic}
                        onChange={handleChange}
                        className="
                          w-full
                          bg-[#F8FAFF]
                          border border-[#E2E6F0]
                          rounded-xl
                          px-4 py-3
                          text-sm
                          text-[#0B132B]
                          outline-none
                          focus:border-[#4F46E5]
                          focus:ring-2
                          focus:ring-[#4F46E5]/10
                          transition-all
                          cursor-pointer
                        "
                      >
                        <option value="">Select a topic...</option>

                        {topics.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </motion.select>
                    </div>

                    {/* MESSAGE */}
                    <div>
                      <label className="text-xs font-mono text-[#64748B] block mb-2">
                        MESSAGE
                      </label>

                      <motion.textarea
                        whileFocus={{
                          scale: 1.005,
                        }}
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Describe your question or issue in detail..."
                        rows={5}
                        className="
                          w-full
                          bg-[#F8FAFF]
                          border border-[#E2E6F0]
                          rounded-xl
                          px-4 py-3
                          text-sm
                          text-[#0B132B]
                          placeholder:text-[#94A3B8]
                          outline-none
                          focus:border-[#4F46E5]
                          focus:ring-2
                          focus:ring-[#4F46E5]/10
                          transition-all
                          resize-none
                        "
                      />

                      <p className="text-right text-xs text-[#94A3B8] mt-1 font-mono">
                        {form.message.length} chars
                      </p>
                    </div>

                    {/* ERROR */}
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-[#E11D48] font-mono"
                      >
                        {error}
                      </motion.p>
                    )}

                    {/* SEND BUTTON */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{
                        y: -2,
                        scale: 1.01,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                      className="
                        cursor-pointer
                        w-full
                        flex items-center justify-center gap-2
                        bg-[#4F46E5]
                        text-white
                        py-3.5
                        rounded-xl
                        font-semibold
                        hover:bg-[#4338CA]
                        hover:shadow-[0_8px_20px_rgba(79,70,229,0.25)]
                        transition-all duration-300
                        disabled:opacity-70
                        text-sm
                      "
                    >
                      {loading ? (
                        "Sending..."
                      ) : (
                        <>
                          <motion.span
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Send size={16} />
                          </motion.span>

                          Send Message
                        </>
                      )}
                    </motion.button>

                  </form>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* ========================================================= */}
          {/* HOW WE CAN HELP */}
          {/* ========================================================= */}

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="mt-24 md:mt-32"
          >
            <motion.div variants={fadeUp} className="mb-10">
              <p className="font-mono text-xs tracking-widest text-[#64748B] mb-3">
                HOW WE CAN HELP
              </p>

              <h2 className="text-2xl md:text-4xl font-display font-bold text-[#0B132B] mb-3">
                Tell us what you need.
              </h2>

              <p className="text-sm md:text-base text-[#64748B] max-w-2xl">
                Whether you are looking for help with a job listing, have
                discovered an issue, or simply have an idea for JobXPortal,
                we would love to hear from you.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {helpCards.map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{
                    y: -6,
                    transition: { duration: 0.2 },
                  }}
                  className="
                    bg-white
                    border border-[#E2E6F0]
                    rounded-2xl
                    p-5
                    shadow-[0_4px_18px_rgba(15,23,42,0.04)]
                    hover:border-[#4F46E5]/30
                    hover:shadow-[0_14px_35px_rgba(79,70,229,0.09)]
                    transition-all duration-300
                  "
                >
                  <div
                    className="
                      w-11 h-11
                      rounded-xl
                      bg-[#4F46E5]/10
                      border border-[#4F46E5]/15
                      flex items-center justify-center
                      mb-5
                    "
                  >
                    <item.icon
                      size={19}
                      className="text-[#4F46E5]"
                    />
                  </div>

                  <h3 className="text-sm font-semibold text-[#0B132B] mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs md:text-sm leading-6 text-[#64748B]">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ========================================================= */}
          {/* BEFORE YOU SEND */}
          {/* ========================================================= */}

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="mt-24 md:mt-28"
          >
            <motion.div
              variants={fadeUp}
              className="
                bg-white
                border border-[#E2E6F0]
                rounded-2xl
                p-6 md:p-8
                shadow-[0_8px_30px_rgba(15,23,42,0.04)]
              "
            >
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

                <div>
                  <p className="font-mono text-xs tracking-widest text-[#64748B] mb-3">
                    BEFORE YOU SEND
                  </p>

                  <h2 className="text-2xl md:text-3xl font-display font-bold text-[#0B132B] mb-4">
                    Help us understand the issue faster.
                  </h2>

                  <p className="text-sm text-[#64748B] leading-6">
                    A little extra context can help us understand your
                    message and respond more effectively.
                  </p>
                </div>

                <div className="space-y-4">

                  {[
                    "Include the job link if you are reporting a job issue.",
                    "Mention what you expected and what actually happened.",
                    "Add relevant details such as company, role, or location.",
                    "If reporting a bug, mention the device or browser if possible.",
                  ].map((text, index) => (
                    <motion.div
                      key={text}
                      variants={fadeUp}
                      className="flex items-start gap-3"
                    >
                      <div
                        className="
                          w-6 h-6 rounded-full
                          bg-[#4F46E5]/10
                          text-[#4F46E5]
                          flex items-center justify-center
                          text-xs font-semibold
                          shrink-0
                        "
                      >
                        {index + 1}
                      </div>

                      <p className="text-sm text-[#475569] leading-6">
                        {text}
                      </p>
                    </motion.div>
                  ))}

                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* ========================================================= */}
          {/* RESPONSE & SUPPORT */}
          {/* ========================================================= */}

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="mt-24 md:mt-28"
          >
            <motion.div variants={fadeUp} className="mb-8">
              <p className="font-mono text-xs tracking-widest text-[#64748B] mb-3">
                RESPONSE & SUPPORT
              </p>

              <h2 className="text-2xl md:text-3xl font-display font-bold text-[#0B132B]">
                We are listening.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-4">
              {supportCards.map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  className="
                    bg-white
                    border border-[#E2E6F0]
                    rounded-2xl
                    p-6
                    shadow-[0_4px_18px_rgba(15,23,42,0.04)]
                    hover:border-[#10B981]/30
                    transition-all duration-300
                  "
                >
                  <div
                    className="
                      w-10 h-10 rounded-xl
                      bg-[#10B981]/10
                      border border-[#10B981]/15
                      flex items-center justify-center
                      mb-5
                    "
                  >
                    <item.icon
                      size={18}
                      className="text-[#10B981]"
                    />
                  </div>

                  <h3 className="font-semibold text-[#0B132B] mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#64748B] leading-6">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ========================================================= */}
          {/* QUICK ANSWERS */}
          {/* ========================================================= */}

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="mt-24 md:mt-28"
          >
            <motion.div
              variants={fadeUp}
              className="mb-8"
            >
              <p className="font-mono text-xs tracking-widest text-[#64748B] mb-3">
                QUICK ANSWERS
              </p>

              <h2 className="text-2xl md:text-3xl font-display font-bold text-[#0B132B] mb-3">
                Before you contact us
              </h2>

              <p className="text-sm text-[#64748B]">
                Here are a few common questions about JobXPortal.
              </p>
            </motion.div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <motion.details
                  key={faq.question}
                  variants={fadeUp}
                  className="
                    group
                    bg-white
                    border border-[#E2E6F0]
                    rounded-2xl
                    overflow-hidden
                    shadow-[0_3px_15px_rgba(15,23,42,0.03)]
                  "
                >
                  <summary
                    className="
                      cursor-pointer
                      list-none
                      px-5 py-5
                      flex items-center justify-between
                      gap-4
                      text-sm
                      font-semibold
                      text-[#0B132B]
                    "
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="
                          w-7 h-7
                          rounded-lg
                          bg-[#4F46E5]/10
                          text-[#4F46E5]
                          flex items-center justify-center
                          text-xs
                          font-mono
                          shrink-0
                        "
                      >
                        0{index + 1}
                      </span>

                      {faq.question}
                    </span>

                    <span
                      className="
                        text-[#64748B]
                        transition-transform
                        duration-300
                        group-open:rotate-45
                        text-xl
                        font-light
                      "
                    >
                      +
                    </span>
                  </summary>

                  <div className="px-5 pb-5 pl-[4.5rem]">
                    <p className="text-sm text-[#64748B] leading-6 max-w-3xl">
                      {faq.answer}
                    </p>
                  </div>
                </motion.details>
              ))}
            </div>
          </motion.section>

          {/* ========================================================= */}
          {/* FINAL CTA */}
          {/* ========================================================= */}

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="mt-24 md:mt-32"
          >
            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                bg-[#0B132B]
                px-6 py-10
                md:px-12 md:py-14
                text-center
                shadow-[0_20px_50px_rgba(11,19,43,0.15)]
              "
            >
              {/* Decorative elements */}
              <div
                className="
                  absolute
                  -top-20
                  -right-20
                  w-56
                  h-56
                  rounded-full
                  bg-[#4F46E5]/20
                  blur-3xl
                "
              />

              <div
                className="
                  absolute
                  -bottom-20
                  -left-20
                  w-56
                  h-56
                  rounded-full
                  bg-[#10B981]/10
                  blur-3xl
                "
              />

              <div className="relative z-10">

                <p className="font-mono text-xs tracking-widest text-[#A5B4FC] mb-4">
                  HAVE SOMETHING TO TELL US?
                </p>

                <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-4">
                  Your feedback can make JobXPortal better.
                </h2>

                <p className="text-sm md:text-base text-[#CBD5E1] max-w-2xl mx-auto leading-7">
                  Every useful suggestion, bug report, and piece of feedback
                  helps us build a better career platform for job seekers and
                  employers.
                </p>

                <motion.a
                  href="#top"
                  whileHover={{
                    y: -3,
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    mt-8
                    px-6
                    py-3
                    rounded-xl
                    bg-white
                    text-[#0B132B]
                    font-semibold
                    text-sm
                    hover:bg-[#EEF2FF]
                    transition
                    cursor-pointer
                  "
                >
                  <MessageSquare size={16} />
                  Send a Message
                </motion.a>

              </div>
            </div>
          </motion.section>

        </div>

        <Footer />
      </div>

      <style>{`
        html {
          scroll-behavior: smooth;
        }

        details > summary::-webkit-details-marker {
          display: none;
        }
      `}</style>
    </>
  );
}