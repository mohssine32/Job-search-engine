import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { api, getAuthConfig } from '../lib/api';

type Recruiter = {
  id: string;
  email: string;
  createdAt: string;
  _count: {
    jobOffers: number;
  };
};

export default function AdminPage() {
  const { user, isAuthReady } = useAuth();
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.token || user.role !== 'ADMIN') {
      setLoading(false);
      return;
    }

    const loadRecruiters = async () => {
      try {
        const response = await api.get('/admin/recruiters', getAuthConfig(user.token));
        setRecruiters(response.data);
      } catch {
        setError('Erreur lors du chargement des recruteurs.');
      } finally {
        setLoading(false);
      }
    };

    void loadRecruiters();
  }, [user]);

  const handleDelete = async (recruiterId: string) => {
    if (!user?.token) {
      return;
    }

    const confirmed = window.confirm('Supprimer ce recruteur et toutes ses offres ?');
    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(recruiterId);
      await api.delete(`/admin/recruiters/${recruiterId}`, getAuthConfig(user.token));
      setRecruiters((prevRecruiters) =>
        prevRecruiters.filter((recruiter) => recruiter.id !== recruiterId),
      );
    } catch {
      setError('Erreur lors de la suppression du recruteur.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Chargement...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-500">
            Administration
          </p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">Gestion des recruteurs</h1>
          <p className="mt-2 text-sm text-gray-600">
            Consultez la liste des recruteurs et supprimez un compte avec toutes ses offres.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Liste des recruteurs</h2>
          </div>

          {loading ? (
            <div className="px-6 py-10 text-sm text-gray-500">Chargement...</div>
          ) : recruiters.length === 0 ? (
            <div className="px-6 py-10 text-sm text-gray-500">Aucun recruteur trouve.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Date inscription
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Nombre d'offres
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {recruiters.map((recruiter) => (
                    <tr key={recruiter.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{recruiter.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(recruiter.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {recruiter._count.jobOffers}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(recruiter.id)}
                          disabled={deletingId === recruiter.id}
                          className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
                        >
                          {deletingId === recruiter.id ? 'Suppression...' : 'Supprimer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}