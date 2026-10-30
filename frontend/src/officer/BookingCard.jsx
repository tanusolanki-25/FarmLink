import { useLanguage } from "../context/LanguageContext";
import { BadgeCheck, CheckCircle2, ClipboardList, Clock, Loader2, PackageCheck, Phone, ShieldCheck, ThumbsDown, ThumbsUp, Wheat, XCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import ProcurementModal from "./ProcurementModal";
import ApproveModal from "./ApproveModalByOfficer";
import api from "../api/axios";

function BookingCard({ booking, onRefresh }) {
  const { t } = useLanguage();
  const [procurementOpen, setProcurementOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const doAction = async (label, fn) => {
    setActionLoading(label);
    try {
      await fn();
      toast.success(`${label} successful!`);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || `${label} failed`);
    } finally {
      setActionLoading(null);
    }
  };

  const status = booking.status?.toLowerCase();

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-4">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("bookingCard.token")}</span>
            <h3 className="text-2xl font-extrabold text-green-600">#{booking.token || booking.id}</h3>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {/* Farmer Info */}
        <div className="bg-slate-50 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-green-600 flex items-center justify-center text-sm font-bold shrink-0">
              {(booking.farmer?.name || "F").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{booking.farmer?.name || "—"}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {booking.farmer?.user?.phone || "—"}
              </p>
            </div>
          </div>
          {booking.farmer?.village && (
            <p className="text-[11px] text-slate-400 pl-10">
              {booking.farmer.village}, {booking.farmer.district} ({booking.farmer.state})
            </p>
          )}
        </div>

        {/* Procurement Info (if recorded) */}
        {booking.procurement && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center gap-3">
            <Wheat className="w-4 h-4 text-green-500 shrink-0" />
            <div className="text-xs text-green-800">
              <span className="font-bold">{booking.procurement.crop}</span>
              {" · "}{booking.procurement.quantity} kg
              {" · "}{t("bookingCard.grade")} <span className="font-bold">{booking.procurement.quality}</span>
            </div>
          </div>
        )}

        {/* Time */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{t("bookingCard.slot")} {booking.time || "—"} · {booking.date ? new Date(booking.date).toLocaleDateString("en-IN") : "—"}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
          {status === "pending" && (
            <button
              onClick={() => doAction("Verify", () => api.patch(`/officer/verify/${booking.id}`))}
              disabled={!!actionLoading}
              className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-sm shadow-blue-600/20"
            >
              {actionLoading === "Verify" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              {t("bookingCard.verifyFarmer")}
            </button>
          )}

          {status === "verified" && (
            <button
              onClick={() => setProcurementOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/20"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              {t("bookingCard.recordProcurement")}
            </button>
          )}

          {status === "verified" && booking.procurement && (
            <>
              <button
                onClick={() => setApproveOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-600/20"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                {t("bookingCard.approve")}
              </button>
              <button
                onClick={() => {
                  if (!window.confirm("Reject this booking?")) return;
                  doAction("Reject", () => api.patch(`/officer/reject/${booking.id}`));
                }}
                disabled={!!actionLoading}
                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {actionLoading === "Reject" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ThumbsDown className="w-3.5 h-3.5" />}
                {t("bookingCard.reject")}
              </button>
            </>
          )}

          {status === "approved" && (
            <button
              onClick={() => {
                if (!window.confirm("Mark this booking as completed?")) return;
                doAction("Complete", () => api.patch(`/officer/complete/${booking.id}`));
              }}
              disabled={!!actionLoading}
              className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/20"
            >
              {actionLoading === "Complete" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PackageCheck className="w-3.5 h-3.5" />}
              {t("bookingCard.markComplete")}
            </button>
          )}

          {(status === "rejected" || status === "completed") && (
            <span className="text-xs text-slate-400 italic py-1">{t("bookingCard.noFurtherActions")}</span>
          )}
        </div>
      </div>

      {procurementOpen && (
        <ProcurementModal
          booking={booking}
          onClose={() => setProcurementOpen(false)}
          onSuccess={onRefresh}
        />
      )}
      {approveOpen && (
        <ApproveModal
          booking={booking}
          onClose={() => setApproveOpen(false)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}

export default BookingCard;


function StatusBadge({ status }) {
  const map = {
    pending:   { icon: Clock,         bg: "bg-amber-100",   text: "text-amber-800",   border: "border-amber-200",   label: "Pending"   },
    verified:  { icon: ShieldCheck,   bg: "bg-blue-100",    text: "text-blue-800",    border: "border-blue-200",    label: "Verified"  },
    approved:  { icon: CheckCircle2,  bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200", label: "Approved"  },
    rejected:  { icon: XCircle,       bg: "bg-red-100",     text: "text-red-800",     border: "border-red-200",     label: "Cancelled" },
    completed: { icon: BadgeCheck,    bg: "bg-indigo-100",  text: "text-indigo-800",  border: "border-indigo-200",  label: "Completed" },
  };
  const cfg = map[status?.toLowerCase()] || map.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}
