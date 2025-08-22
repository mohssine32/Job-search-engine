import { useState, useEffect } from "react";
import axios from "axios";

// Interface pour les données de la LISTE D'OFFRES (légères)
// Doit correspondre à la réponse de GET /job-offers
interface JobList {
  id: string;
  title: string;
  companyName: string | null;
  city: string;
  contractType: string;
  salaryMin: number | null;
  salaryMax: number | null;
}

// Interface pour les données de DÉTAIL D'UNE OFFRE (complètes)
// Doit correspondre à la réponse de GET /job-offers/:id
interface JobDetail extends JobList {
  description: string;
}

export default function JobPage() {
  const [jobs, setJobs] = useState<JobList[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobDetail | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer la liste des offres
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get<JobList[]>("http://localhost:3000/job-offers");
      
      setJobs(response.data);
      
      // Si on a des offres, on sélectionne la première et on charge ses détails
      if (response.data.length > 0) {
        handleSelectJob(response.data[0]);
      } else {
        setSelectedJob(null); // S'il n'y a aucune offre
      }
    } catch (err) {
      setError("Erreur lors du chargement des offres d'emploi.");
      console.error("Erreur API:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les détails d'une seule offre
  const handleSelectJob = async (job: JobList) => {
    // Affiche immédiatement l'offre sélectionnée avec un message de chargement pour la description
    setSelectedJob({ ...job, description: 'Chargement...' });

    try {
      // Fait un appel à l'API pour obtenir toutes les infos, y compris la description
      const response = await axios.get<JobDetail>(`http://localhost:3000/job-offers/${job.id}`);
      setSelectedJob(response.data); // Met à jour l'état avec les données complètes
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'offre :", error);
      // En cas d'erreur, on affiche un message d'erreur dans la description
      setSelectedJob({ ...job, description: "Impossible de charger la description de l'offre." });
    }
  };

  // Chargement initial des données au premier rendu du composant
  useEffect(() => {
    fetchJobs();
  }, []);

  // Filtrage des offres en fonction de la recherche de l'utilisateur
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.companyName && job.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    job.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Offres d'emploi</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Barre de recherche */}
        <div className="mb-6">
          <input
            type="text"
            className="block w-full pl-4 pr-10 py-3 border border-gray-300 rounded-md shadow-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Rechercher un poste, une entreprise ou une ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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

        <div className="flex flex-col md:flex-row gap-6">
          {/* Section gauche - liste des cartes d'offres */}
          <div className="w-full md:w-2/5 space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Emplois recommandés ({filteredJobs.length})</h2>
            
            {!loading && filteredJobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">Aucune offre ne correspond à votre recherche.</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleSelectJob(job)}
                  className={`cursor-pointer border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all duration-200 ${
                    selectedJob?.id === job.id ? 'border-purple-500 border-2' : 'border-gray-200'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-700 mt-1">{job.companyName || 'Entreprise non spécifiée'}</p>
                  <p className="text-sm text-gray-600 mt-2">{job.city} • {job.contractType}</p>
                  <p className="text-sm text-gray-800 font-medium mt-2">
                    {job.salaryMin && `${job.salaryMin}€`}
                    {job.salaryMin && job.salaryMax && ' - '}
                    {job.salaryMax && `${job.salaryMax}€`}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Section droite - détails de l'offre sélectionnée */}
          <div className="w-full md:w-3/5">
            {selectedJob ? (
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200 space-y-6 sticky top-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                  <p className="text-lg text-gray-700 font-medium mt-1">{selectedJob.companyName || 'Entreprise non spécifiée'}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-gray-600">
                  <span className="flex items-center">📍 {selectedJob.city}</span>
                  <span className="flex items-center">💰 {selectedJob.salaryMin && `${selectedJob.salaryMin}€`}{selectedJob.salaryMin && selectedJob.salaryMax && ' - '}{selectedJob.salaryMax && `${selectedJob.salaryMax}€`}</span>
                  <span className="flex items-center">📄 {selectedJob.contractType}</span>
                </div>

                <button className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 font-bold text-white rounded-md shadow-md transition-colors duration-200">
                  Postuler maintenant
                </button>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Détails de l'offre</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
                </div>
              </div>
            ) : (
              !loading && (
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200 flex flex-col items-center justify-center h-64 text-center">
                  <p className="text-gray-500 text-lg">Sélectionnez une offre d'emploi pour voir les détails</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}