import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Sprout,
  ArrowRight,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Clock,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContex";
import fieldImg from "../assets/field.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please provide both email and password");
      return;
    }

    setLoading(true);

    try {
      const email = formData.email.trim().toLowerCase();
      const user = await login(email, formData.password);

      toast.success("Logged in successfully! Welcome back.");

       if (!user.profileCompleted) {
        if(user.role === "farmer"){
        navigate(`/${user.role}/register`);
        }
        else{
          navigate(`/${user.role}/dashboard`)
        }
      } else {
        navigate(`/${user.role}/dashboard`);
      } 
    } catch (err) {
      const status = err.response?.status;
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please check your credentials.";

      // If user registered but hasn't verified email OTP
      if (status === 403 && errMsg.toLowerCase().includes("not verified")) {
        toast.error("Account not verified. Redirecting to verification...");
        navigate("/verify-email", {
          state: { email: formData.email.trim().toLowerCase() },
        });
        return;
      }

      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-green-50/60 via-slate-50 to-emerald-100/30 p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-green-950/10 border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* LEFT COLUMN: HERO IMAGE & HIGHLIGHTS */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-8 text-white overflow-hidden bg-emerald-950">
          {/* Background Image with Dark Gradient Overlay */}
          <img
            src={fieldImg}
            alt="FarmLink Fields"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-700 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-emerald-900/40" />

          {/* Top Brand Tag */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-green-100">
              <Sprout className="w-4 h-4 text-emerald-300" />
              <span>Farmer Procurement Portal</span>
            </div>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white leading-tight">
              Welcome Back to <br />
              <span className="text-emerald-300">FarmLink.</span>
            </h2>
            <p className="mt-2 text-sm text-green-100/90 leading-relaxed">
              Log in to manage your crop appointments, check real-time queue tokens, and track government procurement payments.
            </p>
          </div>

          {/* Feature Highlights Cards */}
          <div className="relative z-10 space-y-3 my-6">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Live Queue Tracking</h4>
                <p className="text-[11px] text-green-100/80">Track your token position and avoid long mandi waits</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Verified MSP Pricing</h4>
                <p className="text-[11px] text-green-100/80">Government approved minimum support price records</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Digital Procurement Slips</h4>
                <p className="text-[11px] text-green-100/80">Instant receipts and direct bank payment receipts</p>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-green-100/80">
            <span>Fast & Secure Authentication</span>
            <div className="flex items-center gap-1 font-semibold text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Encrypted Session</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN FORM */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Enter your registered email and password to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
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

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-slate-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-green-600 hover:text-green-700 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                />
                <span className="text-xs text-slate-600">Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed mt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

             {/* Social Sign-In Divider & Button */}
          <div className="mt-2">
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-gray-200 w-full"></div>
              <span className="bg-white px-3 text-xs text-gray-400 uppercase font-medium">Or</span>
              <div className="border-t border-gray-200 w-full"></div>
            </div>
          </div>

            {/* Switch to Register */}
            <p className="text-center text-xs sm:text-sm text-slate-600 pt-3">
              Don't have an account yet?{" "}
              <Link
                to="/register"
                className="text-green-600 hover:text-green-700 font-semibold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
