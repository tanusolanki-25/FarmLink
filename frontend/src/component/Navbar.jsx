import { useState } from "react";
import { Sprout, LogOut, User, KeyRound, Languages, Menu, X, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContex";
import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { lang, toggle, t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      toast.success(t("navbar.logoutOk"));
      navigate("/login");
    } catch {
      toast.error(t("navbar.logoutFail"));
    }
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-green-600 text-white shadow-sm">
            <Sprout className="w-4 h-4" />
          </div>
          <div className="leading-tight">
            <h2 className="text-lg font-bold leading-none text-slate-900">
              Farm<span className="text-green-600">Link</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              {t("navbar.tagline")}
            </p>
          </div>
        </Link>

        {/* ── Desktop & Tablet Navigation ── */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Language Toggle Button - always visible */}
          <button
            onClick={toggle}
            title={lang === "en" ? "हिंदी में बदलें" : "Switch to English"}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-all cursor-pointer shrink-0"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{lang === "en" ? "हिंदी" : "English"}</span>
          </button>

          {/* Not logged in (Desktop) */}
          {!user && (
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              <nav className="flex items-center gap-5 mr-2 text-sm font-medium text-slate-600">
                <Link to="/" className="hover:text-green-600 transition-colors">{t("navbar.home")}</Link>
                <Link to="/about-section" className="hover:text-green-600 transition-colors">{t("navbar.about")}</Link>
              </nav>
              <Link
                to="/login"
                className="border border-slate-200 hover:border-green-600 hover:text-green-600 text-slate-700 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all"
              >
                {t("navbar.login")}
              </Link>
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-3.5 py-1.5 rounded-xl text-sm font-semibold shadow-sm shadow-green-600/20 transition-all"
              >
                {t("navbar.signup")}
              </Link>
            </div>
          )}

          {/* Logged in (Desktop) */}
          {user && (
            <div className="hidden sm:flex items-center gap-2.5">
              <Link
                to={`/${user.role}/dashboard`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors capitalize"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{user.role}</span>
              </Link>

              {user.role === "farmer" && user.profileCompleted && (
                <Link
                  to="/farmer/profile"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t("navbar.profile")}</span>
                </Link>
              )}

              <Link
                to="/change-password"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{t("navbar.password")}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t("navbar.logout")}</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-4 space-y-3 shadow-lg animate-[fadeIn_.2s_ease]">
          {!user ? (
            <>
              <Link
                to="/"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                {t("navbar.home")}
              </Link>
              <Link
                to="/about-section"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                {t("navbar.about")}
              </Link>
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {t("navbar.login")}
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="w-full text-center py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold shadow-md shadow-green-600/20 transition-colors"
                >
                  {t("navbar.signup")}
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 text-xs text-slate-600">
                <span className="font-medium">Role:</span>
                <span className="font-bold text-green-700 uppercase bg-green-100 px-2 py-0.5 rounded-full">{user.role}</span>
              </div>
              <Link
                to={`/${user.role}/dashboard`}
                onClick={closeMenu}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-green-600" />
                <span>Dashboard ({user.role})</span>
              </Link>
              {user.role === "farmer" && user.profileCompleted && (
                <Link
                  to="/farmer/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <User className="w-4 h-4 text-green-600" />
                  <span>{t("navbar.profile")}</span>
                </Link>
              )}
              <Link
                to="/change-password"
                onClick={closeMenu}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                <KeyRound className="w-4 h-4 text-green-600" />
                <span>{t("navbar.password")}</span>
              </Link>
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("navbar.logout")}</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
