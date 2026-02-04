import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";



function Condidateoffrepage() {
  const { id } = useParams(); // id de l'offre
  const [candidats, setCandidats] = useState([]);

  useEffect(() => {
    // TODO: remplacer par un appel API réel
    // Exemple statique pour la démo :
    const fakeCandidats = [
      {
        id: 1,
        nom: "Mohammed Mouhssine",
        email: "mohammed@example.com",
        dateCandidature: "2025-08-10T14:00:00Z",
        cvUrl: "https://monbackend.com/cvs/mohammed.pdf",
      },
      {
        id: 2,
        nom: "Sarah Dupont",
        email: "sarah@example.com",
        dateCandidature: "2025-08-11T09:30:00Z",
        cvUrl: "https://monbackend.com/cvs/sarah.pdf",
      },
    ];

    setCandidats(fakeCandidats);
  }, [id]);

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("fr-FR");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Link to="/" className="text-indigo-600 hover:underline mb-4 inline-block">
        ← Retour aux offres
      </Link>
      <h2 className="text-2xl font-bold mb-6">Candidats pour l'offre #{id}</h2>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full table-auto bg-white rounded-lg overflow-hidden">
          <thead className="bg-[#822BD1] text-white">
            <tr>
              <th className="p-3 text-left">Nom / Email</th>
              <th className="p-3 text-left">Date de Candidature</th>
              <th className="p-3 text-center">CV</th>
            </tr>
          </thead>
          <tbody>
            {candidats.length > 0 ? (
              candidats.map((cand) => (
                <tr
                  key={cand.id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="p-3">
                    {cand.nom} / {cand.email}
                  </td>
                  <td className="p-3">{formatDate(cand.dateCandidature)}</td>
                  <td className="p-3 text-center">
                    <a
                      href={`http://localhost:3000/applications/${cand.id}/cv`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        Voir le CV
                      </button>
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-6 text-gray-500 italic">
                  Aucun candidat pour cette offre
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Condidateoffrepage;
