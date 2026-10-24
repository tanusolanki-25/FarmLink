import { useState } from "react";
import {
  Search,
  Ticket,
  Building,
  MapPin,
  Calendar,
  Clock,
  Navigation,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Hash,
  Users,
  Timer,
  Landmark,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

/* ─── Status helpers ─────────────────────────────────────── */
const STATUS_CONFIG = {
  approved:  { label: "Approved",     bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200", Icon: CheckCircle2,  iconColor: "text-emerald-600" },
  completed: { label: "Completed",    bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200", Icon: CheckCircle2,  iconColor: "text-emerald-600" },
  verified:  { label: "Verified",     bg: "bg-blue-100",    text: "text-blue-800",    border: "border-blue-200",    Icon: ShieldCheck,   iconColor: "text-blue-600"    },
  rejected:  { label: "Cancelled",    bg: "bg-red-100",     text: "text-red-800",     border: "border-red-200",     Icon: XCircle,       iconColor: "text-red-600"     },
  pending:   { label: "Pending Queue",bg: "bg-amber-100",   text: "text-amber-800",   border: "border-amber-200",   Icon: Clock,         iconColor: "text-amber-600"   },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_CONFIG.pending;
  const { Icon } = cfg;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <Icon className={`w-3.5 h-3.5 ${cfg.iconColor}`} />
      {cfg.label}
    </span>
  );
}


/* ─── Main Component ─────────────────────────────────────── */
export default function BookingTracker() {
  const [inputId, setInputId]       = useState("");
  const [booking, setBooking]       = useState(null);
  const [queue, setQueue]           = useState(null);
  const [loading, setLoading]       = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searched, setSearched]     = useState(false);

  const fetchBooking = async (id, isRefresh = false) => {
    const trimmedId = String(id).trim();
    if (!trimmedId || isNaN(Number(trimmedId))) {
      toast.error("Please enter a valid numeric Booking ID");
      return;
    }

    isRefresh ? setRefreshing(true) : setLoading(true);
    setSearched(true);

    try {
      const [bookingRes, queueRes] = await Promise.allSettled([
        api.get(`/farmer/booking/${trimmedId}`),
        api.get(`/farmer/booking/${trimmedId}/queue`),
      ]);

      if (bookingRes.status === "fulfilled") {
        setBooking(bookingRes.value.data?.data ?? bookingRes.value.data);
      } else {
        setBooking(null);
        toast.error(
          bookingRes.reason?.response?.data?.message ?? "Booking not found"
        );
      }

      if (queueRes.status === "fulfilled") {
        setQueue(queueRes.value.data?.data ?? queueRes.value.data);
      } else {
        setQueue(null);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooking(inputId);
  };

  const handleRefresh = () => {
    if (booking?.id) fetchBooking(booking.id, true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Track Booking by ID</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter your Booking ID to view full details and live queue position
          </p>
        </div>
        {booking && (
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        )}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Hash className="w-4 h-4" />
          </div>
          <input
            type="number"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            placeholder="Enter Booking ID  e.g. 12"
            min={1}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !inputId}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold shadow-md shadow-green-600/20 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span>{loading ? "Searching..." : "Track"}</span>
        </button>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 flex flex-col items-center gap-3 shadow-sm">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Fetching booking details...</p>
        </div>
      )}

      {/* Not Found */}
      {!loading && searched && !booking && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 flex flex-col items-center gap-3 shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Booking Not Found</h3>
          <p className="text-xs text-slate-500 max-w-xs">
            No booking found with ID <strong>#{inputId}</strong>. Please check the ID and try again.
          </p>
        </div>
      )}

      {/* Booking Detail Card */}
      {!loading && booking && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Card Top Bar */}
          <div className="bg-gradient-to-r from-emerald-800 to-green-700 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[11px] text-green-200 font-semibold uppercase tracking-wider">Queue Token</p>
                <h3 className="text-2xl font-extrabold text-white">
                  #TK-{booking.token ?? booking.id}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <StatusBadge status={booking.status} />
              <p className="text-[11px] text-green-200 mt-1.5">Booking ID: #{booking.id}</p>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-5">
            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Center Name */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Building className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Procurement Center</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {booking.center?.centerName ?? `Center #${booking.centerId}`}
                  </p>
                  {booking.center?.district && (
                    <p className="text-xs text-slate-500">{booking.center.district}, {booking.center.state}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              {booking.center?.location && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Location</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{booking.center.location}</p>
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Appointment Date</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {new Date(booking.date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Time Slot</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{booking.time}</p>
                </div>
              </div>

              {/* Payment (if exists) */}
              {booking.payment && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                    <Landmark className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Payment</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      ₹{booking.payment.amount?.toLocaleString("en-IN") ?? "—"}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">{booking.payment.status}</p>
                  </div>
                </div>
              )}

              {/* Procurement (if exists) */}
              {booking.procurement && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Procurement</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {booking.procurement.quantity ?? "—"} Quintals
                    </p>
                    <p className="text-xs text-slate-500">{booking.procurement.crop ?? ""}</p>
                  </div>
                </div>
              )}
            </div>

            {/* No queue data */}
            {!queue && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400 text-center">
                  Live queue data unavailable for this booking.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
