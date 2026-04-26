import React from "react";

const SimpleFooter = () => {
  return (
    <footer className="bg-gray-100 text-white py-6 px-4">
      <div className="max-w-[1280px] mx-auto text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <p className="text-sm md:text-base text-black">
            Created with <span className="text-red-500">❤️</span> by{" "}
            <span className="font-semibold text-black">Mohammed Mouhssine</span>
          </p>
          <span className="hidden sm:inline text-gray-500">•</span>
          <p className="text-sm md:text-base text-black">
            © {new Date().getFullYear()} Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;