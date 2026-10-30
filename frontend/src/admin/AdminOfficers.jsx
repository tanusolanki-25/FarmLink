import { useLanguage } from "../context/LanguageContext";
import { useState, useEffect, useCallback } from "react";
import {
  Plus, X, Loader2, ShieldCheck, Building2,
  Mail, Phone, RefreshCw,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import AddOfficerModal from "./AddOfficer";

/* ── Officer Card ──────────────────────────────────────────────── */
function OfficerCard({ officer, centers, onReassign }) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(officer.center?.id?.toString() || "");
  const [loading, setLoading] = useState(false);

  const handleReassign = async () => {
    if (!selected || Number(selected) === officer.center?.id) return;
    setLoading(true);
    try {
      await api.patch(`/admin/officers/${officer.id}/center`, { centerId: Number(selected) });
      toast.success("Center reassigned!");
      onReassign();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reassign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center text-lg font-extrabold text-green-600 shrink-0">
          {(officer.name || "O").charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 text-sm truncate">{officer.name || "—"}</h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
            <Mail className="w-3 h-3 shrink-0" />
            <span className="truncate">{officer.user?.email || "—"}</span>
          </div>
          {officer.user?.phone && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Phone className="w-3 h-3 shrink-0" />
              <span>{officer.user.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Current Center */}
      {officer.center && (
        <div className="flex items-center gap-2 bg-violet-50 border border-green-100 rounded-xl px-3 py-2 text-xs text-green-600">
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold truncate">{officer.center.centerName}</span>
        </div>
      )}

      {/* Reassign */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("adminOfficers.reassignCenter")}</p>
        <div className="flex gap-2">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:border-green-400 outline-none cursor-pointer transition-all"
          >
            <option value="" disabled>{t("adminOfficers.selectCenter")}</option>
            {centers.map((c) => (
              <option key={c.id} value={c.id}>{c.centerName}</option>
            ))}
          </select>
          <button
            onClick={handleReassign}
            disabled={loading || !selected || Number(selected) === officer.center?.id}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs font-bold cursor-pointer disabled:opacity-40 flex items-center gap-1 transition-all hover:from-emerald-700 hover:to-green-700"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : t("adminOfficers.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────────── */
function AdminOfficers() {
  const { t } = useLanguage();
  const [officers, setOfficers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [oRes, cRes] = await Promise.allSettled([
        api.get("/admin/officers"),
        api.get("/admin/centers"),
      ]);
      if (oRes.status === "fulfilled") {
        const list = Array.isArray(oRes.value.data?.data) ? oRes.value.data.data
          : Array.isArray(oRes.value.data) ? oRes.value.data : [];
        setOfficers(list);
      }
      if (cRes.status === "fulfilled") {
        const list = Array.isArray(cRes.value.data?.data) ? cRes.value.data.data
          : Array.isArray(cRes.value.data) ? cRes.value.data : [];
        setCenters(list);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = officers.filter((o) =>
    o.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    o.center?.centerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="space-y-3">
        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={t("adminOfficers.searchPlaceholder")}
            className="w-full sm:flex-1 sm:min-w-48 px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all"
          />
          <button onClick={fetchAll} className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-rose-600/20 hover:from-emerald-700 hover:to-green-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {t("adminOfficers.addOfficer")}
          </button>
        </div>

        <p className="text-xs text-slate-400">{filtered.length} {t("adminOfficers.officersFound")}</p>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-500">
              {search ? t("adminOfficers.noMatchSearch") : t("adminOfficers.noOfficers")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((o) => (
              <OfficerCard key={o.id} officer={o} centers={centers} onReassign={fetchAll} />
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <AddOfficerModal
          centers={centers}
          onClose={() => setShowAdd(false)}
          onSuccess={fetchAll}
        />
      )}
    </>
  );
}

export default AdminOfficers;
