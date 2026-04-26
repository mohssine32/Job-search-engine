
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Navbar from "../components/Navbar";
import { API_URL } from "../lib/api";




// Interface pour les données de la LISTE D'OFFRES (légères)
// Doit correspondre à la réponse de GET /job-offers
interface JobList {
  id: string;
  title: string;
  companyName: string | null;
  logoUrl: string | null;
  city: string;
  contractType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  createdAt: string;
}

// Interface pour les données de DÉTAIL D'UNE OFFRE (complètes)
// Doit correspondre à la réponse de GET /job-offers/:id
interface JobDetail extends JobList {
  description: string;
}

export default function JobPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || "";
  const [jobs, setJobs] = useState<JobList[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [contractFilter, setContractFilter] = useState("");
  const [contractOpen, setContractOpen] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);
  const [cityFilter, setCityFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour formater la date de manière relative (ex: "il y a 1 semaine")
  const formatRelativeDate = (dateString: string): string => {
    if (!dateString) return "Date inconnue";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Date invalide";
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) return "À l'instant";
    if (diffMinutes < 60) return `il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    if (diffHours < 24) return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    if (diffWeeks < 4) return `il y a ${diffWeeks} semaine${diffWeeks > 1 ? 's' : ''}`;
    if (diffMonths < 12) return `il y a ${diffMonths} mois`;
    return `il y a ${diffYears} an${diffYears > 1 ? 's' : ''}`;
  };

  // Fonction pour récupérer la liste des offres
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      
      const response = await axios.get<JobList[]>(
      `${API_URL}/job-offers`,        { headers }
      );
      setJobs(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des offres d'emploi.");
      console.error("Erreur API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Fermer le dropdown contrat quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contractRef.current && !contractRef.current.contains(e.target as Node)) {
        setContractOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchSearch = !searchTerm ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.companyName && job.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchContract = !contractFilter || job.contractType === contractFilter;
    const matchCity = !cityFilter ||
      job.city.toLowerCase().includes(cityFilter.toLowerCase());
    return matchSearch && matchContract && matchCity;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar white />
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
             <h1 className="font-bold text-3xl">Parcourez les <span className="text-violet-700">offres</span></h1>
        {/* Barre de recherche */}
        <div className="mb-6 bg-gray-900 rounded-xl shadow-md p-4">
          <div className="flex flex-col md:flex-row">
            {/* Recherche par poste / entreprise */}
            <div className="flex-[2]">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 rounded-none md:rounded-l-lg md:rounded-r-none bg-white placeholder-gray-400 focus:outline-none"
                  placeholder="Poste ou entreprise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Dropdown type de contrat */}
            <div className="flex-1" ref={contractRef}>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-black z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <button
                  type="button"
                  onClick={() => setContractOpen(!contractOpen)}
                  className="w-full py-3 pl-10 pr-4 rounded-none bg-white text-gray-700 focus:outline-none cursor-pointer border-0 text-left flex items-center justify-between"
                >
                  <span>{contractFilter ? ["CDI","CDD","Stage","Alternance","Freelance"].find(c => c.toUpperCase() === contractFilter) || contractFilter : "Tous les contrats"}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${contractOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {contractOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-lg z-20 py-1">
                    {[
                      { value: "", label: "Tous les contrats" },
                      { value: "CDI", label: "CDI" },
                      { value: "CDD", label: "CDD" },
                      { value: "STAGE", label: "Stage" },
                      { value: "ALTERNANCE", label: "Alternance" },
                      { value: "FREELANCE", label: "Freelance" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => { setContractFilter(option.value); setContractOpen(false); }}
                        className={`w-full text-left px-4 py-2 hover:bg-violet-50 cursor-pointer ${
                          contractFilter === option.value ? 'text-violet-700 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recherche par ville */}
            <div className="flex-1">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 rounded-none md:rounded-r-lg md:rounded-l-none bg-white placeholder-gray-400 focus:outline-none"
                  placeholder="Ville..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Messages d'état (Chargement & Erreur) */}
        {loading && (
          <div className="text-center p-6 bg-white rounded-lg shadow">
            <p className="text-gray-600">Chargement des offres...</p>
          </div>
        )}
        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-black-700">Emplois recommandés <span className="text-violet-700">{filteredJobs.length} </span></h2>
          {!loading && filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">Aucune offre ne correspond à votre recherche.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => navigate(`/job/${job.id}`)}
                className="flex items-stretch justify-between gap-6 border rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-all duration-200 border-gray-100 group cursor-pointer max-w-[900px]"
              >
                <div className="flex gap-6 flex-1">
                  {/* Logo */}
                  <div className="flex-shrink-0 w-24 h-16 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 text-2xl font-bold group-hover:bg-purple-200 overflow-hidden">
                    {job.logoUrl ? (
                      <img
                        src={`${API_URL}${job.logoUrl}`}
                        alt={`${job.companyName || 'Entreprise'} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      job.companyName ? job.companyName[0].toUpperCase() : <span>🏢</span>
                    )}
                  </div>
                  {/* Infos principales */}
                  <div className="flex-1 min-w-0">
                    {/* Nom entreprise en haut */}
                    <div className="mb-1">
                      <span className="text-base text-gray-700 group-hover:text-purple-700 block truncate">{job.companyName || 'Entreprise non spécifiée'}</span>
                    </div>
                    {/* Nom du poste */}
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 mb-3 truncate">{job.title}</h3>
                    
                    {/* Type de contrat et Lieu */}
                    <div className="flex gap-4 items-center">
                      {/* Type de contrat avec icône cartable */}
                      <div className="flex gap-2 items-center text-gray-700 text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{job.contractType || "N/A"}</span>
                      </div>
                      
                      {/* Lieu avec icône localisation */}
                      <div className="flex gap-2 items-center text-gray-700 text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{job.city || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Date relative - À droite en bas */}
                <div className="flex flex-col justify-end items-end flex-shrink-0">
                  <div className="text-xs text-black font-medium whitespace-nowrap">
                    {formatRelativeDate(job.createdAt)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Modale de candidature supprimée pour simplification et correction des erreurs */}
    </div>

    
  );
}