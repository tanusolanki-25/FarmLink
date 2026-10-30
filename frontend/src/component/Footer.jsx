import { CheckCircle, Sprout } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import translations from "../context/translations";

const Footer = () => {
  const { t, lang } = useLanguage();
  const farmerLinks = translations.footer.farmerLinks;
  const mandiLinks  = translations.footer.mandiLinks;

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-green-600 text-white">
                <Sprout className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Farm<span className="text-green-500">Link</span>
              </h2>
            </div>

            <p className="mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed text-slate-400 max-w-sm">
              {t("footer.tagline")}
            </p>

            <div className="mt-5 sm:mt-6 flex flex-wrap gap-2.5 sm:gap-3">
              <span className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300">
                <CheckCircle size={15} className="text-green-500 shrink-0" />
                <span>{t("footer.digitalToken")}</span>
              </span>
              <span className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300">
                <CheckCircle size={15} className="text-blue-500 shrink-0" />
                <span>{t("footer.liveQueue")}</span>
              </span>
              <span className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300">
                <CheckCircle size={15} className="text-green-500 shrink-0" />
                <span>{t("footer.secureLogin")}</span>
              </span>
            </div>
          </div>

          {/* Farmer Links */}
          <div>
            <h3 className="font-bold text-white mb-4 sm:mb-5 text-sm uppercase tracking-wider">{t("footer.farmerPortal")}</h3>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
              {farmerLinks.map((item, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-green-400 transition-colors">{item[lang]}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Mandi Links */}
          <div>
            <h3 className="font-bold text-white mb-4 sm:mb-5 text-sm uppercase tracking-wider">{t("footer.mandiOps")}</h3>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
              {mandiLinks.map((item, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-green-400 transition-colors">{item[lang]}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-bold text-white mb-4 sm:mb-5 text-sm uppercase tracking-wider">{t("footer.helpdesk")}</h3>
            <div className="space-y-2 text-xs sm:text-sm text-slate-400">
              <p>Toll Free: 1800-XXX-XXXX</p>
              <p>support@farmlink.gov.in</p>
              <p>Mon - Sat (9:00 AM - 6:00 PM)</p>
            </div>
          </div>

        </div>

        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FarmLink. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
