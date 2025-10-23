import React from 'react'
import { Search, Gift } from 'lucide-react'

const HeroSection: React.FC = () => {
  return (
    <div className="h-auto md:h-[600px] bg-[#F8D3E8] flex flex-col justify-center items-center px-4 py-12 md:py-0 border-black border-[1px]">
      
      {/* TITRE */}
      <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold text-black mb-6 text-center leading-tight">
        THE JOB IS <span className="text-[#822BD1]">YOUR</span>
      </h1>
      
      {/* SOUS-TITRE */}
      <p className="text-base sm:text-lg md:text-xl text-gray-800 mb-8 sm:mb-12 text-center px-2 sm:px-0">
        Plus de 72097 jobs vous attendent, trouvez celui fait pour vous.
      </p>
      
      {/* BARRE DE RECHERCHE */}
      <div className="flex flex-col sm:flex-row max-w-3xl w-full mb-8 sm:mb-16 shadow-2xl">
        <div className="relative flex-1 mb-4 sm:mb-0">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cherchez un job par intitulé de poste, mot-clé ou entreprise"
            className="w-full pl-12 pr-4 py-3 sm:py-4 text-gray-700 bg-white rounded-l-lg border-none outline-none focus:ring-2 focus:ring-yellow-600"
          />
        </div>
        <button className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-r-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2">
          <Search className="w-5 h-5" />
          Trouver un job
        </button>
      </div>
      
      {/* TEXTE OPPORTUNITÉS */}
      <p className="text-gray-800 mb-4 sm:mb-6 text-base sm:text-lg text-center px-2 sm:px-0">
        Votre profil intéresse des entreprises. Indiquez-leur votre disponibilité.
      </p>
      
      {/* BOUTON OPPORTUNITÉS */}
      <button className="flex items-center gap-2 sm:gap-3 bg-transparent border-2 border-gray-800 text-gray-800 px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-all font-medium">
        <Gift className="w-5 h-5" />
        Recevoir des opportunités
      </button>
      
    </div>
  )
}

export default HeroSection
