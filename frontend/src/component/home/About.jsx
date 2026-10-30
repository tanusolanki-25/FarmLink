import { ClipboardCheck, Ticket, Check, Clock3 } from "lucide-react";
import FAQ from "./Faq";
import { useLanguage } from "../../context/LanguageContext";
import translations from "../../context/translations";

const ICONS = [Ticket, Clock3, ClipboardCheck];
const COLORS = [
  "bg-green-50 text-green-600",
  "bg-blue-50 text-blue-600",
  "bg-emerald-50 text-emerald-600",
];

const About = () => {
  const { t, lang } = useLanguage();
  const features = translations.about.features;

  return (
    <section id="about-section" className="bg-slate-50 py-10 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <span className="inline-block bg-blue-100 text-blue-700 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold">
            {t("about.badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4 sm:mt-5 text-slate-900 leading-tight">
            {t("about.heading")}
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            {t("about.desc")}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => {
            const Icon = ICONS[idx];
            return (
              <div
                key={idx}
                className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 sm:p-8 border border-slate-100 transition-all duration-300"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center ${COLORS[idx]}`}>
                  <Icon size={26} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mt-5 text-slate-900">{feature.title[lang]}</h3>
                <p className="text-slate-600 mt-2 text-xs sm:text-sm leading-relaxed">{feature.desc[lang]}</p>
                <ul className="mt-5 space-y-2.5">
                  {feature.points.map((point, pi) => (
                    <li key={pi} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                      <Check size={15} className="text-green-600 shrink-0" />
                      <span>{point[lang]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <FAQ />
      </div>
    </section>
  );
};

export default About;
