import { useLanguage } from "../context/LanguageContext";
import { Building, Calendar, ShieldCheck, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";

function MetricCardsForFarmerDashboard() {
  const { t } = useLanguage();
  const [farmer, setFarmer] = useState(null);
  const [centers, setCenters] = useState([]);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const profileRes = await api.get("/farmer/profile").catch(() => null);
      if (profileRes?.data?.data) {
        setFarmer(profileRes.data.data.farmer);
        setIsProfileComplete(profileRes.data.data.isProfileComplete);
      }
      const centersRes = await api.get("/farmer/centers").catch(() => null);
      if (centersRes?.data) {
        const centerList = Array.isArray(centersRes.data.data)
          ? centersRes.data.data
          : Array.isArray(centersRes.data)
            ? centersRes.data
            : [];
        setCenters(centerList);
      }

      const bookingsRes = await api
        .get("/farmer/my-bookings")
        .catch(() => null);
      if (bookingsRes?.data) {
        const list = Array.isArray(bookingsRes.data.data)
          ? bookingsRes.data.data
          : Array.isArray(bookingsRes.data)
            ? bookingsRes.data
            : [];
        setBookings(list);
      }
    } catch (error) {
      console.error("Dashboard data load error:", error);
    }
  };

  const activeBookingsCount = bookings.filter(
    (b) => b.status !== "rejected" && b.status !== "completed",
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {t("metricCards.activeTokens")}
          </p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            {activeBookingsCount}
          </h3>
          <p className="text-[11px] text-green-600 font-medium mt-0.5">
            {t("metricCards.readyForDispatch")}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 text-green-600 flex items-center justify-center">
          <Calendar className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {t("metricCards.availableMandis")}
          </p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            {centers.length}
          </h3>
          <p className="text-[11px] text-blue-600 font-medium mt-0.5">
            {t("metricCards.activeProcurementHubs")}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
          <Building className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {t("metricCards.mspWheatRate")}
          </p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            ₹2,275
          </h3>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
            {t("metricCards.perQuintal")}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {t("metricCards.kisanProfile")}
          </p>
          <h3 className="text-base font-bold text-slate-900 mt-1">
            {isProfileComplete ? t("metricCards.complete") : t("metricCards.incomplete")}
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {farmer?.adhaarNumber ? t("metricCards.aadhaarLinked") : t("metricCards.basicRegistration")}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isProfileComplete
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
              : "bg-amber-50 text-amber-600 border border-amber-100"
          }`}
        >
          <ShieldCheck className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default MetricCardsForFarmerDashboard;
