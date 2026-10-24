import {
  ShieldCheck,
} from "lucide-react";
import fieldImg from "../../assets/field.jpg"
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-slate-50 py-20"
    >
      <div className="max-w-7xl mx-auto ">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}

          <div>

            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">

              <ShieldCheck size={18} />

               Smart Slot Booking • Digital Token • Live Queue Tracking

            </div>

            <h1 className="mt-8 text-4xl lg:text-5xl font-extrabold leading-tight">

              Smart Mandi Slot Booking

              <br />

              <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">

                 Avoid Long Waiting Lines at Procurement Centers

              </span>

            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-8">

            Book your procurement slot online, get a digital token,
track your live queue, and receive timely procurement updates.

            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link to="/register" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-7 py-4 rounded-xl font-semibold cursor-pointer">
                 Get Started →
              </Link>

              <Link to="/login" className="flex items-center gap-2 border border-green-600 text-green-600 hover:bg-green-50 px-7 py-4 rounded-xl font-semibold cursor-pointer">
               Login
              </Link>

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative">

            <img
              src={fieldImg}
              alt="FarmLink"
              className="rounded-3xl shadow-lg shadow-gray-500 w-full 
              h-[400px] object-cover hover:scale-105 cursor-pointer transition duration-600"
            />
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;