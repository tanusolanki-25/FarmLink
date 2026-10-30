import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Phone,
  Sprout,
  ArrowRight,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import farmerImg from "../assets/farmer.jpg";
import { useLanguage } from "../context/LanguageContext";

const Register = () => {
  const navigate = useNavigate();
  const {t} = useLanguage()

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (optional or 10 digits)
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreeTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return Math.min(strength, 4);
  };

  const strengthScore = getPasswordStrength(formData.password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-amber-500", "bg-blue-500", "bg-green-600"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fill in all required fields properly");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
      };

      const response = await api.post("/auth/register", payload);

      toast.success(
        response.data?.message || "Registration successful! Verification OTP sent to your email."
      );

      navigate("/verify-email", {
        state: { email: payload.email, role: payload.role },
      });
    } catch (err) {
      console.error("Registration error:", err);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (err.code === "ERR_NETWORK" || !err.response
          ? "Cannot connect to server. Please ensure backend is running on port 3001."
          : "Registration failed. Please try again.");
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-green-50/60 via-slate-50 to-emerald-100/30 p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl shadow-green-950/10 border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* LEFT COLUMN: HERO IMAGE & HIGHLIGHTS */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-8 text-white overflow-hidden bg-emerald-950">
          {/* Background Image with Dark Gradient Overlay */}
          <img
            src={farmerImg}
            alt="FarmLink Farmer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-700 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-emerald-900/40" />

          {/* Top Brand Tag */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-green-100">
              <Sprout className="w-4 h-4 text-emerald-300" />
              <span>{t("signUp.portalBadge")}</span>
            </div>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white leading-tight">
              {t("signUp.welcomeTitle1")}<br />
              <span className="text-emerald-300">{t("signUp.welcomeTitle2")}.</span>
            </h2>
            <p className="mt-2 text-sm text-green-100/90 leading-relaxed">
              {t("signUp.welcomeDescription")}
            </p>
          </div>

          {/* Feature Highlights Cards */}
          <div className="relative z-10 space-y-3 my-6">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">{t("signUp.liveMspTitle")}</h4>
                <p className="text-[11px] text-green-100/80">{t("signUp.liveMspDesc")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">{t("signUp.smartQueueTitle")}</h4>
                <p className="text-[11px] text-green-100/80">{t("signUp.smartQueueDesc")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">{t("signUp.guaranteedPaymentTitle")}</h4>
                <p className="text-[11px] text-green-100/80">{t("signUp.guaranteedPaymentDesc")}</p>
              </div>
            </div>
          </div>

          {/* Bottom Social Proof / Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-green-100/80">
            <span>{t("signUp.trustedFarmers")}</span>
            <div className="flex items-center gap-1 font-semibold text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
              <span>{t("signUp.verifiedSystem")}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REGISTRATION FORM */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {t("signUp.formTitle")}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
               {t("signUp.formSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}

              <div className="w-full">
                {/* Farmer Option */}
                <div
                  className="p-2 rounded-2xl border text-left transition-all flex gap-3 relative border-gray-300  bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center bg-green-600 text-white"
                    >
                      <Sprout className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">{t("signUp.roleFarmerTitle")}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{t("signUp.roleFarmerSubtitle")}</p>
                  </div>
                </div>
              </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t("signUp.emailLabel")}<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="farmer@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-400 focus:ring-red-200"
                      : "border-slate-200 focus:border-green-600 focus:ring-green-100"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
               {t("signUp.phoneLabel1")} <span className="text-xs text-slate-400 font-normal">{t("signUp.phoneLabel2")}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("signUp.phonePlaceholder")}
                  maxLength={10}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.phone
                      ? "border-red-400 focus:ring-red-200"
                      : "border-slate-200 focus:border-green-600 focus:ring-green-100"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {t("signUp.passwordLabel")}<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t("signUp.passwordPlaceholder")}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? "border-red-400 focus:ring-red-200"
                        : "border-slate-200 focus:border-green-600 focus:ring-green-100"
                    }`}
                  />
                 
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                 {t("signUp.confirmPasswordLabel")}<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t("signUp.confirmPasswordPlaceholder")}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword
                        ? "border-red-400 focus:ring-red-200"
                        : "border-slate-200 focus:border-green-600 focus:ring-green-100"
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Password Strength Meter */}
            {formData.password && (
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Strength:</span>
                  <span className="font-medium text-slate-700">
                    {strengthLabels[strengthScore - 1] || "Very Weak"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        index < strengthScore ? strengthColors[strengthScore - 1] : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Terms Checkbox */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }));
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                />
                <span className="text-xs text-slate-600">
                  {t("signUp.agreeText1")}{" "}
                  <a href="#terms" className="text-green-600 hover:underline font-medium">
                    {t("signUp.agreeText2")}
                  </a>{" "}
                  <a href="#privacy" className="text-green-600 hover:underline font-medium">
                    {t("signUp.agreeText3")}
                  </a>
                  .
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-xs text-red-500">{errors.terms}</p>
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
                  <span>{t("signUp.submitButton2")}</span>
                </>
              ) : (
                <>
                  <span>{t("signUp.submitButton")}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Footer note */}
            <p className="text-center text-xs sm:text-sm text-slate-600 pt-2">
              {t("signUp.alreadyHaveAccount")}{" "}
              <Link
                to="/login"
                className="text-green-600 hover:text-green-700 font-semibold hover:underline"
              >
                {t("signUp.signInLink")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
