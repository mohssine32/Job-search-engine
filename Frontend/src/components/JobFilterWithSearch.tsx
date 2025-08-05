import { useState } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

interface Props {
  onFilterChange: (filters: {
    keyword: string;
    city: string;
    contract: string;
    salary: number;
  }) => void;
}

export default function JobFilterWithSearch({ onFilterChange }: Props) {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [contract, setContract] = useState('');
  const [salary, setSalary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      keyword,
      city,
      contract,
      salary: parseInt(salary) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4  h-[150px]">
      <div className='w-[1200px] mx-auto h-full'>
      {/* Barre principale de recherche */}
      <div className="flex items-center bg-white border-black border-1 rounded-md px-4 py-2 mt-[20px] mx-auto h-[65px] w-[800px] space-x-4 ">
        <FaSearch className="text-black" />
        <input
          type="text"
          placeholder="Mot-clé (ex: développeur)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 focus:outline-none text-sm"
        />
        <div className="border-l h-6" />
        <FaMapMarkerAlt className="text-black" />
        <input
          type="text"
          placeholder="Ville"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 focus:outline-none text-sm"
        />
        <button
          type="submit"
          className="bg-[#822BD1] text-white h-[40px] w-[120px] rounded-md  text-sm font-semibold"
        >
          Rechercher
        </button>
      </div>

      {/* Filtres secondaires */}
      <div className="flex flex-wrap gap-2   w-[800px] mx-auto mt-[20px] h-[41px]">
        {/* Type de contrat */}
        <select
          value={contract}
          onChange={(e) => setContract(e.target.value)}
          className="px-3 py-1 bg-gray-200 rounded-md text-sm border-black border-1"
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
  placeholder="Salaire min (€)"
  value={salary}
  onChange={(e) => setSalary(e.target.value)}
  className="px-3 py-1 bg-gray-200 rounded text-sm w-[140px] border-black border-1"
  style={{
    MozAppearance: 'textfield',
    WebkitAppearance: 'none',
    appearance: 'none',
  }}
/>
      </div>
      </div>
    </form>
  );
}