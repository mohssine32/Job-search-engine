

import Navbar from "../components/Navbar";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Recruterpage() {
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: "Développeur Full Stack",
      description: "Développement web complet",
      city: "Paris",
      contractType: "CDI",
      salaryMin: 35000,
      salaryMax: 45000,
      createdAt: "2025-07-20T10:30:00Z",
      applicationsCount: 12,
    },
    {
      id: 2,
      title: "Designer UX/UI",
      description: "Création d'interfaces ergonomiques",
      city: "Lyon",
      contractType: "CDD",
      salaryMin: 28000,
      salaryMax: 35000,
      createdAt: "2025-07-15T14:45:00Z",
      applicationsCount: 5,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    city: "",
    contractType: "CDI",
    salaryMin: "",
    salaryMax: "",
  });

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("fr-FR");
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette offre ?")) {
      setOffers((prev) => prev.filter((offer) => offer.id !== id));
    }
  };

  const openModal = (offer = null) => {
    if (offer) {
      setFormData(offer);
    } else {
      setFormData({
        id: null,
        title: "",
        description: "",
        city: "",
        contractType: "CDI",
        salaryMin: "",
        salaryMax: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      // Modification
      setOffers((prev) =>
        prev.map((o) => (o.id === formData.id ? formData : o))
      );
    } else {
      // Ajout
      setOffers((prev) => [
        ...prev,
        { ...formData, id: Date.now(), createdAt: new Date().toISOString(), applicationsCount: 0 },
      ]);
    }
    setIsModalOpen(false);
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
                    {jobOffer.applicationsCount}
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
                  <option value="Stage">Stage</option>
                  <option value="Alternance">Alternance</option>
                </select>
                <input
                  type="number"
                  placeholder="Salaire minimum"
                  value={formData.salaryMin}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryMin: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
                <input
                  type="number"
                  placeholder="Salaire maximum"
                  value={formData.salaryMax}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryMax: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
                <button
                  type="submit"
                  className="w-full bg-[#822BD1] hover:bg-indigo-700 text-white py-2 rounded"
                >
                  Enregistrer
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Recruterpage;
