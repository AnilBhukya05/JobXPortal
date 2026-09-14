import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
  CheckCircle2,
  User,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const [role, setRole] = useState(
    location.state?.role === "employer" ? "employer" : "seeker"
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function validate() {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      return "Please enter a valid email.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const err = validate();

    if (err) {
      setError(err);
      return;
    }

    setError("");
    setLoading(true);

    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      role,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      const dest =
        location.state?.from ||
        (role === "employer" ? "/employer/dashboard" : "/profile");

      navigate(dest, { replace: true });
    }
  }

  const roleOptions = [
    {
      value: "seeker",
      label: "I'm looking for a job",
      icon: User,
    },
    {
      value: "employer",
      label: "I'm hiring",
      icon: Briefcase,
    },
  ];

  return (
    <>
      <Navbar />

      <div
        style={{
          background: "#F8FAFF",
          color: "#0B132B",
          minHeight: "100vh",
          display: "flex",
        }}
      >
        {/* LEFT SIDE */}
        <div className="auth-side">
          <div className="auth-dots" />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 380,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  background:
                    "linear-gradient(135deg, #4F46E5, #7138E8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 18px rgba(79,70,229,0.20)",
                }}
              >
                <span
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 800,
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                >
                  J
                </span>
              </div>

              <span
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#0B132B",
                }}
              >
                JobXPortal
              </span>
            </div>

            <h2
              style={{
                fontFamily: "Poppins",
                fontWeight: 800,
                fontSize: "1.8rem",
                lineHeight: 1.25,
                marginBottom: 14,
                color: "#0B132B",
              }}
            >
              Free forever. No catch.
            </h2>

            <p
              style={{
                fontFamily: "Poppins",
                fontSize: 14,
                color: "#64748B",
                lineHeight: 1.6,
                marginBottom: 32,
              }}
            >
              Create an account to unlock saved searches, bookmarks, and a
              faster way back to roles you liked.
            </p>

            {[
              "No credit card, ever",
              "Your data stays with your account only",
              "Cancel or delete anytime",
            ].map((f) => (
              <div
                key={f}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <CheckCircle2
                  size={17}
                  style={{
                    color: "#10B981",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                />

                <span
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 13,
                    color: "#64748B",
                  }}
                >
                  {f}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              width: "100%",
              maxWidth: 380,
            }}
          >
            <h1
              style={{
                fontFamily: "Poppins",
                fontWeight: 800,
                fontSize: "1.7rem",
                marginBottom: 6,
                color: "#0B132B",
              }}
            >
              Create account
            </h1>

            <p
              style={{
                fontFamily: "Poppins",
                fontSize: 13,
                color: "#64748B",
                marginBottom: 24,
              }}
            >
              Free forever. No credit card needed.
            </p>

            {/* ROLE SELECTION */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginBottom: 28,
              }}
            >
              {roleOptions.map((opt) => {
                const Icon = opt.icon;
                const active = role === opt.value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                      padding: "14px 10px",
                      borderRadius: 10,
                      border: `1px solid ${
                        active ? "#4F46E5" : "#E2E6F0"
                      }`,
                      background: active ? "#F4F3FF" : "#FFFFFF",
                      color: active ? "#4F46E5" : "#64748B",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      boxShadow: active
                        ? "0 4px 14px rgba(79,70,229,0.08)"
                        : "none",
                    }}
                  >
                    <Icon size={18} />

                    <span
                      style={{
                        fontFamily: "Poppins",
                        fontSize: 12,
                        fontWeight: 600,
                        textAlign: "center",
                        lineHeight: 1.3,
                      }}
                    >
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit}>
              {/* NAME */}
              <div className="float-field">
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder=" "
                  autoComplete="name"
                />

                <label>
                  {role === "employer"
                    ? "Full name / Recruiter name"
                    : "Full name"}
                </label>
              </div>

              {/* EMAIL */}
              <div className="float-field">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder=" "
                  autoComplete="email"
                />

                <label>
                  {role === "employer" ? "Work email" : "Email"}
                </label>
              </div>

              {/* PASSWORD */}
              <div
                className="float-field"
                style={{ position: "relative" }}
              >
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder=" "
                  autoComplete="new-password"
                  style={{ paddingRight: 30 }}
                />

                <label>Password</label>

                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 18,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#64748B",
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="float-field">
                <input
                  name="confirm"
                  type={showPw ? "text" : "password"}
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder=" "
                  autoComplete="new-password"
                />

                <label>Confirm password</label>
              </div>

              {/* ERROR */}
              {error && (
                <p
                  style={{
                    color: "#E11D48",
                    fontFamily: "Poppins",
                    fontSize: 13,
                    marginBottom: 16,
                  }}
                >
                  {error}
                </p>
              )}

              {/* CREATE ACCOUNT */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ y: loading ? 0 : -1 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "13px",
                  background: "#4F46E5",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 10,
                  cursor: loading ? "default" : "pointer",
                  fontFamily: "Poppins",
                  fontSize: 14,
                  fontWeight: 700,
                  opacity: loading ? 0.75 : 1,
                  marginTop: 4,
                  boxShadow: "0 8px 20px rgba(79,70,229,0.18)",
                }}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      style={{
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus size={17} />
                    Create Account
                  </>
                )}
              </motion.button>

              <p
                style={{
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: 13,
                  color: "#64748B",
                  marginTop: 22,
                }}
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "#4F46E5",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign in
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .auth-side {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          padding: 60px;
          background: #FFFFFF;
          border-right: 1px solid #E2E6F0;
          overflow: hidden;
        }

        .auth-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            #E2E6F0 1px,
            transparent 1px
          );
          background-size: 22px 22px;
          mask-image: radial-gradient(
            circle at 30% 40%,
            black,
            transparent 75%
          );
          -webkit-mask-image: radial-gradient(
            circle at 30% 40%,
            black,
            transparent 75%
          );
        }

        .float-field {
          position: relative;
          margin-bottom: 22px;
        }

        .float-field input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #D9DEEA;
          padding: 20px 0 8px;
          color: #0B132B;
          font-family: "Poppins";
          font-size: 14.5px;
          outline: none;
          transition: border-color 0.2s;
        }

        .float-field input:focus {
          border-bottom-color: #4F46E5;
        }

        .float-field label {
          position: absolute;
          left: 0;
          top: 20px;
          color: #94A3B8;
          font-family: "Poppins";
          font-size: 14.5px;
          pointer-events: none;
          transition: all 0.18s ease;
        }

        .float-field input:focus + label,
        .float-field input:not(:placeholder-shown) + label {
          top: 0;
          font-size: 11px;
          letter-spacing: 0.05em;
          color: #4F46E5;
          text-transform: uppercase;
        }

        .float-field input:-webkit-autofill,
        .float-field input:-webkit-autofill:hover,
        .float-field input:-webkit-autofill:focus {
          -webkit-text-fill-color: #0B132B;
          -webkit-box-shadow: 0 0 0px 1000px #F8FAFF inset;
          transition: background-color 5000s ease-in-out 0s;
          caret-color: #0B132B;
        }

        @media(max-width: 900px) {
          .auth-side {
            display: none;
          }
        }
      `}</style>
    </>
  );
}