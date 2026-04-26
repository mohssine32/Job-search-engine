import React from "react";

const JobStatsSection = () => {
  return (
    <section className="px-4 md:px-6 py-12 bg-white text-black max-w-[1280px] mx-auto">
      <h2 className="text-4xl font-light mt-[60px]">
        Préparez-vous à <br />
        <span className="font-bold">décrocher votre job !</span>
      </h2>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Bloc 1 */}
        <div className="bg-blue-100 rounded-md p-6">
          <h3 className="text-3xl font-semibold">155 000</h3>
          <p className="mt-4 text-sm">
            CV lus en moyenne chaque jour,
            <span className="font-semibold"> soyez le prochain à être vu !</span>
          </p>
        </div>

        {/* Bloc 2 */}
        <div className="bg-blue-300 rounded-md p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-md font-bold leading-snug">
              SOYEZ VISIBLE <br /> AUPRÈS DES RECRUTEURS
            </h4>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2991/2991108.png"
                alt="CV Icon"
                className="w-6 h-6"
              />
            </div>
            <button className="bg-black text-white py-2 px-4 rounded-full text-sm">
              Déposer mon CV
            </button>
          </div>
        </div>

        {/* Bloc 3 */}
        <div className="bg-orange-50 rounded-md p-6">
          <h3 className="text-3xl font-semibold">909 554</h3>
          <p className="mt-4 text-sm">
            offres en ce moment,
            <span className="font-semibold">
              {" "}
              on vous envoie celles qui collent ?
            </span>
          </p>
        </div>

        {/* Bloc 4 */}
        <div className="bg-purple-500 rounded-md p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-md font-bold leading-snug">
              SOYEZ ALERTÉ <br /> RAPIDEMENT
            </h4>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1827/1827301.png"
                alt="Alert Icon"
                className="w-6 h-6"
              />
            </div>
            <button className="bg-black text-white py-2 px-4 rounded-full text-sm">
              Créer mon alerte
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobStatsSection;
