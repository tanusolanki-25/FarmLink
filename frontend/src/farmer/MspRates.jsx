import { Clock, TrendingUp, Minus, ArrowUpRight, Info } from "lucide-react";

const crops = [
  {
    name: "Wheat (Gehun / गेहूं)",
    rate: "₹2,275",
    unit: "/ Quintal",
    badge: "FAQ Grade A",
    change: "+2.4%",
    changeLabel: "vs Prev Season",
    color: "from-green-50 to-emerald-50",
    border: "border-green-200",
    badgeColor: "bg-green-100 text-green-700",
    rateColor: "text-green-700",
    icon: "up",
  },
  {
    name: "Mustard (Sarson / सरसों)",
    rate: "₹5,650",
    unit: "/ Quintal",
    badge: "Active Intake",
    change: "+0.8%",
    changeLabel: "Mandi Base",
    color: "from-blue-50 to-sky-50",
    border: "border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
    rateColor: "text-blue-700",
    icon: "up",
  },
  {
    name: "Yellow Soyabean (Soya)",
    rate: "₹4,890",
    unit: "/ Quintal",
    badge: "Moisture 12%",
    change: "Stable",
    changeLabel: "No Change",
    color: "from-purple-50 to-violet-50",
    border: "border-purple-200",
    badgeColor: "bg-purple-100 text-purple-700",
    rateColor: "text-purple-700",
    icon: "minus",
  },
  {
    name: "Gram (Chana / चना)",
    rate: "₹5,440",
    unit: "/ Quintal",
    badge: "High Demand",
    change: "+1.5%",
    changeLabel: "APMC Index",
    color: "from-amber-50 to-yellow-50",
    border: "border-amber-200",
    badgeColor: "bg-amber-100 text-amber-700",
    rateColor: "text-amber-700",
    icon: "up",
  },
  {
    name: "Paddy (Dhan / धान)",
    rate: "₹2,183",
    unit: "/ Quintal",
    badge: "Common Grade",
    change: "+1.9%",
    changeLabel: "vs Last Year",
    color: "from-orange-50 to-red-50",
    border: "border-orange-200",
    badgeColor: "bg-orange-100 text-orange-700",
    rateColor: "text-orange-700",
    icon: "up",
  },
  {
    name: "Maize (Makka / मक्का)",
    rate: "₹2,090",
    unit: "/ Quintal",
    badge: "Rabi Season",
    change: "Stable",
    changeLabel: "No Change",
    color: "from-yellow-50 to-lime-50",
    border: "border-yellow-200",
    badgeColor: "bg-yellow-100 text-yellow-700",
    rateColor: "text-yellow-700",
    icon: "minus",
  },
];

const MspRates = () => {
  const now = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Today's MSP Rates
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Official Government Minimum Support Prices — Kharif & Rabi 2025-26
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 shrink-0">
          <Clock className="w-3.5 h-3.5 text-green-600" />
          Synced Today · {now}
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-2xl p-3.5 text-xs text-blue-700">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
        <span>
          MSP rates are declared by the Government of India under CACP recommendations.
          Rates shown are per quintal (100 kg) for FAQ (Fair Average Quality) grade produce.
        </span>
      </div>

      {/* Crop cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {crops.map((crop) => (
          <div
            key={crop.name}
            className={`bg-gradient-to-br ${crop.color} border ${crop.border} rounded-2xl p-5 hover:shadow-md transition-all duration-200`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2 mb-4">
              <h3 className="text-sm font-bold text-slate-800 leading-snug">
                {crop.name}
              </h3>
              <span className={`shrink-0 text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${crop.badgeColor}`}>
                {crop.badge}
              </span>
            </div>

            {/* Rate */}
            <div className="mb-3">
              <p className={`text-3xl font-extrabold ${crop.rateColor}`}>
                {crop.rate}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{crop.unit}</p>
            </div>

            {/* Trend */}
            <div className="flex items-center gap-1.5">
              {crop.icon === "up" ? (
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              ) : (
                <Minus className="w-4 h-4 text-slate-400" />
              )}
              <span className={`text-xs font-semibold ${crop.icon === "up" ? "text-green-700" : "text-slate-500"}`}>
                {crop.change}
              </span>
              <span className="text-xs text-slate-500">{crop.changeLabel}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center text-[11px] text-slate-400">
        Source: Cabinet Committee on Economic Affairs (CCEA) · Ministry of Agriculture &amp; Farmers Welfare
      </p>
    </div>
  );
};

export default MspRates;