import {
  ClipboardCheck,
  Ticket ,
  Check,
  Clock3
} from "lucide-react";
import FAQ from "./Faq";

const features = [
  {
    icon: Ticket,
    title: "Smart Slot Booking",
    description:
      "Farmers can reserve procurement slots online instead of waiting in long queues.",
    points: [
      "Choose Date & Time",
      "Instant Slot Confirmation",
    ],
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Clock3,
    title: "Live Queue Tracking",
    description:
      "Track your live token status and estimated waiting time before reaching the procurement center.",
    points: [
      "Real-Time Queue Updates",
      "Estimated Waiting Time",
    ],
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: ClipboardCheck,
    title: "Transparent Procurement",
    description:
      "Officers verify crops digitally and farmers can monitor the complete procurement process.",
    points: [
      "Digital Verification",
      "Procurement Status Tracking",
    ],
    color: "bg-emerald-50 text-emerald-600",
  },
];

const About = () => {
  return (
    <section id="about-section" className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}

        <div className="max-w-3xl mb-14">

          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
            ABOUT FARMLINK
          </span>

          <h2 className="text-4xl font-bold mt-5">
          Making Procurement Faster & Transparent for Every Farmer       </h2>

          <p className="mt-5 text-slate-600 leading-8">
            FarmLink is a digital procurement management system that helps farmers book procurement slots, receive digital tokens, track live queue status, and reduce waiting time at mandi centers. It improves transparency and provides a smoother procurement experience for both farmers and officers.
          </p>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature) => {

            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="bg-white shadow-lg rounded-2xl p-8 shadow-gray-400 hover:scale-105 cursor-pointer transition duration-600"
              >

                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center ${feature.color}`}
                >
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-bold mt-6">
                  {feature.title}
                </h3>

                <p className="text-slate-600 mt-3">
                  {feature.description}
                </p>

                <ul className="mt-6 space-y-3">

                  {feature.points.map((point) => (

                    <li
                      key={point}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check
                        size={16}
                        className="text-green-600"
                      />
                      {point}
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