import { useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const from =
    location.state?.from || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPw, setShowPw] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function handleChange(e) {
    const val =
      e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value;

    setForm((p) => ({
      ...p,
      [e.target.name]: val,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError(
        "Please fill in all fields."
      );

      return;
    }

    setLoading(true);

    const result = await login({
      email: form.email,
      password: form.password,
      remember: form.remember,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    /*
     * ROLE-BASED REDIRECT
     *
     * Admin     → /admin
     * Employer  → previous requested page
     * Seeker    → previous requested page
     */

    if (result.user?.role === "admin") {
      navigate("/admin", {
        replace: true,
      });

      return;
    }

    if (result.user?.role === "employer") {
      navigate(from, {
        replace: true,
      });

      return;
    }

    navigate(from, {
      replace: true,
    });
  }

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
        className="auth-shell"
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
            {/* LOGO */}

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
                  boxShadow:
                    "0 8px 20px rgba(79, 70, 229, 0.18)",
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
                letterSpacing: "-0.02em",
              }}
            >
              Every job, one search away.
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
              Sign in to save roles, get faster
              search, and pick up right where
              you left off.
            </p>

            {[
              "Live listings pulled on every search",
              "Bookmark and compare roles side by side",
              "No spam, no fake postings",
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
                    color: "#4F46E5",
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
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
            }}
            style={{
              width: "100%",
              maxWidth: 360,
            }}
          >
            <h1
              style={{
                fontFamily: "Poppins",
                fontWeight: 800,
                fontSize: "1.7rem",
                marginBottom: 6,
                color: "#0B132B",
                letterSpacing: "-0.02em",
              }}
            >
              Welcome back
            </h1>

            <p
              style={{
                fontFamily: "Poppins",
                fontSize: 13,
                color: "#64748B",
                marginBottom: 32,
              }}
            >
              Sign in to access your tools and
              saved jobs.
            </p>

            <form onSubmit={handleSubmit}>
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

                <label>Email</label>
              </div>

              {/* PASSWORD */}

              <div
                className="float-field"
                style={{
                  position: "relative",
                }}
              >
                <input
                  name="password"
                  type={
                    showPw
                      ? "text"
                      : "password"
                  }
                  value={form.password}
                  onChange={handleChange}
                  placeholder=" "
                  autoComplete="current-password"
                  style={{
                    paddingRight: 30,
                  }}
                />

                <label>Password</label>

                <button
                  type="button"
                  onClick={() =>
                    setShowPw((s) => !s)
                  }
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 18,
                    background:
                      "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#64748B",
                  }}
                >
                  {showPw ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>

              {/* FORGOT PASSWORD */}

              <p
                style={{
                  textAlign: "right",
                  marginTop: -12,
                  marginBottom: 20,
                }}
              >
                <Link
                  to="/forgot-password"
                  style={{
                    color: "#64748B",
                    fontFamily: "Poppins",
                    fontSize: 12.5,
                    textDecoration:
                      "none",
                    transition:
                      "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color =
                      "#4F46E5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color =
                      "#64748B")
                  }
                >
                  Forgot password?
                </Link>
              </p>

              {/* REMEMBER ME */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  margin: "6px 0 26px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    name="remember"
                    checked={
                      form.remember
                    }
                    onChange={handleChange}
                    style={{
                      accentColor:
                        "#4F46E5",
                      width: 14,
                      height: 14,
                    }}
                  />

                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 12.5,
                      color: "#64748B",
                    }}
                  >
                    Remember me
                  </span>
                </label>
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

              {/* SIGN IN */}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{
                  y: loading ? 0 : -1,
                }}
                whileTap={{
                  scale: loading ? 1 : 0.98,
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  gap: 8,
                  padding: "13px",
                  background: "#4F46E5",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 10,
                  cursor: loading
                    ? "default"
                    : "pointer",
                  fontFamily: "Poppins",
                  fontSize: 14,
                  fontWeight: 700,
                  opacity: loading
                    ? 0.75
                    : 1,
                  boxShadow:
                    "0 8px 20px rgba(79, 70, 229, 0.18)",
                  transition:
                    "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background =
                      "#4338CA";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "#4F46E5";
                }}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      style={{
                        animation:
                          "spin 1s linear infinite",
                      }}
                    />

                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={17} />

                    Sign In
                  </>
                )}
              </motion.button>

              {/* REGISTER */}

              <p
                style={{
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: 13,
                  color: "#64748B",
                  marginTop: 22,
                }}
              >
                New here?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "#4F46E5",
                    textDecoration:
                      "none",
                    fontWeight: 600,
                  }}
                >
                  Create free account
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

          background-image:
            radial-gradient(
              #D8DEEA 1px,
              transparent 1px
            );

          background-size: 22px 22px;

          mask-image:
            radial-gradient(
              circle at 30% 40%,
              black,
              transparent 75%
            );

          -webkit-mask-image:
            radial-gradient(
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
          border-bottom: 1px solid #D8DEEA;
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