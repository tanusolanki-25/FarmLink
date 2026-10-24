import { useState, useEffect } from "react";
import {
  Navigation,
  Ticket,
  Users,
  Timer,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Hash,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

/* ── Stat card ───────────────────────────────────────── */
function StatCard({ label, value, sub, color, bg, border, Icon }) {
  return (
    <div className={`${bg} border ${border} rounded-2xl p-5 flex flex-col gap-1`}>
      <div className="flex items-center justify-between mb-1">
        <p className={`text-[10px] font-bold uppercase tracking-wider ${color} opacity-80`}>
          {label}
        </p>
        <Icon className={`w-4 h-4 ${color} opacity-60`} />
      </div>
      <h3 className={`text-2xl font-extrabold ${color}`}>{value}</h3>
      <p className="text-[11px] text-slate-500">{sub}</p>
    </div>
  );
}

/* ── Progress bar ────────────────────────────────────── */
function QueueProgress({ current, my }) {
  if (!my || my <= 0) return null;
  const pct = Math.min(100, Math.max(4, Math.round((current / my) * 100)));
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px] text-slate-500">
        <span>Queue Progress</span>
        <span className="font-semibold">
          Serving #{current} → Your token #{my}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────── */
const QueueTracker = () => {
  const [tokenInput, setTokenInput]     = useState("");
  const [bookingId, setBookingId]       = useState(null);
  const [queueData, setQueueData]       = useState(null);
  const [loading, setLoading]           = useState(false);
  const [refreshing, setRefreshing]     = useState(false);
  const [searched, setSearched]         = useState(false);

  /* Fetch queue by booking id */
  const fetchQueue = async (id, isRefresh = false) => {
    const trimmed = String(id).trim();
    if (!trimmed || isNaN(Number(trimmed))) {
      toast.error("Please enter a valid numeric Booking ID");
      return;
    }
    isRefresh ? setRefreshing(true) : setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/farmer/booking/${trimmed}/queue`);
      setQueueData(res.data?.data ?? res.data);
      setBookingId(Number(trimmed));
    } catch (err) {
      setQueueData(null);
      toast.error(
        err.response?.data?.message ?? "Could not fetch queue status. Check Booking ID."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchQueue(tokenInput);
  };

  const handleRefresh = () => {
    if (bookingId) fetchQueue(bookingId, true);
  };

  /* Auto-refresh every 30s when data is loaded */
  useEffect(() => {
    if (!bookingId) return;
    const interval = setInterval(() => fetchQueue(bookingId, true), 30_000);
    return () => clearInterval(interval);
  }, [bookingId]);

  const isDone =
    queueData &&
    queueData.peopleAhead !== undefined &&
    queueData.peopleAhead <= 0 &&
    queueData.currentServing >= queueData.myToken;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Live Queue Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter your Booking ID to check real-time queue position at the mandi center
          </p>
        </div>
        {queueData && (
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        )}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Hash className="w-4 h-4" />
          </div>
          <input
            type="number"
            min={1}
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Enter Booking ID  e.g. 12"
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !tokenInput}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold shadow-md shadow-green-600/20 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          <span>{loading ? "Checking..." : "Track Queue"}</span>
        </button>
      </form>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Checking live queue position...</p>
        </div>
      )}

      {/* Not found */}
      {!loading && searched && !queueData && (
        <div className="bg-white rounded-3xl border border-red-100 p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Queue Data Not Found</h3>
          <p className="text-xs text-slate-500 max-w-xs">
            No queue entry found for Booking ID <strong>#{tokenInput}</strong>.
            Make sure the booking exists and is active.
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && queueData && (
        <div className="space-y-4">
          {/* Done banner */}
          {isDone && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-800">Your turn has come!</p>
                <p className="text-xs text-emerald-600">
                  Proceed to the weighbridge with your token #{queueData.myToken}.
                </p>
              </div>
            </div>
          )}

          {/* Token badge */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-800 to-green-700 rounded-2xl px-5 py-4 text-white">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-green-200 font-semibold">Booking ID #{bookingId}</p>
              <h3 className="text-xl font-extrabold">Queue Token #{queueData.myToken}</h3>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="My Token"
              value={`#${queueData.myToken}`}
              sub="Assigned to you"
              color="text-green-700"
              bg="bg-green-50"
              border="border-green-200"
              Icon={Ticket}
            />
            <StatCard
              label="Now Serving"
              value={`#${queueData.currentServing ?? 0}`}
              sub="At weighbridge"
              color="text-blue-700"
              bg="bg-blue-50"
              border="border-blue-200"
              Icon={CheckCircle2}
            />
            <StatCard
              label="Ahead of You"
              value={queueData.peopleAhead > 0 ? queueData.peopleAhead : "—"}
              sub={queueData.peopleAhead > 0 ? "Vehicles ahead" : "Your turn now!"}
              color={queueData.peopleAhead > 0 ? "text-amber-700" : "text-emerald-700"}
              bg={queueData.peopleAhead > 0 ? "bg-amber-50" : "bg-emerald-50"}
              border={queueData.peopleAhead > 0 ? "border-amber-200" : "border-emerald-200"}
              Icon={Users}
            />
            <StatCard
              label="Est. Wait"
              value={
                queueData.estimatedWaitMinutes > 0
                  ? `~${queueData.estimatedWaitMinutes} min`
                  : "—"
              }
              sub={queueData.estimatedWaitMinutes > 0 ? "Approx wait time" : "Ready to proceed"}
              color={queueData.estimatedWaitMinutes > 0 ? "text-purple-700" : "text-emerald-700"}
              bg={queueData.estimatedWaitMinutes > 0 ? "bg-purple-50" : "bg-emerald-50"}
              border={queueData.estimatedWaitMinutes > 0 ? "border-purple-200" : "border-emerald-200"}
              Icon={Timer}
            />
          </div>

          {/* Progress bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <QueueProgress
              current={queueData.currentServing ?? 0}
              my={queueData.myToken}
            />
          </div>

          {/* Auto-refresh notice */}
          <p className="text-center text-[11px] text-slate-400">
            Queue position auto-refreshes every 30 seconds.
          </p>
        </div>
      )}

      {/* Initial state — no search yet */}
      {!searched && !loading && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
            <Navigation className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Track Your Queue Position</h3>
          <p className="text-xs text-slate-500 max-w-xs">
            Enter your Booking ID above to see your live queue position, vehicles ahead, and estimated wait time.
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            💡 Copy your Booking ID from the <strong>My Bookings</strong> tab
          </p>
        </div>
      )}
    </div>
  );
};

export default QueueTracker;