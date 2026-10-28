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
    <section id="about-section" className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="max-w-3xl mb-14">
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
            {t("about.badge")}
          </span>
          <h2 className="text-4xl font-bold mt-5">{t("about.heading")}</h2>
          <p className="mt-5 text-slate-600 leading-8">{t("about.desc")}</p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = ICONS[idx];
            return (
              <div
                key={idx}
                className="bg-white shadow-lg rounded-2xl p-8 shadow-gray-400 hover:scale-105 cursor-pointer transition duration-600"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${COLORS[idx]}`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold mt-6">{feature.title[lang]}</h3>
                <p className="text-slate-600 mt-3">{feature.desc[lang]}</p>
                <ul className="mt-6 space-y-3">
                  {feature.points.map((point, pi) => (
                    <li key={pi} className="flex items-center gap-2 text-sm">
                      <Check size={16} className="text-green-600" />
                      {point[lang]}
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
