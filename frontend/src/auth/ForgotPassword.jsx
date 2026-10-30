import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import fieldImg from "../assets/field.jpg";
import { useLanguage } from "../context/LanguageContext";

const ForgotPassword = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email address is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });
      toast.success(
        response.data?.message || "Password reset link sent to your email!"
      );
      setIsSubmitted(true);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to send reset link. Please verify your email.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-green-50/60 via-slate-50 to-emerald-100/30 p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-green-950/10 border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* LEFT COLUMN: HERO IMAGE & BANNER */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-8 text-white overflow-hidden bg-emerald-950">
          <img
            src={fieldImg}
            alt="FarmLink Password Recovery"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-emerald-900/40" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-green-100">
              <KeyRound className="w-4 h-4 text-emerald-300" />
              <span>{t("forgotPassword.badge")}</span>
            </div>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white leading-tight">
              Reset Your <br />
              <span className="text-emerald-300">Password Securely.</span>
            </h2>
            <p className="mt-2 text-sm text-green-100/90 leading-relaxed">
              Don't worry! It happens. We will help you regain quick access to your mandi appointments and center dashboard.
            </p>
          </div>

          <div className="relative z-10 space-y-3 my-6">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <p className="text-xs text-white">Temporary 15-minute reset token</p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <p className="text-xs text-white">Direct link sent exclusively to your inbox</p>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-green-100/80">
            <span>Encrypted Token Delivery</span>
            <div className="flex items-center gap-1 font-semibold text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
              <span>TLS Security</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FORGOT PASSWORD FORM OR SUCCESS VIEW */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-200 text-green-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {t("forgotPassword.successTitle")}
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {t("forgotPassword.successDesc")}{" "}
                <span className="font-semibold text-slate-900">{email}</span>. The link will remain active for 15 minutes.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {t("forgotPassword.tryAnother")}
                </button>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold shadow-md shadow-green-600/20 transition-all text-center"
                >
                  {t("forgotPassword.returnSignIn")}
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-200 text-green-600 flex items-center justify-center mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {t("forgotPassword.heading")}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  {t("forgotPassword.subheading")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t("forgotPassword.emailLabel")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="farmer@example.com"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        error
                          ? "border-red-400 focus:ring-red-200"
                          : "border-slate-200 focus:border-green-600 focus:ring-green-100"
                      }`}
                    />
                  </div>
                  {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t("forgotPassword.sending")}</span>
                    </>
                  ) : (
                    <>
                      <span>{t("forgotPassword.sendBtn")}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs sm:text-sm text-slate-600 pt-3">
                  {t("forgotPassword.rememberedPwd")}{" "}
                  <Link
                    to="/login"
                    className="text-green-600 hover:text-green-700 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>{t("forgotPassword.signIn")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
