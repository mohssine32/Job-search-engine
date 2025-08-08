import Navbar from "../components/Navbar"
import { useEffect, useState } from "react";

export default function CandidateApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simule un appel backend avec des données factices
    const mockData = [
      {
        id: 'app_123',
        status: 'PENDING',
        createdAt: '2025-07-20T10:00:00.000Z',
        jobOffer: {
          title: 'Développeur Fullstack Senior',
        },
      },
      {
        id: 'app_456',
        status: 'REVIEWED',
        createdAt: '2025-07-18T15:30:00.000Z',
        jobOffer: {
          title: 'Chef de Projet Web',
        },
      },
      {
        id: 'app_789',
        status: 'ACCEPTED',
        createdAt: '2025-07-10T08:45:00.000Z',
        jobOffer: {
          title: 'UX Designer',
        },
      },
    ];

    // Simule un délai de chargement comme un vrai fetch
    setTimeout(() => {
      setApplications(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Chargement des candidatures...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Mes candidatures</h2>
        {applications.length === 0 ? (
          <p className="text-gray-600">Aucune candidature trouvée.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Titre du poste</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Statut</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Date de candidature</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">{app.jobOffer.title}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : app.status === 'REVIEWED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(app.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}