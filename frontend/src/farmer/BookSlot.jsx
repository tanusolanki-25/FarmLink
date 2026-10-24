import {
  ArrowRight,
  Building,
  Calendar,
  RefreshCw,
  Weight,
  Wheat,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const CROPS = [
  "Wheat", "Paddy (Rice)", "Maize", "Soybean", "Mustard",
  "Sunflower", "Cotton", "Groundnut", "Jowar", "Bajra", "Gram",
];

function BookSlot({ showBookSlot, setShowBookSlot }) {
  const [centers, setCenters] = useState([]);
  const [crop, setCrop] = useState("");

  const [selectedCenter, setSelectedCenter] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("09:00 AM");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [quantity, setQuantity] = useState("");

  const timeSlots = [
    "09:00 AM",
    "10:30 AM",
    "12:00 PM",
    "01:30 PM",
    "03:00 PM",
    "04:30 PM",
  ];

  const handleBookSlot = async (e) => {
    e.preventDefault();

    if (!selectedCenter) {
      toast.error("Please select a procurement center");
      return;
    }

     if (!crop) {
      toast.error("Please select the crop you are bringing");
      return;
    }

    if (!quantity) {
      toast.error("Enter the approximate quantity in quintals");
      return;
    }

    if (!bookingDate) {
      toast.error("Please select a date for procurement");
      return;
    }

    setBookingLoading(true);

    try {
      const response = await api.post("/farmer/book-slot", {
        centerId: Number(selectedCenter),
        date: bookingDate,
        crop,
        estimatedQuantity: quantity,
        time: bookingTime,
      });

      toast.success(
        response.data?.message ||
          "Slot booked successfully! Your queue token is generated.",
      );

      setShowBookSlot(false);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to book slot. Please try again.";
      toast.error(errMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const centersRes = await api.get("/farmer/centers").catch(() => null);
      if (centersRes?.data) {
        const centerList = Array.isArray(centersRes.data.data)
          ? centersRes.data.data
          : Array.isArray(centersRes.data)
          ? centersRes.data
          : [];
        setCenters(centerList);
      }
    } catch (error) {
      console.error("Dashboard data load error:", error);
    }
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
          <div className="p-4 sm:p-6 w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-y-auto animate-[fadeIn_.3s_ease] shadow-sm mx-auto space-y-4">
            {/* Header */}
            <div className="flex">
              <div className="">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Book Mandi Queue Slot / नया टोकन स्लॉट लें
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select your preferred government procurement center, appointment date, and time slot.
                </p>
              </div>

              <button
                onClick={() => setShowBookSlot(false)}
                 className="w-10 h-10 rounded-full bg-green-50 border border-green-200 font-bold text-red-600 flex items-center cursor-pointer justify-center"
              >
                ✕
              </button>
            </div>

            {/* Body */}
           <form onSubmit={handleBookSlot} className="space-y-4">
            {/* Select Procurement Center */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Procurement Center (उपार्जन केंद्र){" "}
                <span className="text-red-500">*</span>
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
                    <option value="">No centers registered yet</option>
                  ) : (
                    <>
                      <option value="" disabled>-- Select a procurement center --</option>
                      {centers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.centerName} ({c.district || c.state}) - Available: {c.availableSlots ?? c.totalSlots ?? "Open"}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                <Wheat className="w-3.5 h-3.5 text-green-500" /> Crop Type
                <span className="text-red-500">*</span>
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

            {/* Select Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Appointment Date (दिनांक){" "}
                <span className="text-red-500">*</span>
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

            {/* Select Time Slot */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Select Time Slot (समय स्लॉट){" "}
                <span className="text-red-500">*</span>
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={bookingLoading}
              className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed mt-4"
            >
              {bookingLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Booking Token...</span>
                </>
              ) : (
                <>
                  <span>Generate Queue Token</span>
                  <ArrowRight className="w-4 h-4" />
                </>
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
