
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { Briefcase, User } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

export default function Navbar({ white = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = Boolean(user);
  const role = user?.role ?? null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Sélecteur de langue simple (état local, pas d'internationalisation réelle)
  const [lang, setLang] = useState('fr');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', flag: '🇲🇦' },
  ];

  return (
    <nav className={`${white ? 'bg-white' : 'bg-[#F8D3E8]'} shadow-md`}>
      <div className="max-w-[1280px] mx-auto flex justify-between items-center h-16 px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
        >
           <div className="bg-purple-700 p-2 rounded-lg group-hover:bg-purple-900 transition-colors">
            <Briefcase className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl md:text-3xl font-bold text-gray-600  group-hover:text-purple-900 transition-colors">
            JOBYOUM
          </span>
        </Link>
 
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">


          {/* Sélecteur de langue - Desktop */}
          <div className="relative" ref={languageRef}>
            <button
              className="flex items-center gap-1 px-3 py-2 rounded hover:bg-transparent transition text-gray-700 font-bold"
              onClick={() => setIsLanguageOpen((open) => !open)}
              aria-haspopup="listbox"
              aria-expanded={isLanguageOpen}
            >
              <Globe className="w-5 h-5 mr-1 text-purple-700" />
              <span>{languages.find(l => l.code === lang)?.flag}</span>
              <span className="ml-1">{lang.toUpperCase()}</span>
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div
              className={`absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg transition-opacity duration-200 z-20 ${isLanguageOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
              role="listbox"
            >
              {languages.map(option => (
                <button
                  key={option.code}
                  className={`w-full text-left px-4 py-2 hover:bg-purple-50 flex items-center gap-2 ${lang === option.code ? 'font-bold text-purple-700' : 'text-gray-700'}`}
                  onClick={() => {
                    setLang(option.code);
                    setIsLanguageOpen(false);
                  }}
                >
                  <span>{option.flag}</span> {option.label}
                </button>
              ))}
            </div>
          </div>

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-purple-700 text-purple-700 rounded hover:bg-purple-700 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to={role === "RECRUITER" ? "/recruiter" : "/candidate"}
                className="text-gray-700 hover:text-purple-700 font-bold transition"
              >
                Mon Profil
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-purple-700 text-white font-bold rounded hover:bg-purple-800 transition border-none outline-none"
                style={{ border: 'none', outline: 'none' }}
              >
                Déconnexion
              </button>
            </>
          )}
        </div>

       {/* Hamburger Button - Mobile (lucide-react) */}
<button
  className="md:hidden flex items-center justify-center w-8 h-8 focus:outline-none"
  onClick={() => setIsOpen(!isOpen)}
  aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
  aria-expanded={isOpen}
>
  {isOpen ? (
    <X className="w-6 h-6 text-gray-700 transform transition-transform duration-300" />
  ) : (
    <Menu className="w-6 h-6 text-gray-700 transform transition-transform duration-300" />
  )}
</button>
</div>
        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-md px-6 py-4 flex flex-col gap-3">


            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border border-purple-700 text-purple-700 rounded hover:bg-purple-700 hover:text-white transition"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={role === "RECRUITER" ? "/recruiter" : "/candidate"}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Mon Profil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 bg-purple-700 text-white font-medium rounded hover:bg-purple-800 transition border-none outline-none"
                  style={{ border: 'none', outline: 'none' }}
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>
        )}
    </nav>
  );
}
