import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

function Recruterpage() {
  const API_URL = "http://localhost:3000/job-offers";

  const [offers, setOffers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    companyName: "", // Nouveau champ pour le nom de l'entreprise
    description: "",
    city: "",
    contractType: "CDI",
    salaryMin: undefined,
    salaryMax: undefined,
  });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("user_token");
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Erreur API : " + res.status);

        const data = await res.json();
        setOffers(data);
        setErrorMsg("");
      } catch (err) {
        console.error("❌ Erreur lors du chargement des offres :", err);
        setErrorMsg("Erreur lors du chargement des offres.");
      }
    };

    fetchOffers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("user_token");
      const payload = {
        title: formData.title,
        companyName: formData.companyName, // Inclure le nom de l'entreprise
        description: formData.description,
        city: formData.city,
        contractType: formData.contractType,
        salaryMin: formData.salaryMin !== undefined ? formData.salaryMin : null,
        salaryMax: formData.salaryMax !== undefined ? formData.salaryMax : null,
      };

      console.log("Payload envoyé:", payload);

      const response = await fetch(API_URL, {
        method: formData.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création");
      }

      const newOffer = await response.json();
      
      if (formData.id) {
        // Mise à jour d'une offre existante
        setOffers(prev => prev.map(offer => 
          offer.id === formData.id ? newOffer : offer
        ));
      } else {
        // Ajout d'une nouvelle offre
        setOffers(prev => [...prev, newOffer]);
      }
      
      setIsModalOpen(false);
      setErrorMsg("");
    } catch (error) {
      console.error("Erreur:", error);
      setErrorMsg(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette offre ?")) return;

    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erreur API : " + res.status);

      setOffers((prev) => prev.filter((offer) => offer.id !== id));
      setErrorMsg("");
    } catch (err) {
      console.error("❌ Erreur lors de la suppression :", err);
      setErrorMsg("Erreur lors de la suppression.");
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("fr-FR");
  };

  const openModal = (offer = null) => {
    setFormData(
      offer || {
        id: null,
        title: "",
        companyName: "",
        description: "",
        city: "",
        contractType: "CDI",
        salaryMin: undefined,
        salaryMax: undefined
      }
    );
    setIsModalOpen(true);
    setErrorMsg("");
  };

  return (
    <>
      <Navbar />
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
                    {jobOffer.applicationsCount ?? 0}
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <Link
                      to={`/offres/${jobOffer.id}/candidats`}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black text-sm font-medium rounded-md text-center transition-colors"
                    >
                      Voir
                    </Link>
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

        {/* Modal amélioré */}
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
      </div>
    </>
  );
}

export default Recruterpage;