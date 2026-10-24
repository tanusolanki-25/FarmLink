import {
  CheckCircle,
  Sprout,
} from "lucide-react";


const farmerLinks = [
  "Book Procurement Slot",
  "Track Queue",
  "Farmer Login",
  "MSP Rates"
];

const mandiLinks = [
  "Manage Queue",
  "Verify Farmer",
  "Update Procurement Status",
];

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300">

      <div className="max-w-7xl mx-auto px-4 py-16">

        <div className="grid gap-10 lg:grid-cols-5">

          {/* Brand */}

          <div className="lg:col-span-2">

            <div className="flex items-center gap-3">

              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-green-600 text-white">
              <Sprout className="w-4 h-4" />
            </div>

              <h2 className="text-2xl font-bold text-white">
                Farm<span className="text-green-500">Link</span>
              </h2>

            </div>

            <p className="mt-5 leading-7 text-slate-400">
              FarmLink is a smart procurement and queue management system that helps farmers book slots, track live queue status, and reduce waiting time at procurement centers.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              <span className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm">
                <CheckCircle size={16} className="text-green-500" />
                 Digital Token
              </span>

              <span className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm">
                <CheckCircle size={16} className="text-blue-500" />
                Live Queue Tracking
              </span>

              <span className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm">
                <CheckCircle size={16} className="text-green-500" />
                Secure Login
              </span>

            </div>

          </div>

          {/* Farmer Links */}

          <div>

            <h3 className="font-bold text-white mb-5">
              Farmer Portal
            </h3>

            <ul className="space-y-3">

              {farmerLinks.map((item) => (

                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-green-400 transition"
                  >
                    {item}
                  </a>
                </li>

              ))}

            </ul>

          </div>

          {/* Mandi Links */}

          <div>

            <h3 className="font-bold text-white mb-5">
              Mandi Operations
            </h3>

            <ul className="space-y-3">

              {mandiLinks.map((item) => (

                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-green-400 transition"
                  >
                    {item}
                  </a>
                </li>

              ))}

            </ul>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-16 border-t border-slate-800 pt-8 flex flex-col lg:flex-row justify-between gap-5 text-sm text-slate-500">

          <p>
            © 2026 FarmLink. All Rights Reserved.
          </p>

          <div className="flex flex-wrap gap-6">

            <a href="#" className="hover:text-green-400">
              Privacy Policy
            </a>

            <a href="#" className="hover:text-green-400">
              Terms
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;