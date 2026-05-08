import Navbar from "../components/Navbar";
import React, { useState, useEffect } from "react";
import { api, API_URL, getAuthConfig } from "../lib/api";
import { useAuth } from "../context/AuthContext";



function RecruiterPage() {
  const { user } = useAuth();
  const JOB_OFFERS_PATH = "/job-offers";

  
  const [offers, setOffers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCandidatesModalOpen, setIsCandidatesModalOpen] = useState(false);
  const [currentCandidates, setCurrentCandidates] = useState([]);
  const [currentOfferTitle, setCurrentOfferTitle] = useState("");
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    companyName: "",
    description: "",
    city: "",
    contractType: "CDI",
    salaryMin: undefined,
    salaryMax: undefined,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [applicationsCounts, setApplicationsCounts] = useState({});

  // Ajoutez cette fonction après tous les useState et avant le useEffect
  const calculateApplicationsCounts = async (offersList) => {
    try {
      const counts = {};

      // Pour chaque offre, récupérer les candidatures et compter
      for (const offer of offersList) {
        try {
          const response = await api.get(`${JOB_OFFERS_PATH}/${offer.id}/applications`, getAuthConfig(user?.token));
          counts[offer.id] = response.data.length;
        } catch (err) {
          console.error(`❌ Erreur pour l'offre ${offer.id}:`, err);
          counts[offer.id] = 0;
        }
      }

      setApplicationsCounts(counts);
    } catch (err) {
      console.error("❌ Erreur lors du calcul des candidatures :", err);
    }
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await api.get(JOB_OFFERS_PATH, getAuthConfig(user?.token));
        setOffers(response.data);
        setErrorMsg("");

        // Ajoutez cette ligne pour calculer le nombre de candidatures
        calculateApplicationsCounts(response.data);
      } catch (err) {
        console.error("❌ Erreur lors du chargement des offres :", err);
        setErrorMsg("Erreur lors du chargement des offres.");
      }
    };

    fetchOffers();
  }, [user?.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      setErrorMsg("❌ Aucun token trouvé. Veuillez vous reconnecter.");
      return;
    }

    try {
      const { id } = formData;

      const url = id ? `${JOB_OFFERS_PATH}/${id}` : JOB_OFFERS_PATH;

      // Utiliser FormData pour pouvoir envoyer le logo
      const body = new FormData();
      const payload = {
        title: formData.title,
        companyName: formData.companyName,
        description: formData.description,
        city: formData.city,
        contractType: formData.contractType,
        salaryMin: formData.salaryMin,
        salaryMax: formData.salaryMax,
      };

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          body.append(key, String(value));
        }
      });
      if (logoFile) {
        body.append("logo", logoFile);
      }

      console.log("➡️ Envoi FormData avec logo :", logoFile?.name);

      const response = id
        ? await api.put(url, body, getAuthConfig(user.token))
        : await api.post(url, body, getAuthConfig(user.token));
      const data = response.data;
      console.log("📥 Réponse API :", data);

      if (id) {
        setOffers((prev) => prev.map((offer) => (offer.id === id ? data : offer)));
      } else {
        setOffers((prev) => [...prev, data]);
      }

      setIsModalOpen(false);
      setErrorMsg("");
    } catch (error: any) {
      console.error("❌ Erreur création/modification :", error);
      setErrorMsg(error.response?.data?.message || error.message || "Erreur lors de l'envoi");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette offre ?")) return;

    try {
      if (!user?.token) {
        throw new Error("Aucun token trouvé. Veuillez vous reconnecter.");
      }

      await api.delete(`${JOB_OFFERS_PATH}/${id}`, getAuthConfig(user.token));

      setOffers((prev) => prev.filter((offer) => offer.id !== id));
      setErrorMsg("");
    } catch (err: any) {
      console.error("❌ Erreur lors de la suppression :", err);
      setErrorMsg(err.response?.data?.message || err.message || "Erreur lors de la suppression.");
    }
  };

  // Fonction pour récupérer les candidatures d'une offre
 const fetchCandidates = async (offerId, offerTitle) => {
  setLoadingCandidates(true);
  try {
    const response = await api.get(`${JOB_OFFERS_PATH}/${offerId}/applications`, getAuthConfig(user?.token));
    setCurrentCandidates(response.data);
    setCurrentOfferTitle(offerTitle);
    setIsCandidatesModalOpen(true);
    setErrorMsg("");
    
    // Mettre à jour le compteur après avoir récupéré les candidatures
    setApplicationsCounts(prev => ({
      ...prev,
      [offerId]: response.data.length
    }));
  } catch (err: any) {
    console.error("❌ Erreur lors du chargement des candidatures :", err);
    setErrorMsg(err.response?.data?.message || "Erreur lors du chargement des candidatures.");
  } finally {
    setLoadingCandidates(false);
  }
};



  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("fr-FR");
  };

  const openModal = (offer = null) => {
    setLogoFile(null);
    setLogoPreview(offer?.logoUrl ? `${API_URL}${offer.logoUrl}` : null);
    if (offer) {
      setFormData({
        id: offer.id,
        title: offer.title || "",
        companyName: offer.companyName || "",
        description: offer.description || "",
        city: offer.city || "",
        contractType: offer.contractType || "CDI",
        salaryMin: offer.salaryMin ?? undefined,
        salaryMax: offer.salaryMax ?? undefined,
      });
    } else {
      setFormData({
        id: null,
        title: "",
        companyName: "",
        description: "",
        city: "",
        contractType: "CDI",
        salaryMin: undefined,
        salaryMax: undefined,
      });
    }
    setIsModalOpen(true);
    setErrorMsg("");
  };

  return (
    <>
      <Navbar white />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Mes Offres d'emploi
          </h1>
          <button
            onClick={() => openModal()}
            className="px-5 py-2 bg-[#822BD1] hover:bg-indigo-700 text-white font-medium rounded-md transition-colors shadow"
          >
            Ajouter une offre
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md font-semibold">
            {errorMsg}
          </div>
        )}

        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full table-auto bg-white rounded-lg overflow-hidden">
            <thead className="bg-[#822BD1] text-white">
              <tr>
                <th className="p-3 text-left">Titre du Poste</th>
                <th className="p-3 text-left">Entreprise</th>
                <th className="p-3 text-left">Ville</th>
                <th className="p-3 text-left">Type de Contrat</th>
                <th className="p-3 text-left">Date de Publication</th>
                <th className="p-3 text-center">Candidatures</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((jobOffer) => (
                <tr
                  key={jobOffer.id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="p-3">{jobOffer.title}</td>
                  <td className="p-3">{jobOffer.companyName || "Non spécifié"}</td>
                  <td className="p-3">{jobOffer.city}</td>
                  <td className="p-3">{jobOffer.contractType}</td>
                  <td className="p-3">{formatDate(jobOffer.createdAt)}</td>
                 
                  <td className="p-3 text-center font-semibold text-indigo-600">
                    {applicationsCounts[jobOffer.id] || 0}
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => fetchCandidates(jobOffer.id, jobOffer.title)}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black text-sm font-medium rounded-md text-center transition-colors"
                    >
                      Voir
                    </button>
                    <button
                      onClick={() => openModal(jobOffer)}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black text-sm font-medium rounded-md transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(jobOffer.id)}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black text-sm font-medium rounded-md transition-colors"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {offers.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center p-6 text-gray-500 italic"
                  >
                    Aucune offre pour le moment
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal pour créer/modifier une offre */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-6 text-[#822BD1]">
                {formData.id ? "Modifier l'offre" : "Créer une nouvelle offre"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre du poste *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Développeur Frontend"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#822BD1] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de l'entreprise *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Ma Société SAS"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#822BD1] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Paris"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#822BD1] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de contrat *
                    </label>
                    <select
                      value={formData.contractType}
                      onChange={(e) =>
                        setFormData({ ...formData, contractType: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#822BD1] focus:border-transparent"
                    >
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="STAGE">Stage</option>
                      <option value="ALTERNANCE">Alternance</option>
                      <option value="FREELANCE">Freelance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salaire minimum (€)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 35000"
                      value={formData.salaryMin ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          salaryMin: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#822BD1] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salaire maximum (€)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 45000"
                      value={formData.salaryMax ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          salaryMax: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#822BD1] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Upload du logo */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo de l'entreprise
                  </label>
                  <div className="flex items-center gap-4">
                    {(logoPreview || logoFile) && (
                      <div className="w-20 h-14 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img
                          src={logoFile ? URL.createObjectURL(logoFile) : logoPreview!}
                          alt="Aperçu logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setLogoFile(file);
                        if (file) setLogoPreview(URL.createObjectURL(file));
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-[#822BD1] hover:file:bg-purple-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description du poste *
                  </label>
                  <textarea
                    placeholder="Décrivez les missions, responsabilités et compétences requises..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#822BD1] focus:border-transparent"
                    rows={6}
                    required
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mr-3 px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#822BD1] hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow"
                  >
                    {formData.id ? "Modifier" : "Créer"} l'offre
                  </button>
                </div>
              </form>
              {errorMsg && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md font-semibold">
                  {errorMsg}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal pour afficher les candidatures */}
        {isCandidatesModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsCandidatesModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-6 text-[#822BD1]">
                Candidatures pour : {currentOfferTitle}
              </h2>

              {loadingCandidates ? (
                <div className="text-center p-6">
                  <p className="text-gray-600">Chargement des candidatures...</p>
                </div>
              ) : currentCandidates.length === 0 ? (
                <div className="text-center p-6">
                  <p className="text-gray-500">Aucune candidature pour cette offre.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentCandidates.map((candidate, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <span className="font-semibold text-lg">{candidate.candidate?.email || "Candidat"}</span>
                      <a
                        href={`${API_URL}/applications/${candidate.id}/cv`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#822BD1] text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Voir le CV
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RecruiterPage;