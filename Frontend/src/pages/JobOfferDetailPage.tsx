import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Navbar from "../components/Navbar";

interface JobDetail {
  id: string;
  title: string;
  description: string;
  companyName: string | null;
  logoUrl: string | null;
  city: string;
  contractType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  createdAt: string;
}

export default function JobOfferDetailPage() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<JobDetail>(
          `${API_URL}/job-offers/${id}`
        );
        setJob(response.data);
      } catch (err) {
        setError("Impossible de charger les détails de l'offre.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetail();
    }
  }, [id]);

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

  const handleApply = async () => {
    if (!user) {
      alert("Vous devez être connecté pour postuler.");
      navigate("/login");
      return;
    }

    if (user.role !== "CANDIDATE") {
      alert("Seuls les candidats peuvent postuler à des offres.");
      return;
    }

    if (!cvFile) {
      alert("Veuillez sélectionner un CV.");
      return;
    }

    try {
      setIsApplying(true);
      const formData = new FormData();
      formData.append("cv", cvFile);
      formData.append("jobOfferId", id);

      await axios.post(
        `${API_URL}/applications`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      setApplicationSuccess(true);
      setTimeout(() => {
        navigate("/candidate");
      }, 2000);
    } catch (err) {
      console.error("Erreur lors de la candidature:", err);
      alert("Erreur lors de la candidature. Veuillez réessayer.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleOpenApplyModal = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "CANDIDATE") {
      alert("Seuls les candidats peuvent postuler à des offres.");
      return;
    }

    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div>
        <Navbar white />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <p className="text-gray-600">Chargement des détails de l'offre...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div>
        <Navbar white />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Offre non trouvée"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar white />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* En-tête avec logo et infos principales */}
        <div className="bg-white rounded-xl shadow-md p-5 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
            {/* Logo */}
            <div className="flex-shrink-0 w-20 h-20 sm:w-32 sm:h-32 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 text-2xl sm:text-4xl font-bold overflow-hidden mx-auto sm:mx-0">
              {job.logoUrl ? (
                <img
                  src={`${API_URL}${job.logoUrl}`}
                  alt={`${job.companyName} logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                job.companyName ? job.companyName[0].toUpperCase() : "🏢"
              )}
            </div>

            {/* Infos principales */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <p className="text-base sm:text-lg text-gray-600 mb-4">{job.companyName || "Entreprise non spécifiée"}</p>
                </div>
              </div>
              
              {/* Détails rapides */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                {/* Type de contrat */}
                <div className="flex gap-2 items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{job.contractType}</span>
                </div>

                {/* Lieu */}
                <div className="flex gap-2 items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">{job.city}</span>
                </div>

                {/* Salaire */}
                {(job.salaryMin || job.salaryMax) && (
                  <div className="flex gap-2 items-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">
                      {job.salaryMin && `${job.salaryMin}€`}
                      {job.salaryMin && job.salaryMax && " - "}
                      {job.salaryMax && `${job.salaryMax}€`}
                    </span>
                  </div>
                )}

                {/* Date */}
                <div className="flex gap-2 items-center text-gray-600 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatRelativeDate(job.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Détails de l'offre</h2>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {job.description}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-gray-700 font-medium">Cette offre vous intéresse ?</p>
          <button
            onClick={handleOpenApplyModal}
            className="w-full sm:w-auto py-3 px-6 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
          >
            Postuler
          </button>
        </div>

        {/* Modal de candidature */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Postuler à cette offre</h2>
              
              {applicationSuccess ? (
                <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg">
                  ✅ Candidature envoyée avec succès!
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sélectionner votre CV
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                    />
                    {cvFile && <p className="text-sm text-green-600 mt-2">✅ {cvFile.name}</p>}
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleApply}
                      disabled={isApplying || !cvFile}
                      className="flex-1 py-2 px-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition"
                    >
                      {isApplying ? "Envoi..." : "Postuler"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
