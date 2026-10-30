import { useLanguage } from "../context/LanguageContext";
import { useState, useEffect } from "react";
import {
  ShieldCheck, RefreshCw, ClipboardList, User,
  Users, Clock, CheckCircle2, Loader2, Building2,
} from "lucide-react";
import api from "../api/axios";
import TodayQueue from "./TodayQueue";
import OfficerProfile from "./OfficerProfile";

const OfficerDashboard = () => {
  const { t } = useLanguage();
  const [officer, setOfficer]       = useState(null);
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab]   = useState("queue");

  const fetchData = async () => {
    try {
      const [profileRes, bookingsRes] = await Promise.allSettled([
        api.get("/officer/profile"),
        api.get("/officer/today"),
      ]);

      if (profileRes.status === "fulfilled") {
        const data = profileRes.value.data?.data ?? profileRes.value.data;
        setOfficer(data);
      }

      if (bookingsRes.status === "fulfilled") {
          console.log("Bookings API Response:", bookingsRes.value.data);
        const list = Array.isArray(bookingsRes.value.data?.data)
          ? bookingsRes.value.data.data
          : Array.isArray(bookingsRes.value.data)
          ? bookingsRes.value.data
          : [];
           console.log("Final List:", list);
        setBookings(list);
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchData(); };

  /* ── Metric helpers ─────────────────────────── */
  const count = (status) =>
    bookings.filter((b) => b.status?.toLowerCase() === status).length;

  const metrics = [
    { label: t("officerDashboard.todayQueue"),  value: bookings.length, icon: Users,        from: "from-emerald-600", to: "to-green-500" },
    { label: t("officerDashboard.pending"),        value: count("pending"), icon: Clock,        from: "from-amber-500",  to: "to-orange-500" },
    { label: t("officerDashboard.verified"),       value: count("verified"), icon: ShieldCheck, from: "from-blue-500",   to: "to-cyan-500" },
    { label: t("officerDashboard.completed"),      value: count("completed"), icon: CheckCircle2, from: "from-emerald-500", to: "to-teal-500" },
  ];

  /* ── Tab config ─────────────────────────────── */
  const tabs = [
    { key: "queue",   label: t("officerDashboard.tabQueue"), icon: ClipboardList },
    { key: "profile", label: t("officerDashboard.tabProfile"),    icon: User },
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-green-400 text-white flex items-center justify-center animate-pulse">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-slate-600">{t("officerDashboard.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/80 py-3 sm:py-5 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* ── Hero Banner ────────────────────────────── */}
        <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -right-10 -top-10 w-52 h-52 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              {/* Role pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-white mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span>{t("officerDashboard.badge")}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {t("officerDashboard.greeting")}, {officer?.name || t("officerDashboard.defaultOfficer")}! 🏛️
              </h1>
              <p className="mt-1 text-sm text-white max-w-xl leading-relaxed">
                {officer?.center?.centerName
                  ? <>{t("officerDashboard.assignedCenter")} <strong>{officer.center.centerName}</strong>
                      {officer.center.district ? ` · ${officer.center.district}, ${officer.center.state}` : ""}</>
                  : t("officerDashboard.manageQueue")}
              </p>
            </div>

            {/* Refresh + Center Info */}
            <div className="flex items-center gap-3 shrink-0">
              {officer?.center && (
                <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white">
                  <Building2 className="w-4 h-4 text-white" />
                  <span className="font-semibold">{officer.center.centerName}</span>
                </div>
              )}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Metric Cards ───────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-all"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${m.from} ${m.to} flex items-center justify-center text-white shrink-0 shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 leading-none">{m.value}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{m.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Tab Bar ────────────────────────────────── */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeTab === tab.key
                    ? "bg-emerald-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ────────────────────────────── */}
        {activeTab === "queue"   && <TodayQueue />}
        {activeTab === "profile" && <OfficerProfile />}

      </div>
    </div>
  );
};

export default OfficerDashboard;
