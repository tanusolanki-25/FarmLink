import { ShieldCheck } from "lucide-react";
import fieldImg from "../../assets/field.jpg";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative overflow-hidden bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* TOP — Content (centered), max-w-3xl */}
        <div className="text-center max-w-5xl mx-auto">

          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
            <ShieldCheck size={18} />
            {t("hero.badge")}
          </div>

          <h1 className="mt-8 text-4xl lg:text-5xl font-extrabold leading-tight">
            {t("hero.heading1")}
            <br />
            <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
              {t("hero.heading2")}
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            {t("hero.desc")}
          </p>

          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-7 py-4 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              {t("hero.getStarted")}
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 border border-green-600 text-green-600 hover:bg-green-50 px-7 py-4 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              {t("hero.loginBtn")}
            </Link>
          </div>
        </div>

        {/* BOTTOM — Image, same max-w-3xl as content */}
        <div className="mt-16 max-w-5xl mx-auto">
          <img
            src={fieldImg}
            alt="FarmLink"
            className="rounded-3xl shadow-xl shadow-gray-400 w-full h-[400px] object-cover hover:scale-[1.02] cursor-pointer transition-transform duration-500"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;
