import React from "react";

const JobFilterWithSearch = () => {
  return (
    <div className="w-full bg-white shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Barre de recherche principale */}
      <div className="flex flex-col md:flex-row w-full gap-4">
        <input
          type="text"
          placeholder="🔍 développeur web"
          className="w-full md:w-[300px] border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="📍 Ville"
          className="w-full md:w-[200px] border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Type de contrat */}
        <select
          className="w-full md:w-[200px] border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Type de contrat</option>
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="Stage">Stage</option>
          <option value="Alternance">Alternance</option>
        </select>

        {/* Salaire minimum */}
        <input
          type="number"
          placeholder="💶 Salaire min"
          className="w-full md:w-[150px] border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Bouton rechercher */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm transition">
          Rechercher
        </button>
      </div>
    </div>
  );
};

export default JobFilterWithSearch;