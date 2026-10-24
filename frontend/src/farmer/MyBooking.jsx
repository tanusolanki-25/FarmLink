import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Building, Calendar, CheckCircle2, Clock, Copy, Check, MapPin, Navigation, Plus, ShieldCheck, Trash2, XCircle } from "lucide-react";
import BookSlot from "./BookSlot";
import SelectedBookingForQueue from "./SelectedBookingForQueue";

/* Small helper: shows Booking ID + copy-to-clipboard button */
function CopyBookingId({ id }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy Booking ID"
      className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer group"
    >
      <span className="text-[11px] font-semibold text-slate-500">
        Booking ID: <span className="text-slate-700">#{id}</span>
      </span>
      {copied ? (
        <Check className="w-3 h-3 text-green-600" />
      ) : (
        <Copy className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
      )}
    </button>
  );
}

function MyBooking() {
 const [showBookSlot, setShowBookSlot] = useState(false);
 const [bookings, setBookings] = useState([]);
 const [loading, setLoading] = useState(true);
 const [selectedBooking, setSelectedBooking] = useState(null);

 const fetchData = async () => {
  try {
     const bookingsRes = await api.get("/farmer/my-bookings").catch(() => null);
        if (bookingsRes?.data) {
          const list = Array.isArray(bookingsRes.data)
            ? bookingsRes.data
            : Array.isArray(bookingsRes.data.data)
            ? bookingsRes.data.data
            : [];
          setBookings(list);
        }
  } catch (error) {
    console.log(error)
  } finally {
    setLoading(false);
  }
 }

 useEffect(() => {
   fetchData()
 }, [])

   const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this procurement slot?")) {
      return;
    }

    try {
      await api.patch(`/farmer/booking/${bookingId}/cancel`);
      toast.success("Booking cancelled successfully");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Delete this cancelled booking permanently?")) return;
    try {
      await api.delete(`/farmer/booking/${bookingId}/delete`);
      toast.success("Booking deleted");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete booking");
    }
  };

  // Fetch live queue status for a specific booking
  const handleFetchQueueStatus = async (booking) => {
    setSelectedBooking(booking);
  };


  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="capitalize">{status}</span>
          </span>
        );
      case "verified":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Verified</span>
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Queue</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          Your Procurement Slots & Queue Tokens
        </h2>
        <button
          onClick={() => setShowBookSlot(true)}
          className="text-xs font-semibold text-green-600 hover:text-green-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>+ Book New Slot</span>
        </button>
        <BookSlot
          showBookSlot={showBookSlot}
          setShowBookSlot={setShowBookSlot}
        />
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 border border-green-200 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No Queue Tokens Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't booked any mandi procurement tokens yet. Select your
            nearest center to book a slot.
          </p>
          <button
            onClick={() => setShowBookSlot(true)}
            className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shadow-md shadow-green-600/20 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Book Your First Token</span>
          </button>
          <BookSlot
            showBookSlot={showBookSlot}
            setShowBookSlot={setShowBookSlot}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-4 relative"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Token Number
                  </span>
                  <h4 className="text-xl font-extrabold text-emerald-600">
                    #TK-{booking.token || booking.id}
                  </h4>
                  {/* Booking ID with copy */}
                  <CopyBookingId id={booking.id} />
                </div>
                <div className="flex flex-row items-center gap-1.5">
                  {getStatusBadge(booking.status)}
                  {booking.status === "rejected" && (
                    <button
                      onClick={() => handleDeleteBooking(booking.id)}
                      title="Delete this cancelled booking"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-semibold transition-colors cursor-pointer border border-red-200"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleFetchQueueStatus(booking)}
                  className="px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Live Status</span>
                </button>

                {booking.status !== "rejected" &&
                  booking.status !== "completed" && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedBooking && (
        <SelectedBookingForQueue
          selectedBooking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}

export default MyBooking;
