import {
  Settings,
  LogOut,
  User,
  ChevronRight,
  Bell,
  TrendingUp,
  Globe,
  X,
  Key,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContex";
import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function SideBar({ showSettingsDrawer, setShowSettingsDrawer }) {
  const { lang, setLang } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [farmer, setFarmer] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(true);

  const [smsNotifications, setSmsNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);

  const fetchData = async () => {
    try {
      const profileRes = await api.get("/farmer/profile");
      if (profileRes?.data?.data) {
        setFarmer(profileRes.data.data.farmer);
        setIsProfileComplete(profileRes.data.data.isProfileComplete);
      }
    } catch (err) {
      toast.error("Something is wrong")
    }
  };

  useEffect(() => {
    if (showSettingsDrawer && user?.role === "farmer") {
      fetchData();
    }
  }, [showSettingsDrawer, user]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowSettingsDrawer(false);
      toast.success("User Logged Out");
      navigate("/login");
    } catch (error) {
      toast.error("Logout Failed");
    }
  };

  return (
    <>
      {showSettingsDrawer && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div
            className="fixed inset-0 "
            onClick={() => setShowSettingsDrawer(false)}
          />
          <div className="fixed top-18 right-4 sm:right-14 w-[calc(100vw-2rem)] sm:w-96 left-4 sm:left-auto max-w-sm bg-white rounded-xl shadow-2xl shadow-slate-900/20 flex flex-col z-10 max-h-[calc(100vh-5.5rem)] border border-slate-200 overflow-hidden">
            {/* Popover Header */}
            <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-900 p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Settings className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    Settings / सेटिंग्स
                  </h3>
                  <p className="text-xs text-green-100">
                    Kisan Portal Preferences
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowSettingsDrawer(false)}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Popover Body (Scrollable content) */}
            <div className="p-4 space-y-6 overflow-y-auto flex-1 min-h-0 text-slate-800 hide-scrollbar">
              {/* Farmer Profile Card */}
              <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200 flex items-center gap-3">
                <Link to="/farmer/dashboard" onClick={() => setShowSettingsDrawer(false)} className="w-12 h-12 rounded-2xl bg-green-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                  {farmer?.name ? farmer.name.charAt(0).toUpperCase() : "K"}
                </Link>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate">
                    {farmer?.name || "Kisan Brother"}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    {farmer?.village
                      ? `${farmer.village}, ${farmer.district}`
                      : user?.email || "Farmer Account"}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    {isProfileComplete
                      ? "Verified Profile ✓"
                      : "Incomplete Profile"}
                  </span>
                </div>
              </div>

              {/* Section 1: Account & KYC */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Account & KYC / खाता एवं प्रोफाइल
                </p>

                <Link
                  to="/farmer/profile"
                  onClick={() => setShowSettingsDrawer(false)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-green-600 hover:bg-green-50/50 flex items-center justify-between text-xs font-semibold text-slate-800 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-green-600" />
                    <span>Edit Farmer Profile (प्रोफ़ाइल संपादित करें)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-green-600 transition-colors" />
                </Link>

                <Link
                  to="/change-password"
                  onClick={() => setShowSettingsDrawer(false)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-green-600 hover:bg-green-50/50 flex items-center justify-between text-xs font-semibold text-slate-800 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Key className="w-4 h-4 text-green-600" />
                    <span>Change Password (पासवर्ड बदलें)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-green-600 transition-colors" />
                </Link>
              </div>

              {/* Section 2: Preferences & Toggles */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Preferences & Alerts / प्राथमिकताएं
                </p>

                <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-800">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-green-600" />
                    <div>
                      <p>SMS Queue Token Alerts</p>
                      <p className="text-[10px] text-slate-400 font-normal">
                        Receive token status via SMS
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-800">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <div>
                      <p>Mandi Rate Notifications</p>
                      <p className="text-[10px] text-slate-400 font-normal">
                        Daily MSP price updates
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={priceAlerts}
                    onChange={(e) => setPriceAlerts(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-800">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-green-600" />
                    <span>Portal Language (भाषा)</span>
                  </div>
                  <select
                    value={lang}
                    onChange={(e) => {
                      setLang(e.target.value);
                      toast.success(
                        `Language set to ${e.target.value === "hi" ? "हिंदी" : "English"}`
                      );
                    }}
                    className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
                  >
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Popover Footer */}
            <div className="p-5 border-t border-slate-200 bg-slate-50 shrink-0 space-y-3">
              
              <button
                onClick={handleLogout}
                className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-red-600/10 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out / लॉग आउट</span>
              </button>

              <p className="text-center text-[11px] text-slate-400">
                FarmLink Kisan Portal v1.0 • Verified Session
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
