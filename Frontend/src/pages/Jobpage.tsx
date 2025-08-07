/*import { useState } from 'react';
import JobFilterWithSearch from '../components/JobFilterWithSearch';
import Navbar from '../components/Navbar';



const jobList = [
  {
    id: 1,
    title: 'Développeur Web en alternance (H/F)',
    salary: 'Non précisé',
    contract: 'Alternance',
    city: 'Fontenay-sous-Bois',
    date: '03 août 2025',
    description: 'Rejoignez notre équipe pour développer des projets web innovants. Travail du lundi au vendredi. Prise en charge du transport.',
  },
  {
    id: 2,
    title: 'Développeur fullstack Java/React (IT) / Freelance',
    salary: '400 € - 550 € / jour',
    contract: 'Freelance',
    city: 'Paris (75)',
    date: '02 août 2025',
    description: 'Mission en freelance pour un projet Java/React. Expérience exigée.',
  },
  {
    id: 2,
    title: 'Développeur fullstack Java/React (IT) / Freelance',
    salary: '400 € - 550 € / jour',
    contract: 'Freelance',
    city: 'Paris (75)',
    date: '02 août 2025',
    description: 'Mission en freelance pour un projet Java/React. Expérience exigée.',
  },
  {
    id: 2,
    title: 'Développeur fullstack Java/React (IT) / Freelance',
    salary: '400 € - 550 € / jour',
    contract: 'Freelance',
    city: 'Paris (75)',
    date: '02 août 2025',
    description: 'Mission en freelance pour un projet Java/React. Expérience exigée Mission en freelance pour un projet Java/React. Expérience exigée Mission en freelance pour un projet Java/React. Expérience exigée.',
  },
  {
    id: 2,
    title: 'Développeur fullstack Java/React (IT) / Freelance',
    salary: '400 € - 550 € / jour',
    contract: 'Freelance',
    city: 'Paris (75)',
    date: '02 août 2025',
    description: 'Mission en freelance pour un projet Java/React. Expérience exigée.',
  },
  
];



export default function JobPage() {
  const [selectedJob, setSelectedJob] = useState(jobList[0]);

  



  return (
    <>
    <Navbar />
   
   <JobFilterWithSearch />
    <div className="min-h-screen flex  p-4 w-[1200px] mx-auto ">
        
      {/* Section gauche - liste d'offres *//*}
      <div className="w-1/3 pr-4 space-y-4">
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
            <p className="text-sm text-gray-600">{job.contract} • {job.city}</p>
            <p className="text-sm text-gray-800 font-medium">{job.salary}</p>
          </div>
        ))}
      </div>

      {/* Section droite - détails de l'offre *//*}
      <div className="w-2/3 bg-white rounded-lg shadow p-6 border-1 border-black">
        <h2 className="text-2xl font-bold mb-2">{selectedJob.title}</h2>
        <p className="text-gray-500 mb-1">{selectedJob.date}</p>
        <p className="mb-4 text-gray-700">{selectedJob.description}</p>

        <div className="mb-4 space-y-1">
          <p><strong>Type de contrat :</strong> {selectedJob.contract}</p>
          <p><strong>Ville :</strong> {selectedJob.city}</p>
          <p><strong>Salaire :</strong> {selectedJob.salary}</p>
        </div>

        <button className="px-6 py-2 bg-[#822BD1] text-white rounded ">
          Postuler maintenant
        </button>
      </div>
    </div>
    </>
  );
}
*/

import { useState } from 'react';
import JobFilterWithSearch from '../components/JobFilterWithSearch';
import Navbar from '../components/Navbar';

const jobList = [
  {
    id: 1,
    title: 'Développeur React JS (H/F)',
    company: 'CITECH',
    salary: 'De 40000 € à 55000 € par an',
    contract: 'CDI',
    city: 'Paris (75)',
    date: '03 août 2025',
    description:
      'Vous intégrerez une équipe Agile sur un projet React. Collaboration étroite avec les équipes produit et UX.',
  },
  {
    id: 2,
    title: 'Développeur.se Web Junior.e / Confirmé.e',
    company: 'Angie',
    salary: 'Non précisé',
    contract: 'Stage',
    city: '75002 Paris',
    date: '02 août 2025',
    description:
      'Participation au développement de projets web innovants pour de grands comptes.',
  },
  {
    id: 3,
    title: 'Développeur fullstack Python / React',
    company: 'VISIAN',
    salary: '4000 € / mois',
    contract: 'CDI',
    city: 'La Défense (92)',
    date: '01 août 2025',
    description:
      'Vous développerez des plateformes web avec Python (Django) côté backend et React côté frontend.',
  },
];

export default function JobPage() {
  const [selectedJob, setSelectedJob] = useState(jobList[0]);

  return (
    <>
      <Navbar />
      <JobFilterWithSearch />

      <div className="min-h-screen flex p-4 w-[1200px] mx-auto">
        {/* Section gauche - liste d'offres */}
        <div className="w-1/3 pr-4 space-y-4">
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
    </>
  );
}
