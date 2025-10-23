import React from 'react';
import pnblogo from '../assets/pnb.png';
import edflogo from '../assets/edf.png';
import doctoliblogo from '../assets/doctolib.png';
import paypallogo from '../assets/paypal.jpg';
import loreallogo from '../assets/loreal.png';
import safranlogo from '../assets/safran.jpg';
import societelogo from '../assets/societe.jpg';

interface Logo {
  id: number;
  name: string;
  src: string;
  alt: string;
}

const LogoCarousel: React.FC = () => {
  const logos: Logo[] = [
    { id: 1, name: 'BNP Paribas', src: pnblogo, alt: 'BNP Paribas' },
    { id: 2, name: 'Decathlon', src: edflogo, alt: 'Decathlon' },
    { id: 3, name: 'Deezer', src: doctoliblogo, alt: 'Deezer' },
    { id: 4, name: 'Doctolib', src: paypallogo, alt: 'Doctolib' },
    { id: 5, name: 'EDF', src: loreallogo, alt: 'EDF' },
    { id: 6, name: "L'Oréal", src: safranlogo, alt: "L'Oréal" },
    { id: 7, name: 'PayFit', src: societelogo, alt: 'PayFit' },
  ];

  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="relative w-full overflow-hidden bg-gray-100 py-8 md:py-16">
      {/* Dégradés sur les bords */}
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-gray-100 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-gray-100 to-transparent z-10 pointer-events-none"></div>

      {/* Carousel container */}
      <div className="relative flex items-center h-20 md:h-20 overflow-hidden">
        <div className="flex animate-scroll gap-4 md:gap-16">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="flex-shrink-0 flex items-center justify-center h-12 md:h-16 w-20 sm:w-24 md:w-40 opacity-90 transition-all duration-300 hover:opacity-100 hover:scale-105"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-full max-w-full object-contain transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LogoCarousel;
