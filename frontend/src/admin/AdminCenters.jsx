import { useLanguage } from "../context/LanguageContext";
import { useState, useEffect, useCallback } from "react";
import {
  Plus, Pencil, Trash2, Loader2, Building2,
  MapPin, Phone, Clock, Users, RefreshCw,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import CenterModal from "./AddCenter";

/* ── Main Component ────────────────────────────────────────────── */
function AdminCenters() {
  const { t } = useLanguage();
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "add" | centerObj (edit)

  const fetchCenters = useCallback(async () => {
    try {
      const res = await api.get("/admin/centers");
      const list = Array.isArray(res.data?.data) ? res.data.data
        : Array.isArray(res.data) ? res.data : [];
      setCenters(list);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCenters(); }, [fetchCenters]);

  const handleDelete = async (center) => {
    if (!window.confirm(`Delete "${center.centerName}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/centers/${center.id}`);
      toast.success("Center deleted");
      fetchCenters();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cannot delete center");
    }
  };

  const filtered = centers.filter((c) =>
    c.centerName?.toLowerCase().includes(search.toLowerCase()) ||
    c.district?.toLowerCase().includes(search.toLowerCase()) ||
    c.state?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="space-y-3">
        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={t("adminCenters.searchPlaceholder")}
            className="w-full sm:flex-1 sm:min-w-48 px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all"
          />
          <button onClick={fetchCenters} className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setModal("add")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-rose-600/20 hover:from-emerald-700 hover:to-green-700 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" /> {t("adminCenters.addCenter")}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-500">
              {search ? t("adminCenters.noMatchSearch") : t("adminCenters.noCenters")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{c.centerName}</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{c.code}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                    c.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${c.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"}`} />
                    {c.status || "—"}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />{c.district}, {c.state} {c.pincode && `— ${c.pincode}`}</div>
                  {c.contactNumber && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />{c.contactNumber}</div>}
                  {c.openingTime && <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" />{c.openingTime} – {c.closingTime}</div>}
                  {c.totalSlots && <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 shrink-0 text-slate-400" />{c.availableSlots ?? "—"} / {c.totalSlots} slots</div>}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => setModal(c)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> {t("adminCenters.editCenter")}
                  </button>
                  <button
                    onClick={() => handleDelete(c)}
                    className="flex-1 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> {t("adminCenters.deleteCenter")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <CenterModal
          editing={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSuccess={fetchCenters}
        />
      )}
    </>
  );
}

export default AdminCenters;
