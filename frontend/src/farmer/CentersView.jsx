import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  Navigation,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  Layers,
  LocateFixed,
  AlertTriangle,
  Hash,
  Users,
  CalendarClock,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

/* ── Status badge ─────────────────────────────────────── */
function StatusPill({ status }) {
  const active = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
        active
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-red-50 text-red-600 border-red-200"
      }`}
    >
      {active ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : (
        <XCircle className="w-3 h-3" />
      )}
      {active ? "Active" : "Inactive"}
    </span>
  );
}

/* ── Slot bar ─────────────────────────────────────────── */
function SlotBar({ available, total }) {
  const pct = total > 0 ? Math.round((available / total) * 100) : 0;
  const color =
    pct > 50 ? "bg-emerald-500" : pct > 20 ? "bg-amber-400" : "bg-red-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] text-slate-500">
        <span>Slots Available</span>
        <span className="font-semibold text-slate-700">
          {available} / {total}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ── Single center card ───────────────────────────────── */
function CenterCard({ center, isNearby }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* Card top bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              {center.centerName}
            </h3>
            <p className="text-[11px] text-slate-500">
              Code: <span className="font-semibold text-slate-700">{center.code}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusPill status={center.status} />
          {isNearby && center.distance !== undefined && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600">
              <Navigation className="w-3 h-3" />
              {center.distance.toFixed(1)} km
            </span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="px-5 py-4 space-y-3 flex-1">
        {/* Location */}
        <div className="flex items-start gap-2 text-xs text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <span>
            {center.address}, {center.district}, {center.state} –{" "}
            <span className="font-semibold">{center.pincode}</span>
          </span>
        </div>

        {/* Contact */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <a
            href={`tel:${center.contactNumber}`}
            className="hover:text-green-600 transition-colors font-medium"
          >
            {center.contactNumber}
          </a>
        </div>

        {/* Timings */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            {center.openingTime} – {center.closingTime}
          </span>
        </div>

        {/* Manager */}
        {center.managerName && (
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Manager: <span className="font-semibold text-slate-700">{center.managerName}</span></span>
          </div>
        )}

        {/* Slot bar */}
        <div className="pt-1">
          <SlotBar available={center.availableSlots} total={center.totalSlots} />
        </div>
      </div>
    </div>
  );
}

/* ── Empty state ──────────────────────────────────────── */
function EmptyState({ message }) {
  return (
    <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-12 flex flex-col items-center gap-3 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
        <Building2 className="w-7 h-7 text-slate-400" />
      </div>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────── */
export default function CentersView() {
  const [activeTab, setActiveTab] = useState("all"); // "all" | "nearby"

  // All centers
  const [allCenters, setAllCenters]     = useState([]);
  const [allLoading, setAllLoading]     = useState(true);

  // Nearby centers
  const [nearbyCenters, setNearbyCenters] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [locationFetched, setLocationFetched] = useState(false);

  /* fetch all centers on mount */
  useEffect(() => {
    api
      .get("/farmer/centers")
      .then((res) => {
        const list = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];
        setAllCenters(list);
      })
      .catch(() => toast.error("Failed to load centers"))
      .finally(() => setAllLoading(false));
  }, []);

  /* fetch nearby centers using browser geolocation */
  const fetchNearbyCenters = () => {
    setLocationError(null);
    setNearbyLoading(true);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setNearbyLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await api.get("/farmer/nearby-centers", {
            params: { lat: latitude, long: longitude },
          });
          const list = Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
            ? res.data
            : [];
          setNearbyCenters(list);
          setLocationFetched(true);
        } catch {
          toast.error("Failed to fetch nearby centers");
        } finally {
          setNearbyLoading(false);
        }
      },
      (err) => {
        setNearbyLoading(false);
        const msg =
          err.code === 1
            ? "Location access denied. Please allow location in browser settings."
            : "Could not determine your location. Try again.";
        setLocationError(msg);
      },
      { timeout: 10000 }
    );
  };

  /* auto-fetch nearby when tab is switched to "nearby" */
  useEffect(() => {
    if (activeTab === "nearby" && !locationFetched && !nearbyLoading) {
      fetchNearbyCenters();
    }
  }, [activeTab]);

  const stats = {
    total:     allCenters.length,
    active:    allCenters.filter((c) => c.status === "active").length,
    totalSlots: allCenters.reduce((s, c) => s + (c.totalSlots ?? 0), 0),
    freeSlots:  allCenters.reduce((s, c) => s + (c.availableSlots ?? 0), 0),
  };

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Procurement Centers</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Government mandi centers available for slot booking
          </p>
        </div>

        {activeTab === "nearby" && (
          <button
            onClick={fetchNearbyCenters}
            disabled={nearbyLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${nearbyLoading ? "animate-spin" : ""}`} />
            Refresh Location
          </button>
        )}
      </div>

      {/* ── Stats row (only All tab) ── */}
      {activeTab === "all" && !allLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Centers", value: stats.total,      Icon: Building2,    color: "text-blue-600",    bg: "bg-blue-50 border-blue-100" },
            { label: "Active Centers", value: stats.active,    Icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
            { label: "Total Slots",    value: stats.totalSlots, Icon: CalendarClock, color: "text-purple-600", bg: "bg-purple-50 border-purple-100" },
            { label: "Free Slots",     value: stats.freeSlots,  Icon: Hash,         color: "text-amber-600",   bg: "bg-amber-50 border-amber-100" },
          ].map(({ label, value, Icon, color, bg }) => (
            <div key={label} className={`rounded-2xl border p-4 flex items-center gap-3 ${bg}`}>
              <Icon className={`w-5 h-5 shrink-0 ${color}`} />
              <div>
                <p className="text-[11px] text-slate-500 font-medium">{label}</p>
                <p className={`text-xl font-extrabold ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Sub-tabs ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "all"
              ? "bg-green-600 text-white shadow-md shadow-green-600/20"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Layers className="w-4 h-4" />
          All Centers ({allCenters.length})
        </button>
        <button
          onClick={() => setActiveTab("nearby")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "nearby"
              ? "bg-green-600 text-white shadow-md shadow-green-600/20"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <LocateFixed className="w-4 h-4" />
          Nearby Centers
          {locationFetched && (
            <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
              {nearbyCenters.length}
            </span>
          )}
        </button>
      </div>

      {/* ── All Centers ── */}
      {activeTab === "all" && (
        <>
          {allLoading ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 flex flex-col items-center gap-3">
              <div className="w-9 h-9 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Loading centers...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {allCenters.length === 0 ? (
                <EmptyState message="No procurement centers registered yet." />
              ) : (
                allCenters.map((c) => (
                  <CenterCard key={c.id} center={c} isNearby={false} />
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* ── Nearby Centers ── */}
      {activeTab === "nearby" && (
        <>
          {nearbyLoading ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 flex flex-col items-center gap-3">
              <LocateFixed className="w-8 h-8 text-green-600 animate-pulse" />
              <p className="text-xs text-slate-500 font-medium">
                Detecting your location...
              </p>
              <p className="text-[11px] text-slate-400">
                Please allow location access if prompted
              </p>
            </div>
          ) : locationError ? (
            <div className="bg-white rounded-3xl border border-red-100 p-10 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-sm font-semibold text-slate-800">Location Error</p>
              <p className="text-xs text-slate-500 max-w-xs">{locationError}</p>
              <button
                onClick={fetchNearbyCenters}
                className="mt-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {nearbyCenters.length === 0 ? (
                <EmptyState message="No centers found near your location." />
              ) : (
                nearbyCenters.map((c) => (
                  <CenterCard key={c.id} center={c} isNearby={true} />
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
