import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Plus,
  RefreshCw,
  Building2,
  Navigation,
  ArrowRight,
  Search,
} from "lucide-react";
import api from "../api/axios";
import MspRates from "./MspRates";
import QueueTracker from "./QueueTracker";
import BookSlot from "./BookSlot";
import MyBooking from "./MyBooking";
import BookingTracker from "./BookingTracker";
import CentersView from "./CentersView";
import MetricCardsForFarmerDashboard from "./MetricCardsForFarmerDashboard";

const FarmerDashboard = () => {
  const [farmer, setFarmer] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBookSlot, setShowBookSlot] = useState(false);

  // Active Tab: 'bookings' | 'book-slot' | 'msp-rates' | 'queue'
  const [activeTab, setActiveTab] = useState("bookings");

  const fetchData = async () => {
    try {
      const profileRes = await api.get("/farmer/profile").catch(() => null);
      if (profileRes?.data?.data) {
        setFarmer(profileRes.data.data.farmer);
        setIsProfileComplete(profileRes.data.data.isProfileComplete);
      }

      const bookingsRes = await api
        .get("/farmer/my-bookings")
        .catch(() => null);
      if (bookingsRes?.data) {
        const list = Array.isArray(bookingsRes.data.data)
          ? bookingsRes.data.data
          : Array.isArray(bookingsRes.data)
            ? bookingsRes.data
            : [];
        setBookings(list);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center animate-pulse">
            <Sprout className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-slate-600">
            Loading your farmer dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/80 py-2 px-4 sm:px-6 lg:px-6">
      <div className="max-w-9xl mx-auto space-y-2">
        {/* 1. INCOMPLETE PROFILE BANNER ALERT */}
        {!isProfileComplete && (
          <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-base">
                  Complete Your Farmer Profile / किसान प्रोफाइल पूरी करें
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                  You need to fill in your village, district, and address
                  details to unlock mandi queue slot booking and direct MSP
                  payments.
                </p>
              </div>
            </div>

            <Link
              to="/farmer/profile"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Complete Profile Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* 2. WELCOME HEADER BANNER */}
        <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-900 rounded-xl p-6 sm:p-8 text-white shadow-xl shadow-green-950/10 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-green-100 mb-3">
                <Sprout className="w-3.5 h-3.5 text-emerald-300" />
                <span>Kisan Dashboard</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Namaste, {farmer?.name || "Kisan Brother"}! 🌾
              </h1>
              <p className="mt-1 text-sm text-green-100 max-w-xl leading-relaxed">
                {farmer?.village ? (
                  <span>
                    Village: <strong>{farmer.village}</strong>, District:{" "}
                    <strong>{farmer.district}</strong> ({farmer.state})
                  </span>
                ) : (
                  "Welcome to the official FarmLink procurement portal. Manage your mandi queues and MSP tokens effortlessly."
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-3 rounded-xl bg-white/15 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer disabled:opacity-50"
                title="Refresh Dashboard Data"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>

              <button
                onClick={() => {
                  setActiveTab("bookings");
                  setShowBookSlot(true);
                }}
                className="px-5 py-3 rounded-xl bg-white text-emerald-900 hover:bg-green-50 font-bold text-xs shadow-lg shadow-black/10 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-700" />
                <span>Book Queue Token</span>
              </button>
            </div>
          </div>
           <BookSlot
              showBookSlot={showBookSlot}
              setShowBookSlot={setShowBookSlot}
            />
        </div>

        {/* 3. METRIC CARDS GRID */}
        <MetricCardsForFarmerDashboard />

        {/* 4. NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "bookings"
                ? "bg-green-600 text-white shadow-md shadow-green-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Bookings ({bookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("msp-rates")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "msp-rates"
                ? "bg-green-600 text-white shadow-md shadow-green-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>MSP Rates</span>
          </button>

          <button
            onClick={() => setActiveTab("queue")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "queue"
                ? "bg-green-600 text-white shadow-md shadow-green-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Live Token Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab("track")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "track"
                ? "bg-green-600 text-white shadow-md shadow-green-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Track Booking</span>
          </button>

          <button
            onClick={() => setActiveTab("centers")}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "centers"
                ? "bg-green-600 text-white shadow-md shadow-green-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Centers</span>
          </button>
        </div>

        {/* 5. TAB 1: MY BOOKINGS VIEW */}
        {activeTab === "bookings" && <MyBooking />}

        {/* 7. TAB 3: MSP RATES VIEW */}
        {activeTab === "msp-rates" && <MspRates />}

        {/* 8. TAB 4: LIVE QUEUE TRACKER VIEW */}
        {activeTab === "queue" && <QueueTracker />}

        {/* 9. TAB 5: TRACK BOOKING BY ID */}
        {activeTab === "track" && <BookingTracker />}

        {/* 10. TAB 6: CENTERS VIEW */}
        {activeTab === "centers" && <CentersView />}
      </div>
    </div>
  );
};

export default FarmerDashboard;
