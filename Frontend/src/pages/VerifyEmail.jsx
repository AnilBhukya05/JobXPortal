import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { request } from "../services/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const emailFromUrl = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  async function handleSendOtp() {
    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    setSending(true);

    try {
      const result = await request(
        "/auth/send-verification",
        {
          method: "POST",
          body: JSON.stringify({
            email: cleanEmail,
          }),
        }
      );

      setOtpSent(true);

      setSuccess(
        result.message ||
          "Verification OTP sent to your email."
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to send verification OTP."
      );
    } finally {
      setSending(false);
    }
  }

  async function handleVerify() {
    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^\d{6}$/.test(cleanOtp)) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const result = await request(
        "/auth/verify-email",
        {
          method: "POST",
          body: JSON.stringify({
            email: cleanEmail,
            otp: cleanOtp,
          }),
        }
      );

      if (result.success) {
        setSuccess(
          "Email verified successfully!"
        );

        setTimeout(() => {
          navigate("/login", {
            replace: true,
          });
        }, 1200);

        return;
      }

      setError(
        result.message ||
          "Verification failed."
      );
    } catch (err) {
      setError(
        err.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen flex items-center justify-center px-6 py-16"
        style={{
          background: "#F8FAFF",
          color: "#0B132B",
        }}
      >
        <div className="w-full max-w-[420px]">
          {/* CARD */}

          <div
            className="rounded-2xl bg-white p-8"
            style={{
              boxShadow:
                "0 15px 40px rgba(15, 23, 42, 0.08)",
              border:
                "1px solid #E2E8F0",
            }}
          >
            {/* ICON */}

            <div className="flex justify-center mb-5">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{
                  background:
                    "rgba(79, 70, 229, 0.1)",
                }}
              >
                <CheckCircle2
                  size={28}
                  style={{
                    color: "#4F46E5",
                  }}
                />
              </div>
            </div>

            {/* TITLE */}

            <h1
              className="text-center text-[25px] font-extrabold"
              style={{
                fontFamily: "Poppins",
                color: "#0B132B",
              }}
            >
              Verify your email
            </h1>

            <p
              className="mt-2 text-center text-[13px] leading-6"
              style={{
                fontFamily: "Poppins",
                color: "#64748B",
              }}
            >
              Enter your email address and we'll
              send you a 6-digit verification OTP.
            </p>

            {/* EMAIL */}

            <div className="mt-7">
              <label
                className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.05em]"
                style={{
                  fontFamily: "Poppins",
                  color: "#4F46E5",
                }}
              >
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                className="w-full rounded-lg border px-4 py-3 text-[14px] outline-none transition focus:border-indigo-600"
                style={{
                  fontFamily: "Poppins",
                  borderColor: "#D8DEEA",
                  color: "#0B132B",
                }}
              />
            </div>

            {/* SEND OTP */}

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sending}
              className="mt-4 w-full rounded-lg px-4 py-3 text-[14px] font-bold text-white transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                fontFamily: "Poppins",
                background: "#4F46E5",
                boxShadow:
                  "0 8px 20px rgba(79, 70, 229, 0.18)",
              }}
            >
              {sending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Sending OTP...
                </span>
              ) : (
                "Send OTP"
              )}
            </button>

            {/* OTP */}

            {otpSent && (
              <>
                <div className="mt-6">
                  <label
                    className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.05em]"
                    style={{
                      fontFamily: "Poppins",
                      color: "#4F46E5",
                    }}
                  >
                    Verification OTP
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="Enter 6-digit OTP"
                    className="w-full rounded-lg border px-4 py-3 text-center text-[18px] font-semibold tracking-[0.35em] outline-none transition focus:border-indigo-600"
                    style={{
                      fontFamily: "Poppins",
                      borderColor: "#D8DEEA",
                      color: "#0B132B",
                    }}
                  />
                </div>

                {/* VERIFY */}

                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={
                    loading ||
                    otp.length !== 6
                  }
                  className="mt-4 w-full rounded-lg px-4 py-3 text-[14px] font-bold text-white transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    fontFamily: "Poppins",
                    background: "#4F46E5",
                    boxShadow:
                      "0 8px 20px rgba(79, 70, 229, 0.18)",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Verifying...
                    </span>
                  ) : (
                    "Verify Email"
                  )}
                </button>

                {/* RESEND */}

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sending}
                  className="mt-4 w-full bg-transparent text-[13px] font-semibold text-indigo-600 hover:text-indigo-700"
                  style={{
                    fontFamily: "Poppins",
                  }}
                >
                  Resend OTP
                </button>
              </>
            )}

            {/* ERROR */}

            {error && (
              <div className="mt-5 flex items-start gap-2 rounded-lg bg-rose-50 px-4 py-3">
                <XCircle
                  size={17}
                  className="mt-[1px] shrink-0 text-rose-500"
                />

                <p
                  className="text-[13px] leading-5 text-rose-600"
                  style={{
                    fontFamily: "Poppins",
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="mt-5 flex items-start gap-2 rounded-lg bg-green-50 px-4 py-3">
                <CheckCircle2
                  size={17}
                  className="mt-[1px] shrink-0 text-green-600"
                />

                <p
                  className="text-[13px] leading-5 text-green-700"
                  style={{
                    fontFamily: "Poppins",
                  }}
                >
                  {success}
                </p>
              </div>
            )}

            {/* BACK TO LOGIN */}

            <Link
              to="/login"
              className="mt-7 flex items-center justify-center gap-2 text-[13px] font-semibold text-slate-500 no-underline transition hover:text-indigo-600"
              style={{
                fontFamily: "Poppins",
              }}
            >
              <ArrowLeft size={15} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}