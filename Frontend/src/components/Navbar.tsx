import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("user_token");
      if (token) {
        setIsAuthenticated(true);

        try {
          const decoded = jwtDecode(token);
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

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-[1280px] mx-auto flex justify-between items-center h-16 px-6">
        {/* Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-bold text-purple-700 hover:text-purple-900 transition">
          JOBYoum
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-700 hover:text-purple-700 font-medium transition">
            Home
          </Link>
          <Link to="/jobpage" className="text-gray-700 hover:text-purple-700 font-medium transition">
            Trouver un job
          </Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="px-4 py-2 border border-purple-700 text-purple-700 rounded hover:bg-purple-700 hover:text-white transition">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to={role === "RECRUITER" ? "/recruterpage" : "/condidatepage"}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
              >
                Mon Profil
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Déconnexion
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
