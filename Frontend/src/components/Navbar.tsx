
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Menu, X, Globe } from "lucide-react";
import { Briefcase, User } from 'lucide-react';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("user_token");
      if (token) {
        setIsAuthenticated(true);

        try {
          const decoded = jwtDecode(token) as { role: string };
          setRole(decoded.role); // "CANDIDATE" ou "RECRUITER"
        } catch (err) {
          console.error("Token invalide", err);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        setRole(null);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    setIsAuthenticated(false);
    setRole(null);
    navigate("/login");
  };

  // Sélecteur de langue simple (état local, pas d'internationalisation réelle)
  const [lang, setLang] = useState('fr');
  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', flag: '🇲🇦' },
  ];

  return (
    <nav className="bg-[#F8D3E8] shadow-md">
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
          <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-2 rounded hover:bg-purple-100 transition text-gray-700 font-bold" tabIndex={0}>
              <Globe className="w-5 h-5 mr-1 text-purple-700" />
              <span>{languages.find(l => l.code === lang)?.flag}</span>
              <span className="ml-1">{lang.toUpperCase()}</span>
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-20">
              {languages.map(option => (
                <button
                  key={option.code}
                  className={`w-full text-left px-4 py-2 hover:bg-purple-50 flex items-center gap-2 ${lang === option.code ? 'font-bold text-purple-700' : 'text-gray-700'}`}
                  onClick={() => setLang(option.code)}
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
                to={role === "RECRUITER" ? "/recruterpage" : "/condidatepage"}
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

       {/* Sélecteur de langue - Mobile */}
       <div className="md:hidden flex items-center">
         <select
           value={lang}
           onChange={e => setLang(e.target.value)}
           className="rounded px-2 py-1 border border-gray-300 text-gray-700 bg-white mr-2 focus:outline-none focus:ring-1 focus:ring-purple-400"
           aria-label="Sélecteur de langue"
         >
           {languages.map(option => (
             <option key={option.code} value={option.code}>
               {option.flag} {option.label}
             </option>
           ))}
         </select>
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
                  to={role === "RECRUITER" ? "/recruterpage" : "/condidatepage"}
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
