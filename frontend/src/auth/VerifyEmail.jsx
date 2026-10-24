import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  ShieldCheck,
  ArrowRight,
  Loader2,
  RefreshCw,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContex";
import farmerImg from "../assets/farmer.jpg";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  // Read email from router state or fallback
  const initialEmail = location.state?.email || "";
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle single digit input and autofocus next
  const handleOtpChange = (index, value) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/[^0-9]/g, "");

    const newOtp = [...otp];
    if (cleanVal.length > 1) {
      // User pasted or multi-char
      const pastedDigits = cleanVal.slice(0, 6).split("");
      pastedDigits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(pastedDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = cleanVal;
    setOtp(newOtp);

    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pasteData) return;

    const digits = pasteData.slice(0, 6).split("");
    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });
    setOtp(newOtp);
    const focusIndex = Math.min(digits.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (!email.trim()) {
      toast.error("Please provide your registered email address");
      return;
    }

    if (otpCode.length < 6) {
      toast.error("Please enter the complete 6-digit OTP code");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/verify-email", {
        email: email.trim().toLowerCase(),
        otp: otpCode,
      });

      const loggedInUser = response.data?.data?.user;
      if (loggedInUser) {
        setUser(loggedInUser);
      }

      toast.success("Email verified successfully!");

      if (loggedInUser?.role === "officer") {
        navigate("/officer/dashboard");
      } else if (loggedInUser?.role === "farmer") {
        navigate("/farmer/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Verification failed. The OTP may be invalid or expired.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email to resend OTP");
      return;
    }

    setResending(true);

    try {
      const response = await api.post("/auth/resend-otp", {
        email: email.trim().toLowerCase(),
      });
      toast.success(response.data?.message || "New OTP sent to your email!");
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to resend OTP. Please try again.";
      toast.error(errMsg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-green-50/60 via-slate-50 to-emerald-100/30 p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl shadow-green-950/10 border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
        {/* LEFT COLUMN: HERO IMAGE & BANNER */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-8 text-white overflow-hidden bg-emerald-950">
          <img
            src={farmerImg}
            alt="FarmLink Verification"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-emerald-900/40" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-green-100">
              <KeyRound className="w-4 h-4 text-emerald-300" />
              <span>Two-Step Verification</span>
            </div>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white leading-tight">
              Protecting Your <br />
              <span className="text-emerald-300">FarmLink Profile.</span>
            </h2>
            <p className="mt-2 text-sm text-green-100/90 leading-relaxed">
              We send a secure 6-digit one-time code to verify your identity before enabling government mandi booking.
            </p>
          </div>

          <div className="relative z-10 space-y-3 my-6">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <p className="text-xs text-white">Direct authorization for procurement queues</p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <p className="text-xs text-white">Fraud prevention for bank settlements</p>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-green-100/80">
            <span>Security by Design</span>
            <div className="flex items-center gap-1 font-semibold text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
              <span>256-Bit Protection</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: OTP INPUT FORM */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-200 text-green-600 flex items-center justify-center mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Verify your email
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Please enter the 6-digit verification code sent to your email.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            {/* Email field (editable if user needs to correct) */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Registered Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>
            </div>

            {/* 6 Digit OTP Inputs */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                6-Digit Security Code
              </label>
              <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-13 sm:h-14 text-center text-xl sm:text-2xl font-bold text-slate-900 rounded-xl border-2 border-slate-200 bg-slate-50/60 focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Resend OTP Section */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Didn't receive the email?</span>
              {timer > 0 ? (
                <span className="font-medium text-slate-400">
                  Resend code in <strong className="text-green-600">{timer}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="font-semibold text-green-600 hover:text-green-700 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {resending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>Resend OTP</span>
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify Email & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Back to Login */}
            <p className="text-center text-xs sm:text-sm text-slate-600 pt-2">
              Back to{" "}
              <Link
                to="/login"
                className="text-green-600 hover:text-green-700 font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
