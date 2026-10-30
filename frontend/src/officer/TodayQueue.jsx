import { useLanguage } from "../context/LanguageContext";
import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw, Clock, CheckCircle2,
  ShieldCheck, Loader2, Users, Megaphone,
  ClipboardList,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import BookingCard from "./BookingCard";


/* ─── Main TodayQueue Component ──────────────────────────────── */
function TodayQueue() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [callingNext, setCallingNext] = useState(false);
  const [currentToken, setCurrentToken] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchBookings = useCallback(async () => {
    try {
      const res = await api.get("/officer/today");
      const list = Array.isArray(res.data?.data) ? res.data.data
        : Array.isArray(res.data) ? res.data : [];
      setBookings(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  const handleCallNext = async () => {
    setCallingNext(true);
    try {
      const res = await api.patch("/officer/call-next");
      const token = res.data?.data ?? res.data;
      setCurrentToken(token);
      toast.success(`Now serving Token #${token}!`);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to call next");
    } finally {
      setCallingNext(false);
    }
  };

  const FILTERS = ["all", "pending", "verified", "approved", "rejected", "completed"];

  const filtered = filter === "all"
    ? bookings
    : bookings.filter((b) => b.status?.toLowerCase() === filter);

  const counts = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status?.toLowerCase() === "pending").length,
    verified: bookings.filter((b) => b.status?.toLowerCase() === "verified").length,
    approved: bookings.filter((b) => b.status?.toLowerCase() === "approved").length,
    completed: bookings.filter((b) => b.status?.toLowerCase() === "completed").length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-18 gap-3">
        <div className="w-6 h-6 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">{t("todayQueue.loadingQueue")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">

      {/* Call Next + Current Token */}
      <div className="bg-gradient-to-r from-emerald-700 to-green-700 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-indigo-600/20">
        <div className="text-white">
          <p className="text-xs font-semibold text-white uppercase tracking-wider">{t("todayQueue.currentlyServing")}</p>
          <h3 className="text-3xl font-extrabold mt-1">
            {currentToken !== null ? `Token #${currentToken}` : "—"}
          </h3>
          <p className="text-xs text-white mt-0.5">{t("todayQueue.pressCallNext")}</p>
        </div>
        <button
          onClick={handleCallNext}
          disabled={callingNext}
          className="px-6 py-3 rounded-xl bg-white text-green-700 hover:bg-indigo-50 font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70 shrink-0"
        >
          {callingNext
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Megaphone className="w-4 h-4" />
          }
          {t("todayQueue.callNextToken")}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t("todayQueue.totalToday"), value: counts.total, icon: Users, color: "green" },
          { label: t("todayQueue.pending"),     value: counts.pending, icon: Clock, color: "amber" },
          { label: t("todayQueue.verified"),    value: counts.verified, icon: ShieldCheck, color: "blue" },
          { label: t("todayQueue.completed"),   value: counts.completed, icon: CheckCircle2, color: "emerald" },
        ].map((s) => {
          const Icon = s.icon;
          const colors = {
            green: "bg-green-50 text-green-600 border-green-200",
            amber:  "bg-amber-50 text-amber-600 border-amber-200",
            blue:   "bg-blue-50 text-blue-600 border-blue-200",
            emerald:"bg-emerald-50 text-emerald-600 border-emerald-200",
          };
          return (
            <div key={s.label} className={`rounded-2xl border p-4 flex items-center gap-3 ${colors[s.color]}`}>
              <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold leading-none">{s.value}</p>
                <p className="text-xs font-medium opacity-70 mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
              filter === f
                ? "bg-green-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f === "all" ? `All (${counts.total})` : f}
          </button>
        ))}
        <button
          onClick={fetchBookings}
          className="ml-auto p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
          title="Refresh"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bookings Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-green-400 flex items-center justify-center mx-auto">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">{t("todayQueue.noBookingsTitle")}</h3>
          <p className="text-xs text-slate-500">
            {filter === "all" ? t("todayQueue.noBookingsAll") : t("todayQueue.noBookingsFilter")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onRefresh={fetchBookings}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TodayQueue;
