import { useLanguage } from "../context/LanguageContext";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { Loader2, X } from "lucide-react";

const EMPTY_FORM = {
  centerName: "", contactNumber: "", code: "", state: "", district: "",
  address: "", pincode: "", managerName: "", openingTime: "09:00", closingTime: "17:00",
  totalSlots: "", latitude: "", longitude: "",
};

function CenterModal({ editing, onClose, onSuccess, centers }) {
  const { t } = useLanguage();
  const [form, setForm] = useState(editing
    ? {
        centerName:    editing.centerName    || "",
        contactNumber: editing.contactNumber || "",
        code:          editing.code          || "",
        state:         editing.state         || "",
        district:      editing.district      || "",
        address:       editing.address       || "",
        pincode:       editing.pincode       || "",
        managerName:   editing.managerName   || "",
        openingTime:   editing.openingTime   || "09:00",
        closingTime:   editing.closingTime   || "17:00",
        totalSlots:    editing.totalSlots    ?? "",
        latitude:      editing.latitude      ?? "",
        longitude:     editing.longitude     ?? "",
      }
    : { ...EMPTY_FORM }
  );
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.centerName.trim()) return toast.error("Center name is required");
    if (!form.code.trim()) return toast.error("Center code is required");
    if (!form.state.trim() || !form.district.trim()) return toast.error("State & district are required");
    setLoading(true);
    try {
      const payload = {
        ...form,
        totalSlots: Number(form.totalSlots),
        latitude:   Number(form.latitude),
        longitude:  Number(form.longitude),
      };
      if (editing) {
        await api.put(`/admin/centers/${editing.id}`, payload);
        toast.success("Center updated!");
      } else {
        await api.post("/admin/centers", payload);
        toast.success("Center created!");
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save center");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, k, type = "text", placeholder = "" }) => (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">{label}</label>
      <input
        type={type} value={form[k]} placeholder={placeholder}
        onChange={(e) => set(k, e.target.value)}
        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-[fadeIn_.25s_ease] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div>
            <p className="text-xs font-semibold text uppercase tracking-wider">{editing ? t("addCenterModal.editBadge") : t("addCenterModal.newBadge")}</p>
            <h2 className="text-xl font-extrabold mt-0.5">{editing ? editing.centerName : t("addCenterModal.addHeading")}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t("addCenterModal.centerName")} k="centerName" placeholder="e.g. Indore Mandi" />
            <Field label={t("addCenterModal.code")} k="code" placeholder="e.g. IND001" />
            <Field label={t("addCenterModal.state")} k="state" placeholder="e.g. Madhya Pradesh" />
            <Field label={t("addCenterModal.district")} k="district" placeholder="e.g. Indore" />
            <Field label={t("addCenterModal.address")} k="address" placeholder="Full address" />
            <Field label={t("addCenterModal.pincode")} k="pincode" placeholder="e.g. 452001" />
            <Field label={t("addCenterModal.contactNumber")} k="contactNumber" type="tel" placeholder="e.g. 0731-XXXXXXX" />
            <Field label={t("addCenterModal.managerName")} k="managerName" placeholder="In-charge officer" />
            <Field label={t("addCenterModal.openingTime")} k="openingTime" type="time" />
            <Field label={t("addCenterModal.closingTime")} k="closingTime" type="time" />
            <Field label={t("addCenterModal.totalSlots")} k="totalSlots" type="number" placeholder="e.g. 50" />
            <div /> {/* spacer */}
            <Field label={t("addCenterModal.latitude")} k="latitude" type="number" placeholder="e.g. 22.7196" />
            <Field label={t("addCenterModal.longitude")} k="longitude" type="number" placeholder="e.g. 75.8577" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 to-emerald-700 text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {editing ? t("addCenterModal.saveChanges") : t("addCenterModal.createCenter")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CenterModal;
