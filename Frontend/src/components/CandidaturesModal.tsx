import React, { useEffect, useState } from "react";

function CandidaturesModal({ offerId, onClose }) {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!offerId) return;
    const fetchCandidatures = async () => {
      try {
        const token = localStorage.getItem("user_token");
        const res = await fetch(`http://localhost:3000/job-offers/${offerId}/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur lors du chargement des candidatures");
        const data = await res.json();
        setCandidatures(data);
      } catch (err) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidatures();
  }, [offerId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl">&times;</button>
        <h2 className="text-xl font-bold mb-4">Candidatures pour l'offre</h2>
        {loading ? (
          <div>Chargement...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto bg-white rounded-lg overflow-hidden">
              <thead className="bg-[#822BD1] text-white">
                <tr>
                  <th className="p-3 text-left">Email du candidat</th>
                  <th className="p-3 text-left">Date de candidature</th>
                  <th className="p-3 text-center">CV</th>
                </tr>
              </thead>
              <tbody>
                {candidatures.length > 0 ? (
                  candidatures.map((cand) => (
                    <tr key={cand.id} className="border-b hover:bg-gray-100 transition">
                      <td className="p-3">{cand.candidate?.email || "-"}</td>
                      <td className="p-3">{new Date(cand.createdAt).toLocaleDateString("fr-FR")}</td>
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
        )}
      </div>
    </div>
  );
}

export default CandidaturesModal;
