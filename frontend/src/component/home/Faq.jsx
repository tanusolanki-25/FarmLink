import { ChevronDown } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import translations from "../../context/translations";

export default function FAQ() {
  const { t, lang } = useLanguage();
  const questions = translations.faq.questions;

  return (
    <section className="bg-slate-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="mt-2 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
            {t("faq.title")}
          </h2>

          <p className="mt-2 sm:mt-4 text-slate-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </div>

        <div className="space-y-3">
          {questions.map((faq, index) => (
            <details
              key={index}
              className="group rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm"
              open={index === 0}
            >
              <summary className="flex cursor-pointer items-center justify-between text-base sm:text-lg font-medium text-gray-900 list-none">
                <span className="pr-4">{faq.q[lang]}</span>
                <ChevronDown className="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-300 group-open:rotate-180" />
              </summary>

              <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-slate-100 pt-3">
                {faq.a[lang]}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
