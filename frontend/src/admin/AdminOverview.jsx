import { useEffect, useState } from "react";
import {
  Building2, Users, ShieldCheck, Calendar, TrendingUp,
  IndianRupee, Loader2
} from "lucide-react";
import api from "../api/axios";

function StatCard({ icon: Icon, label, value, gradient, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-all">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shrink-0 shadow-md`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold text-slate-900 leading-none">{value ?? "—"}</p>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function StatusPill({ status, count }) {
  const map = {
    pending:   "bg-amber-100 text-amber-700 border-amber-200",
    verified:  "bg-blue-100 text-blue-700 border-blue-200",
    approved:  "bg-emerald-100 text-emerald-700 border-emerald-200",
    rejected:  "bg-red-100 text-red-700 border-red-200",
    completed: "bg-indigo-100 text-indigo-700 border-indigo-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${map[status?.toLowerCase()] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
      {count}
    </span>
  );
}

function AdminOverview({ stats, statsLoading }) {
  const [centers, setCenters] = useState([]);
  const [centersLoading, setCentersLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/centers")
      .then((res) => {
        const list = Array.isArray(res.data?.data) ? res.data.data
          : Array.isArray(res.data) ? res.data : [];
        setCenters(list);
      })
      .catch(console.error)
      .finally(() => setCentersLoading(false));
  }, []);

  const metricCards = [
    { icon: Users,        label: "Total Farmers",     value: stats?.farmers,       gradient: "from-green-500 to-emerald-800" },
    { icon: ShieldCheck,  label: "Total Officers",     value: stats?.officers,      gradient: "from-emerald-500 to-teal-500" },
    { icon: Building2,    label: "Procurement Centers",value: stats?.centers,       gradient: "from-blue-500 to-cyan-500" },
    { icon: Calendar,     label: "Today's Bookings",   value: stats?.todayBookings, gradient: "from-amber-500 to-orange-500" },
    { icon: TrendingUp,   label: "Total Bookings",     value: stats?.totalBookings, gradient: "from-teal-500 to-emerald-500" },
    { icon: IndianRupee,  label: "Total Paid Out",     value: stats?.paidAmount != null ? `₹${Number(stats.paidAmount).toLocaleString("en-IN")}` : "₹0",
      gradient: "from-green-500 to-emerald-800" },
  ];

  const byStatus = stats?.byStatus || {};

  return (
    <div className="space-y-6">

      {/* Metric Cards */}
      {statsLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {metricCards.map((c) => (
            <StatCard key={c.label} {...c} />
          ))}
        </div>
      )}

      {/* Booking Status Breakdown */}
      {!statsLoading && Object.keys(byStatus).length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Booking Status Breakdown</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                <StatusPill status={status} count={count} />
                <span className="text-xs text-slate-600 capitalize">{status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Center-wise Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-700">Procurement Centers Overview</h3>
          <span className="text-xs text-slate-400">{centers.length} centers</span>
        </div>

        {centersLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-green-500" />
          </div>
        ) : centers.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">No centers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Center Name", "District", "State", "Total Slots", "Available", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {centers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{c.centerName}</td>
                    <td className="px-5 py-3.5 text-slate-600">{c.district || "—"}</td>
                    <td className="px-5 py-3.5 text-slate-600">{c.state || "—"}</td>
                    <td className="px-5 py-3.5 text-slate-600">{c.totalSlots ?? "—"}</td>
                    <td className="px-5 py-3.5 text-slate-600">{c.availableSlots ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        c.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"}`} />
                        {c.status || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOverview;
