import { useLanguage } from "../context/LanguageContext";
import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Loader2, ShieldCheck, X } from "lucide-react";

function AddOfficerModal({ centers, onClose, onSuccess }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", centerId: "",
  });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.email.trim()) return toast.error("Email is required");
    if (form.password.length < 6) return toast.error("Password must be ≥ 6 characters");
    if (!form.centerId) return toast.error("Please select a center");
    setLoading(true);
    try {
      await api.post("/admin/add-officer", {
        ...form, centerId: Number(form.centerId),
      });
      toast.success("Officer account created!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add officer");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-[fadeIn_.25s_ease] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-green-700 p-4 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div>
            <p className="text-xs font-semibold text-rose-200 uppercase tracking-wider">{t("addOfficerModal.newBadge")}</p>
            <h2 className="text-xl font-extrabold mt-0.5">{t("addOfficerModal.heading")}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {[
            { label: t("addOfficerModal.fullName"), k: "name", type: "text", placeholder: "Officer's full name" },
            { label: t("addOfficerModal.email"), k: "email", type: "email", placeholder: "officer@farmlink.gov.in" },
            { label: t("addOfficerModal.phone"), k: "phone", type: "tel", placeholder: "10-digit mobile number" },
            { label: t("addOfficerModal.password"), k: "password", type: "password", placeholder: "Min 6 characters" },
          ].map(({ label, k, type, placeholder }) => (
            <div key={k}>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">{label}</label>
              <input type={type} value={form[k]} placeholder={placeholder}
                onChange={(e) => set(k, e.target.value)} className={inputCls} />
            </div>
          ))}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">{t("addOfficerModal.assignCenter")}</label>
            <select value={form.centerId} onChange={(e) => set("centerId", e.target.value)} className={inputCls + " cursor-pointer"}>
              <option value="" disabled>{t("addOfficerModal.selectCenter")}</option>
              {centers.map((c) => (
                <option key={c.id} value={c.id}>{c.centerName} ({c.district || c.state})</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {t("addOfficerModal.createOfficer")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddOfficerModal;
