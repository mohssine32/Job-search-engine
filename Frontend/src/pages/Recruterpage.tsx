import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

function Recruterpage() {
  const API_URL = "http://localhost:3000/job-offers"; // adapte l'URL à ton backend

  const [offers, setOffers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    city: "",
    contractType: "CDI",
    salaryMin: undefined,  // Changé de null à undefined
    salaryMax: undefined,  // Changé de null à undefined
  });
  const [errorMsg, setErrorMsg] = useState(""); // Ajout gestion d'erreur

  // ✅ Charger les offres du recruteur connecté
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
        setErrorMsg(""); // Reset erreur
      } catch (err) {
        console.error("❌ Erreur lors du chargement des offres :", err);
        setErrorMsg("Erreur lors du chargement des offres.");
      }
    };

    fetchOffers();
  }, []);


  console.log("Payload envoyé au backend :", JSON.stringify(formData, null, 2));

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("user_token");
    const payload = {
      title: formData.title,
      description: formData.description,
      city: formData.city,
      contractType: formData.contractType,
      salaryMin: formData.salaryMin !== undefined ? formData.salaryMin : null,
      salaryMax: formData.salaryMax !== undefined ? formData.salaryMax : null,
    };

    console.log("Payload envoyé:", payload);

    const response = await fetch(API_URL, {
      method: "POST",
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

    // ... reste du code
  } catch (error) {
    console.error("Erreur:", error);
    setErrorMsg(error.message);
  }
};

  // ✅ Supprimer une offre côté backend
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
      setErrorMsg(""); // Reset erreur
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
        description: "",
        city: "",
        contractType: "CDI",
         salaryMin: undefined,  // ✅ Initialisation correcte
        salaryMax: undefined   // ✅ Initialisation correcte
      }
    );
    setIsModalOpen(true);
    setErrorMsg(""); // Reset erreur
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
          <div className="mb-4 text-red-600 font-semibold">{errorMsg}</div>
        )}

        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full table-auto bg-white rounded-lg overflow-hidden">
            <thead className="bg-[#822BD1] text-white">
              <tr>
                <th className="p-3 text-left">Titre du Poste</th>
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
                  <td className="p-3">{jobOffer.city}</td>
                  <td className="p-3">{jobOffer.contractType}</td>
                  <td className="p-3">{formatDate(jobOffer.createdAt)}</td>
                  <td className="p-3 text-center font-semibold text-indigo-600">
                    {jobOffer.applicationsCount ?? 0}
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <Link
                      to={`/offres/${jobOffer.id}/candidats`}
                      className="px-4 py-2 bg-gray-300 text-black text-sm font-medium rounded-md text-center"
                    >
                      Voir
                    </Link>
                    <button
                      onClick={() => openModal(jobOffer)}
                      className="px-4 py-2 bg-gray-300 text-black text-sm font-medium rounded-md"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(jobOffer.id)}
                      className="px-4 py-2 bg-gray-300 text-black text-sm font-medium rounded-md"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {offers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-6 text-gray-500 italic"
                  >
                    Aucune offre pour le moment
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4">
                {formData.id ? "Modifier l'offre" : "Ajouter une offre"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Titre"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border rounded p-2"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border rounded p-2"
                  rows={4}
                  required
                />
                <input
                  type="text"
                  placeholder="Ville"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full border rounded p-2"
                  required
                />
                <select
                  value={formData.contractType}
                  onChange={(e) =>
                    setFormData({ ...formData, contractType: e.target.value })
                  }
                  className="w-full border rounded p-2"
                >
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="STAGE">Stage</option>
                  <option value="ALTERNANCE">Alternance</option>
                </select>
                <input
                  type="number"
                  placeholder="Salaire minimum"
                  value={formData.salaryMin ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salaryMin: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Salaire maximum"
                  value={formData.salaryMax ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salaryMax: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                />
                <button
                  type="submit"
                  className="w-full bg-[#822BD1] hover:bg-indigo-700 text-white py-2 rounded"
                >
                  Enregistrer
                </button>
              </form>
              {errorMsg && (
                <div className="mt-4 text-red-600 font-semibold">{errorMsg}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Recruterpage;
