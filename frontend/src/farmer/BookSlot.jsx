import { ArrowRight, Building, Calendar, RefreshCw, Weight, Wheat } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const CROPS = {
  en: ["Wheat", "Paddy (Rice)", "Maize", "Soybean", "Mustard", "Sunflower", "Cotton", "Groundnut", "Jowar", "Bajra", "Gram"],
  hi: ["गेहूं", "धान (चावल)", "मक्का", "सोयाबीन", "सरसों", "सूरजमुखी", "कपास", "मूंगफली", "ज्वार", "बाजरा", "चना"],
};

function BookSlot({ showBookSlot, setShowBookSlot }) {
  const { t, lang } = useLanguage();

  const [centers, setCenters]           = useState([]);
  const [crop, setCrop]                 = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [bookingDate, setBookingDate]   = useState("");
  const [bookingTime, setBookingTime]   = useState("09:00 AM");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [quantity, setQuantity]         = useState("");

  const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "01:30 PM", "03:00 PM", "04:30 PM"];

  const handleBookSlot = async (e) => {
    e.preventDefault();
    if (!selectedCenter) { toast.error(lang === "hi" ? "कृपया उपार्जन केंद्र चुनें" : "Please select a procurement center"); return; }
    if (!crop)           { toast.error(lang === "hi" ? "कृपया फसल का प्रकार चुनें" : "Please select the crop you are bringing"); return; }
    if (!quantity)       { toast.error(lang === "hi" ? "अनुमानित मात्रा दर्ज करें" : "Enter the approximate quantity"); return; }
    if (!bookingDate)    { toast.error(lang === "hi" ? "कृपया तारीख चुनें" : "Please select a date for procurement"); return; }

    setBookingLoading(true);
    try {
      const response = await api.post("/farmer/book-slot", {
        centerId: Number(selectedCenter),
        date: bookingDate,
        crop,
        estimatedQuantity: quantity,
        time: bookingTime,
      });
      toast.success(response.data?.message || (lang === "hi" ? "स्लॉट सफलतापूर्वक बुक हुआ!" : "Slot booked successfully! Your queue token is generated."));
      setShowBookSlot(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || (lang === "hi" ? "स्लॉट बुक करने में विफल।" : "Failed to book slot. Please try again."));
    } finally {
      setBookingLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const centersRes = await api.get("/farmer/centers").catch(() => null);
      if (centersRes?.data) {
        const centerList = Array.isArray(centersRes.data.data) ? centersRes.data.data
          : Array.isArray(centersRes.data) ? centersRes.data : [];
        setCenters(centerList);
      }
    } catch (error) { console.error("Dashboard data load error:", error); }
  };

  useEffect(() => {
    if (!showBookSlot) return;
    setBookingDate("");
    setSelectedCenter("");
    setBookingTime("09:00 AM");
    setCrop("");
    setQuantity("");
    fetchData();
  }, [showBookSlot]);

  return (
    <>
      {showBookSlot && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm px-4 pt-20 pb-6 overflow-y-auto">
          <div className="p-4 sm:p-6 w-full max-w-lg rounded-3xl bg-white shadow-2xl animate-[fadeIn_.3s_ease] shadow-sm mx-auto space-y-4">

            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t("bookSlot.title")}</h2>
                <p className="text-xs text-slate-500 mt-1">{t("bookSlot.subtitle")}</p>
              </div>
              <button
                onClick={() => setShowBookSlot(false)}
                className="w-10 h-10 shrink-0 rounded-full bg-green-50 border border-green-200 font-bold text-red-600 flex items-center cursor-pointer justify-center"
              >✕</button>
            </div>

            {/* Body */}
            <form onSubmit={handleBookSlot} className="space-y-4">

              {/* Center */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t("bookSlot.center")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <select
                    value={selectedCenter}
                    onChange={(e) => setSelectedCenter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition-all cursor-pointer"
                  >
                    {centers.length === 0 ? (
                      <option value="">{t("bookSlot.noCenters")}</option>
                    ) : (
                      <>
                        <option value="" disabled>{t("bookSlot.selectCenter")}</option>
                        {centers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.centerName} ({c.district || c.state}) — {t("bookSlot.available")}: {c.availableSlots ?? c.totalSlots ?? "Open"}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Crop Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                  <Wheat className="w-3.5 h-3.5 text-green-500" /> {t("bookSlot.cropType")} <span className="text-red-500">*</span>
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled>{t("bookSlot.selectCrop")}</option>
                  {CROPS[lang].map((c, i) => (
                    <option key={i} value={CROPS.en[i]}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  <span className="inline-flex items-center gap-1.5"><Weight className="w-3.5 h-3.5 text-green-500" /> {t("bookSlot.quantity")}</span>
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 500"
                  min="1"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t("bookSlot.date")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  {t("bookSlot.timeSlot")} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingTime(slot)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                        bookingTime === slot
                          ? "border-green-600 bg-green-50 text-green-700 shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed mt-4"
              >
                {bookingLoading ? (
                  <><RefreshCw className="w-5 h-5 animate-spin" /><span>{t("bookSlot.booking")}</span></>
                ) : (
                  <><span>{t("bookSlot.submit")}</span><ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default BookSlot;
