import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  CreditCard,
  Building,
  ArrowRight,
  Loader2,
  Sprout,
  ShieldCheck,
  Award,
  Clock,
  Landmark,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContex";
import farmerImg from "../assets/farmer.jpg";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Bihar",
  "Chhattisgarh",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const FarmerForm = () => {
  const navigate = useNavigate();
  const { markProfileCompleted } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    adhaarNumber: "",
    address: "",
    village: "",
    district: "",
    state: "Madhya Pradesh",
  });

  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [agreeDeclaration, setAgreeDeclaration] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});

  // Check if farmer profile already exists to prefill
  useEffect(() => {
    const fetchExistingProfile = async () => {
      try {
        const res = await api.get("/farmer/profile");
        const existing = res.data?.data?.farmer || res.data?.data;
        if (existing) {
          setFormData({
            name: existing.name || "",
            fatherName: existing.fatherName || "",
            adhaarNumber: existing.adhaarNumber || "",
            address: existing.address || "",
            village: existing.village || "",
            district: existing.district || "",
            state: existing.state || "Madhya Pradesh",
          });
          setIsUpdateMode(true);
          setAgreeDeclaration(true);
        }
      } catch (err) {
        setIsUpdateMode(false);
      } finally {
        setFetching(false);
      }
    };

    fetchExistingProfile();
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required (पूरा नाम आवश्यक है)";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required (पता आवश्यक है)";
    }

    if (!formData.village.trim()) {
      newErrors.village = "Village / Gram Panchayat is required (गांव आवश्यक है)";
    }

    if (!formData.district.trim()) {
      newErrors.district = "District is required (जिला आवश्यक है)";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required (राज्य आवश्यक है)";
    }

    // Aadhaar number validation (if entered, must be 12 digits)
    const rawAadhaar = formData.adhaarNumber.replace(/\s/g, "");
    if (rawAadhaar && (!/^\d{12}$/.test(rawAadhaar))) {
      newErrors.adhaarNumber = "Please enter a valid 12-digit Aadhaar number";
    }

    if (!agreeDeclaration) {
      newErrors.declaration = "You must confirm the self-declaration to proceed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Formatting Aadhaar with spaces: XXXX XXXX XXXX
    if (name === "adhaarNumber") {
      const cleanVal = value.replace(/\D/g, "").slice(0, 12);
      const formatted = cleanVal.replace(/(\d{4})(?=\d)/g, "$1 ");
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fill in all required fields properly");
      return;
    }

    setLoading(true);

    try {
      const rawAadhaar = formData.adhaarNumber.replace(/\s/g, "") || undefined;

      const payload = {
        name: formData.name.trim(),
        fatherName: formData.fatherName.trim() || undefined,
        adhaarNumber: rawAadhaar,
        address: formData.address.trim(),
        village: formData.village.trim(),
        district: formData.district.trim(),
        state: formData.state.trim(),
      };

      if (isUpdateMode) {
        await api.put("/farmer/profile", payload);
        toast.success("Farmer profile updated successfully!");
      } else {
        await api.post("/farmer/register", payload);
        toast.success("Farmer profile completed successfully!");
      }

      if (markProfileCompleted) {
        markProfileCompleted();
      }

      // Redirect to farmer dashboard / bookings
      navigate("/farmer/dashboard");
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save farmer profile. Please try again.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // if (fetching) {
  //   return (
  //     <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
  //       <div className="flex flex-col items-center gap-3">
  //         <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
  //         <p className="text-sm font-medium text-slate-600">Loading farmer profile...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-green-50/60 via-slate-50 to-emerald-100/30">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-green-950/10 border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
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
              <span>Kisan KYC & Profile</span>
            </div>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white leading-tight">
              {isUpdateMode ? "Update Your" : "Complete Your"} <br />
              <span className="text-emerald-300">Farmer Profile.</span>
            </h2>
            <p className="mt-2 text-sm text-green-100/90 leading-relaxed">
              Verify your farm details to access official MSP grain procurement, digital queue tokens, and direct bank payouts.
            </p>
          </div>

          {/* Feature Highlights Cards */}
          <div className="relative z-10 space-y-3 my-6">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Direct Benefit Transfer (DBT)</h4>
                <p className="text-[11px] text-green-100/80">MSP amounts credited directly into bank account</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Priority Queue Booking</h4>
                <p className="text-[11px] text-green-100/80">Book center time slots and skip long tractor lines</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Government Certified</h4>
                <p className="text-[11px] text-green-100/80">Authorized mandi procurement receipts</p>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-green-100/80">
            <span>UIDAI & Land Record Compliance</span>
            <div className="flex items-center gap-1 font-semibold text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Kisan</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FARMER REGISTRATION FORM */}
        <div className="lg:col-span-7 p-4 sm:p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isUpdateMode ? "Farmer Profile Details" : "Register Farmer Profile"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Please enter your personal and village details as recorded in land revenue documents.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Father Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name (पूरा नाम) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar Patel"
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? "border-red-400 focus:ring-red-200"
                        : "border-slate-200 focus:border-green-600 focus:ring-green-100"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Father / Husband Name (पिता का नाम)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    placeholder="e.g. Shivram Patel"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Aadhaar Number */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Aadhaar Number (आधार कार्ड संख्या){" "}
                <span className="text-xs text-slate-400 font-normal">(Optional, for fast verification)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="adhaarNumber"
                  value={formData.adhaarNumber}
                  onChange={handleChange}
                  placeholder="XXXX XXXX XXXX"
                  maxLength={14}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 tracking-wide font-mono transition-all ${
                    errors.adhaarNumber
                      ? "border-red-400 focus:ring-red-200"
                      : "border-slate-200 focus:border-green-600 focus:ring-green-100"
                  }`}
                />
              </div>
              {errors.adhaarNumber && (
                <p className="mt-1 text-xs text-red-500">{errors.adhaarNumber}</p>
              )}
            </div>

            {/* Village & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Village / Gram Panchayat (गांव) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    placeholder="e.g. Rampur"
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errors.village
                        ? "border-red-400 focus:ring-red-200"
                        : "border-slate-200 focus:border-green-600 focus:ring-green-100"
                    }`}
                  />
                </div>
                {errors.village && (
                  <p className="mt-1 text-xs text-red-500">{errors.village}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  District (जिला) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="e.g. Indore"
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errors.district
                        ? "border-red-400 focus:ring-red-200"
                        : "border-slate-200 focus:border-green-600 focus:ring-green-100"
                    }`}
                  />
                </div>
                {errors.district && (
                  <p className="mt-1 text-xs text-red-500">{errors.district}</p>
                )}
              </div>
            </div>

            {/* State Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                State (राज्य) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition-all cursor-pointer"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Full Street / Farm Address */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Complete Residential Address (स्थाई पता) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                placeholder="House No, Ward No, Tehsil, Landmark..."
                className={`w-full px-3.5 py-2 rounded-xl border text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.address
                    ? "border-red-400 focus:ring-red-200"
                    : "border-slate-200 focus:border-green-600 focus:ring-green-100"
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-500">{errors.address}</p>
              )}
            </div>

            {/* Self-declaration checkbox */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeDeclaration}
                  onChange={(e) => {
                    setAgreeDeclaration(e.target.checked);
                    if (errors.declaration) setErrors((prev) => ({ ...prev, declaration: "" }));
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                />
                <span className="text-xs text-slate-600">
                  I hereby declare that the details provided above are true to the best of my knowledge and correspond to my authentic agricultural records for MSP procurement.
                </span>
              </label>
              {errors.declaration && (
                <p className="mt-1 text-xs text-red-500">{errors.declaration}</p>
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
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <span>{isUpdateMode ? "Update Farmer Profile" : "Save & Complete Profile"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FarmerForm;
