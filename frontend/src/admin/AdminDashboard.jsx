import { useState, useEffect } from "react";
import {
  LayoutDashboard, Building2, ShieldCheck, Users,
  RefreshCw, UserCog, BarChart3,
} from "lucide-react";
import api from "../api/axios";
import AdminOverview from "./AdminOverview";
import AdminCenters from "./AdminCenters";
import AdminOfficers from "./AdminOfficers";
import AdminUsers from "./AdminUsers";
import AdminReports from "./AdminReports";

const TABS = [
  { key: "overview",  label: "Overview",  icon: LayoutDashboard },
  { key: "reports",   label: "Reports",   icon: BarChart3 },
  { key: "centers",   label: "Centers",   icon: Building2 },
  { key: "officers",  label: "Officers",  icon: ShieldCheck },
  { key: "users",     label: "Users",     icon: Users },
];

const AdminDashboard = () => {
  const [stats, setStats]         = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      const data = res.data?.data ?? res.data;
      setStats(data);
    } catch (err) {
      console.error("Stats load error:", err);
    } finally {
      setStatsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchStats(); };

  if (statsLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center animate-pulse">
            <UserCog className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-slate-50/80 py-2">
      <div className="max-w-9xl mx-auto space-y-3 px-7">

        {/* ── Hero Banner ─────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-rose-950/20 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -right-12 -top-12 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-44 h-44 bg-violet-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              {/* Role pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text mb-3">
                <UserCog className="w-3.5 h-3.5 text" />
                <span>Admin Dashboard</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                FarmLink Control Panel 🛡️
              </h1>
              <p className="mt-1 text-sm text max-w-xl leading-relaxed">
                Manage procurement centers, officers, and monitor all platform activity from one place.
              </p>
            </div>

            {/* Quick Stats + Refresh */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              {[
                { label: "Farmers",  value: stats?.farmers  ?? "—" },
                { label: "Officers", value: stats?.officers ?? "—" },
                { label: "Centers",  value: stats?.centers  ?? "—" },
              ].map((s) => (
                <div key={s.label} className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[70px]">
                  <p className="text-lg font-extrabold text-white leading-none">{s.value}</p>
                  <p className="text-[11px] text font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer disabled:opacity-50"
                title="Refresh stats"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Tab Bar ─────────────────────────────────────────── */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-rose-600/20"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ─────────────────────────────────────── */}
        {activeTab === "overview"  && <AdminOverview stats={stats} statsLoading={statsLoading} />}
        {activeTab === "reports"   && <AdminReports />}
        {activeTab === "centers"   && <AdminCenters />}
        {activeTab === "officers"  && <AdminOfficers />}
        {activeTab === "users"     && <AdminUsers />}

      </div>
    </div>
  );
};

export default AdminDashboard;
