import { Sprout, LogOut, User, KeyRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContex";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100 shadow-sm">
      <div className="mx-12 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* ── Logo ── */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-green-600 text-white shadow-sm">
            <Sprout className="w-4 h-4" />
          </div>
          <div className="leading-tight">
            <h2 className="text-lg font-bold leading-none">
              Farm<span className="text-green-600">Link</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              Farmer Procurement System
            </p>
          </div>
        </div>

        {/* ── Right section ── */}
        <div className="flex items-center gap-2">

          {/* Not logged in */}
          {!user && (
            <>
              <nav className="hidden lg:flex items-center gap-6 mr-4 text-sm font-medium text-slate-600">
                <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
                <Link to="/about-section" className="hover:text-green-600 transition-colors">About</Link>
              </nav>
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 border border-slate-200 hover:border-green-600 hover:text-green-600 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm shadow-green-600/20 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Logged in */}
          {user && (
            <>
              {/* Role badge */}
              <Link to={`/${user.role}/dashboard`} className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200 capitalize">
                {user.role}
              </Link>

              {/* Profile link — only if farmer with completed profile */}
              {user.role === "farmer" && user.profileCompleted && (
                <Link
                  to="/farmer/profile"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  Profile
                </Link>
              )}

              {/* Change password */}
              <Link
                to="/change-password"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Password
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
