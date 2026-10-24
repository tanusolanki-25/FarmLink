import { useState, useEffect, useCallback } from "react";
import {
  Building2, TrendingUp, Calendar, CheckCircle2,
  XCircle, PackageCheck, Loader2, RefreshCw,
  BarChart3, ArrowUpDown, Search,
} from "lucide-react";
import api from "../api/axios";

/* ── Progress Bar ────────────────────────────────────────────── */
function ProgressBar({ value, max, color = "bg-rose-500" }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ── Status Pill ─────────────────────────────────────────────── */
function Pill({ value, color }) {
  const map = {
    emerald: "bg-emerald-100 text-emerald-700",
    red:     "bg-red-100 text-red-700",
    indigo:  "bg-indigo-100 text-indigo-700",
    amber:   "bg-amber-100 text-amber-700",
    slate:   "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${map[color] || map.slate}`}>
      {value}
    </span>
  );
}

/* ── Summary Metric Card ─────────────────────────────────────── */
function MetricCard({ label, value, icon: Icon, gradient, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shrink-0 shadow-md`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900 leading-none">{value ?? "—"}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────── */
function AdminReports() {
  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [sortBy, setSortBy]     = useState("total"); // total | todayBooked | approved | completed
  const [sortDir, setSortDir]   = useState("desc");  // asc | desc
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/reports");
      const data = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data) ? res.data : [];
      setReports(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Reports fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  /* ── Derived values ── */
  const totalAllBookings  = reports.reduce((s, r) => s + (r.total || 0), 0);
  const totalTodayBooked  = reports.reduce((s, r) => s + (r.todayBooked || 0), 0);
  const totalApproved     = reports.reduce((s, r) => s + (r.approved || 0), 0);
  const totalCompleted    = reports.reduce((s, r) => s + (r.completed || 0), 0);
  const totalRejected     = reports.reduce((s, r) => s + (r.rejected || 0), 0);

  /* ── Filter + Sort ── */
  const filtered = reports
    .filter((r) =>
      !search ||
      r.centerName?.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const av = a[sortBy] ?? 0;
      const bv = b[sortBy] ?? 0;
      return sortDir === "desc" ? bv - av : av - bv;
    });

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortBy(col); setSortDir("desc"); }
  };

  const SortTh = ({ col, label }) => (
    <th
      onClick={() => toggleSort(col)}
      className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-600 select-none whitespace-nowrap"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className={`w-3 h-3 ${sortBy === col ? "text-green-500" : "text-slate-300"}`} />
      </span>
    </th>
  );

  return (
    <div className="space-y-6">

      {/* ── Summary Cards ── */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
          <MetricCard label="Total Bookings"    value={totalAllBookings}  icon={TrendingUp}   gradient="from-emerald-500 to-green-500" />
          <MetricCard label="Today's Bookings"  value={totalTodayBooked}  icon={Calendar}     gradient="from-amber-500 to-orange-400" />
          <MetricCard label="Approved"          value={totalApproved}     icon={CheckCircle2} gradient="from-emerald-500 to-teal-500" />
          <MetricCard label="Completed"         value={totalCompleted}    icon={PackageCheck} gradient="from-indigo-500 to-violet-500" />
          <MetricCard label="Rejected"          value={totalRejected}     icon={XCircle}      gradient="from-slate-500 to-slate-600" />
        </div>
      )}

      {/* ── Table Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Center-wise Booking Report</h3>
              {lastUpdated && (
                <p className="text-[11px] text-slate-400">
                  Updated: {lastUpdated.toLocaleTimeString("en-IN")}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search center..."
                className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:border-green-400 outline-none w-44 transition-all"
              />
            </div>
            {/* Refresh */}
            <button
              onClick={fetchReports}
              disabled={loading}
              title="Refresh"
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-400">
              {search ? "No centers match your search." : "No report data available."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Center</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Capacity</th>
                  <SortTh col="todayBooked" label="Today" />
                  <SortTh col="total"       label="Total" />
                  <SortTh col="approved"    label="Approved" />
                  <SortTh col="rejected"    label="Rejected" />
                  <SortTh col="completed"   label="Completed" />
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Utilisation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => {
                  const utilPct = row.capacity > 0
                    ? Math.min(100, Math.round((row.todayBooked / row.capacity) * 100))
                    : 0;
                  const utilColor =
                    utilPct >= 80 ? "text-red-600" :
                    utilPct >= 50 ? "text-amber-600" :
                    "text-emerald-600";

                  return (
                    <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Center */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm leading-tight">{row.centerName}</p>
                            <p className="text-[11px] text-slate-400">{row.location || "—"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Capacity */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-slate-700">{row.capacity ?? "—"}</span>
                        <p className="text-[11px] text-slate-400">slots</p>
                      </td>

                      {/* Today */}
                      <td className="px-5 py-4">
                        <Pill value={row.todayBooked || 0} color="amber" />
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-slate-800">{row.total || 0}</span>
                      </td>

                      {/* Approved */}
                      <td className="px-5 py-4">
                        <Pill value={row.approved || 0} color="emerald" />
                      </td>

                      {/* Rejected */}
                      <td className="px-5 py-4">
                        <Pill value={row.rejected || 0} color="red" />
                      </td>

                      {/* Completed */}
                      <td className="px-5 py-4">
                        <Pill value={row.completed || 0} color="indigo" />
                      </td>

                      {/* Utilisation */}
                      <td className="px-5 py-4 min-w-[120px]">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${utilColor}`}>{utilPct}%</span>
                            <span className="text-[10px] text-slate-400">{row.todayBooked}/{row.capacity ?? "?"}</span>
                          </div>
                          <ProgressBar
                            value={row.todayBooked || 0}
                            max={row.capacity || 1}
                            color={utilPct >= 80 ? "bg-red-500" : utilPct >= 50 ? "bg-amber-500" : "bg-emerald-500"}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Totals Footer */}
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200">
                  <td className="px-5 py-3 text-xs font-bold text-slate-700">
                    TOTAL ({filtered.length} centers)
                  </td>
                  <td className="px-5 py-3" />
                  <td className="px-5 py-3">
                    <Pill value={filtered.reduce((s, r) => s + (r.todayBooked || 0), 0)} color="amber" />
                  </td>
                  <td className="px-5 py-3 text-sm font-extrabold text-slate-900">
                    {filtered.reduce((s, r) => s + (r.total || 0), 0)}
                  </td>
                  <td className="px-5 py-3">
                    <Pill value={filtered.reduce((s, r) => s + (r.approved || 0), 0)} color="emerald" />
                  </td>
                  <td className="px-5 py-3">
                    <Pill value={filtered.reduce((s, r) => s + (r.rejected || 0), 0)} color="red" />
                  </td>
                  <td className="px-5 py-3">
                    <Pill value={filtered.reduce((s, r) => s + (r.completed || 0), 0)} color="indigo" />
                  </td>
                  <td className="px-5 py-3" />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReports;
