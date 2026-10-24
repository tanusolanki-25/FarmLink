import { useEffect, useState } from "react";
import { Building2, Mail, Phone, MapPin, Clock, Users, Loader2, Badge } from "lucide-react";
import api from "../api/axios";

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function OfficerProfile() {
  const [officer, setOfficer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/officer/profile")
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setOfficer(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!officer) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
        <p className="text-green-600 text-sm">Failed to load profile.</p>
      </div>
    );
  }

  const center = officer.center;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

      {/* Officer Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Card Top */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-6 text-white relative">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl font-extrabold shrink-0">
              {(officer.name || "O").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Procurement Officer</p>
              <h2 className="text-xl font-extrabold mt-0.5">{officer.name || "—"}</h2>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold text-white border border-white/30">
                {officer.employeeId || `ID: ${officer.id}`}
              </span>
            </div>
          </div>
        </div>

        {/* Officer Details */}
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Contact Information</p>
          <InfoRow icon={Mail}  label="Email" value={officer.user?.email} />
          <InfoRow icon={Phone} label="Phone" value={officer.user?.phone} />
          <InfoRow icon={Badge} label="Designation" value={officer.designation || "Procurement Officer"} />
        </div>
      </div>

      {/* Assigned Center Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 p-6 text-white relative">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Assigned Center</p>
              <h2 className="text-lg font-extrabold mt-0.5">{center?.centerName || "—"}</h2>
              <span className="text-xs text-slate-300">{center?.code || ""}</span>
            </div>
          </div>
        </div>

        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Center Details</p>
          <InfoRow icon={MapPin}  label="Address"  value={center?.address ? `${center.address}, ${center.district}, ${center.state} — ${center.pincode}` : null} />
          <InfoRow icon={Phone}   label="Contact"  value={center?.contactNumber} />
          <InfoRow icon={Clock}   label="Timings"  value={center?.openingTime && center?.closingTime ? `${center.openingTime} – ${center.closingTime}` : null} />
          <InfoRow icon={Users}   label="Slots"    value={center?.totalSlots ? `${center.availableSlots ?? "—"} available / ${center.totalSlots} total` : null} />
        </div>

        {/* Status pill */}
        {center?.status && (
          <div className="px-5 pb-5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              center.status === "ACTIVE"
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${center.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"}`} />
              Center {center.status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default OfficerProfile;
