import { ShieldCheck } from "lucide-react";
import fieldImg from "../../assets/field.jpg";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative overflow-hidden bg-slate-50 py-10 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TOP — Content (centered), max-w-4xl */}
        <div className="text-center max-w-4xl mx-auto">

          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
            <ShieldCheck size={18} />
            <span>{t("hero.badge")}</span>
          </div>

          <h1 className="mt-6 sm:mt-8 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
            {t("hero.heading1")}
            <br />
            <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
              {t("hero.heading2")}
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t("hero.desc")}
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-semibold shadow-md shadow-green-600/20 cursor-pointer transition-colors text-sm sm:text-base"
            >
              {t("hero.getStarted")}
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-green-600 text-green-600 hover:bg-green-50 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-semibold cursor-pointer transition-colors text-sm sm:text-base"
            >
              {t("hero.loginBtn")}
            </Link>
          </div>
        </div>

        {/* BOTTOM — Image */}
        <div className="mt-10 sm:mt-14 md:mt-16 max-w-5xl mx-auto">
          <img
            src={fieldImg}
            alt="FarmLink"
            className="rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-300/60 w-full h-[220px] sm:h-[320px] md:h-[400px] object-cover hover:scale-[1.01] transition-transform duration-500"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;
