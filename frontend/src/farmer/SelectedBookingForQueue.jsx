import { useLanguage } from "../context/LanguageContext";
import { CheckCircle2, Navigation, RefreshCw, XCircle } from "lucide-react";
import api from "../api/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function SelectedBookingForQueue({ selectedBooking, onClose }) {
  const { t } = useLanguage();
  const [queueInfo, setQueueInfo] = useState(null);
  const [queueLoading, setQueueLoading] = useState(false);

  const handleFetchQueueStatus = async () => {
    if (!selectedBooking?.id) return;
    setQueueLoading(true);
    try {
      const res = await api.get(`/farmer/booking/${selectedBooking.id}/queue`);
      setQueueInfo(res.data?.data || res.data);
    } catch (err) {
      toast.error("Could not fetch live queue details");
    } finally {
      setQueueLoading(false);
    }
  };

  useEffect(() => {
    handleFetchQueueStatus();
  }, [selectedBooking?.id]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <XCircle className="w-6 h-6" />
        </button>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold mb-2">
            <Navigation className="w-3.5 h-3.5" />
            <span>{t("selectedBookingQueue.liveQueueStatus")}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Token #{selectedBooking?.token || selectedBooking?.id}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {selectedBooking?.center?.centerName || t("selectedBookingQueue.procurementCenter")}
          </p>
        </div>

        {queueLoading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 text-green-600 animate-spin" />
            <p className="text-xs text-slate-500">
              {t("selectedBookingQueue.checking")}
            </p>
          </div>
        ) : queueInfo ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold">
                {t("selectedBookingQueue.vehiclesAhead")}
              </span>
              <h4 className="text-2xl font-extrabold text-amber-600 mt-1">
                {queueInfo.peopleAhead || 0}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {t("selectedBookingQueue.tractorsAhead")}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold">
                {t("selectedBookingQueue.estWaitTime")}
              </span>
              <h4 className="text-2xl font-extrabold text-emerald-600 mt-1">
                ~{queueInfo.estimatedWaitMinutes || 0} mins
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {t("selectedBookingQueue.fastClearance")}
              </p>
            </div>

            <div className="col-span-2 bg-green-50 p-4 rounded-2xl border border-green-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-green-700 uppercase font-bold">
                  {t("selectedBookingQueue.nowServing")}
                </span>
                <h4 className="text-lg font-bold text-green-900 mt-0.5">
                  Token #{queueInfo.currentServing || 0}
                </h4>
              </div>
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            {t("selectedBookingQueue.unavailable")}
          </p>
        )}

        <button
          onClick={handleClose}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
        >
          Close Status
        </button>
      </div>
    </div>
  );
}

export default SelectedBookingForQueue;
