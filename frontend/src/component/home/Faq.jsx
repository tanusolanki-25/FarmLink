import { ChevronDown } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import translations from "../../context/translations";

const faqs = [
  {
    question: "Who can register on FarmLink?",
    answer:
      "Only farmers can register on FarmLink. Officers are created by the Admin, while the Admin account is managed by the system.",
  },
  {
    question: "How do I book a procurement slot?",
    answer:
      "Login to your account, select your crop, procurement center, preferred date, and available time slot. A digital token is generated after successful booking.",
  },
  {
    question: "How can I track my queue status?",
    answer:
      "Open the Track Queue page to view your token number, current token being served, farmers ahead of you, and estimated waiting time.",
  },
  {
    question: "Can I cancel or reschedule my booking?",
    answer:
      "Yes. Farmers can cancel or reschedule their booking before the scheduled slot, depending on slot availability.",
  },
  {
    question: "What should I bring to the procurement center?",
    answer:
      "Bring your digital token (or token number), a valid identity proof, and the crop scheduled for procurement.",
  },
  {
    question: "How do I know if my procurement is completed?",
    answer:
      "After the officer completes verification, your booking status is updated. You can monitor it from your dashboard.",
  },
];

export default function FAQ() {
  const {t, lang} = useLanguage()
  const questions = translations.faq.questions;

  return (
    <section className="bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="mt-5 text-4xl font-bold">
            {t("faq.title")}
          </h2>

          <p className="mt-4 text-gray-600 text-lg">
            {t("faq.subtitle")}
          </p>
        </div>

        <div className="space-y-3">
          {questions.map((faq, index) => (
            <details
              key={index}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-lg">
                {faq.question[lang]}

                <ChevronDown className="h-5 w-5 transition-transform duration-300 group-open:rotate-180" />
              </summary>

              <p className="mt-4 leading-7 text-gray-600">
                {faq.answer[lang]}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}