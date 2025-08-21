

import JobFilterWithSearch from '../components/JobFilterWithSearch';
import Navbar from '../components/Navbar';

import { useState, useEffect } from "react";





export default function JobPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  return (
    <>
     <div className='bg-gray-50'>
      <Navbar />
      <JobFilterWithSearch />

      <div className="min-h-screen flex p-4 w-[1200px] mx-auto bg-gray-50">
        {/* Section gauche - liste d'offres */}
      /*  <div className="w-1/3 pr-4 space-y-4">
          <h1 className="text-xl font-bold mb-2">Emplois recommandés</h1>
          {jobList.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className={`cursor-pointer border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition ${
                selectedJob.id === job.id ? 'border-[#822BD1]' : ''
              }`}
            >
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p className="text-sm text-gray-700">{job.company}</p>
              <p className="text-sm text-gray-600">
                {job.city} • {job.contract}
              </p>
              <p className="text-sm text-gray-800 font-medium">{job.salary}</p>
            </div>
          ))}
        </div>

        {/* Section droite - détails de l'offre */}
        <div className="w-2/3 bg-white rounded-lg shadow p-6 border border-gray-200 space-y-4">
          {/* Titre du poste */}
          <h2 className="text-2xl font-bold">{selectedJob.title}</h2>

          {/* Entreprise */}
          <p className="text-lg text-gray-700 font-medium">{selectedJob.company}</p>

          {/* Ville • Salaire • Contrat */}
          <p className="text-gray-600">
            {selectedJob.city} • {selectedJob.salary} • {selectedJob.contract}
          </p>

          {/* Bouton Postuler */}
          <button className="px-6 py-2 bg-[#822BD1] font-bold cursor-pointer text-white rounded">
            Postuler maintenant
          </button>

          {/* Détails */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Détails de l'offre</h3>
            <p className="text-gray-700">{selectedJob.description}</p>
          </div>
        </div>
      </div>
       </div>
    </>
  );
}
