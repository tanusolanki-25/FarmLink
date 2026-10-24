import { useState } from "react";
import { X, Wheat, Weight, Star, Loader2 } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const CROPS = [
  "Wheat", "Paddy (Rice)", "Maize", "Soybean", "Mustard",
  "Sunflower", "Cotton", "Groundnut", "Jowar", "Bajra", "Gram",
];

const QUALITY_OPTIONS = [
  { value: "A", label: "Grade A — Premium", color: "emerald" },
  { value: "B", label: "Grade B — Standard", color: "blue" },
  { value: "C", label: "Grade C — Below Standard", color: "amber" },
];

function ProcurementModal({ booking, onClose, onSuccess }) {
  const [crop, setCrop] = useState(booking?.procurement?.crop || "");
  const [quantity, setQuantity] = useState(booking?.procurement?.quantity || "");
  const [quality, setQuality] = useState(booking?.procurement?.quality || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!crop) return toast.error("Please select a crop");
    if (!quantity || Number(quantity) <= 0) return toast.error("Enter valid quantity");
    if (!quality) return toast.error("Please select quality grade");

    setLoading(true);
    try {
      await api.post(`/officer/procurement/${booking.id}`, {
        crop,
        quantity: Number(quantity),
        quality,
      });
      toast.success("Procurement details saved!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save procurement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-[fadeIn_.25s_ease]">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white relative">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Record Procurement</p>
              <h2 className="text-xl font-extrabold mt-0.5">Token #{booking.token || booking.id}</h2>
              <p className="text-sm text-indigo-100 mt-0.5">
                {booking.farmer?.name || "Farmer"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Crop */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              <span className="inline-flex items-center gap-1.5"><Wheat className="w-3.5 h-3.5 text-green-500" /> Crop Type</span>
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all cursor-pointer"
            >
              <option value="" disabled>-- Select crop --</option>
              {CROPS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              <span className="inline-flex items-center gap-1.5"><Weight className="w-3.5 h-3.5 text-green-500" /> Quantity (kg)</span>
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 500"
              min="1"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>

          {/* Quality */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              <span className="inline-flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-green-500" /> Quality Grade</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {QUALITY_OPTIONS.map((q) => (
                <button
                  key={q.value}
                  type="button"
                  onClick={() => setQuality(q.value)}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                    quality === q.value
                      ? "border-green-600 bg-indigo-50 text-green-700 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <div className="text-lg mb-0.5">
                    {q.value === "A" ? "🏆" : q.value === "B" ? "✅" : "⚠️"}
                  </div>
                  {q.label.split(" — ")[0]}
                  <div className={`text-[10px] font-normal mt-0.5 ${quality === q.value ? "text-green-500" : "text-slate-400"}`}>
                    {q.label.split(" — ")[1]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProcurementModal;
