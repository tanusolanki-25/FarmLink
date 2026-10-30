import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useState } from "react";
import { Loader2, ThumbsUp } from "lucide-react";

function ApproveModal({ booking, onClose, onSuccess }) {
  const { t } = useLanguage();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!amount || Number(amount) <= 0) return toast.error("Enter valid payment amount");
    setLoading(true);
    try {
      await api.patch(`/officer/approve/${booking.id}`, { amount: Number(amount) });
      toast.success("Booking approved & payment record created!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 animate-[fadeIn_.25s_ease] max-h-[90vh] overflow-y-auto">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <ThumbsUp className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{t("approveModal.heading")}</h3>
          <p className="text-xs text-slate-500 mt-1">
            Token #{booking.token || booking.id} — {booking.farmer?.name}
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            {t("approveModal.paymentAmountLabel")}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 25000"
            min="1"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
          />
          {booking.procurement && (
            <p className="text-[11px] text-slate-400 mt-1">
              {t("approveModal.crop")} {booking.procurement.crop} · {booking.procurement.quantity} kg · {t("approveModal.grade")} {booking.procurement.quality}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
            {t("approveModal.approve")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApproveModal;
