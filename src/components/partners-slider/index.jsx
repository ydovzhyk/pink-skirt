'use client';

import Image from 'next/image';
import partner01 from '../../../public/images/brands/logo01-01.png';
import partner02 from '../../../public/images/brands/logo02-02.png';
import partner03 from '../../../public/images/brands/logo03-03.png';
import partner04 from '../../../public/images/brands/logo04-04.png';
import partner05 from '../../../public/images/brands/logo05-05.png';
import partner06 from '../../../public/images/brands/logo06-06.png';
import partner07 from '../../../public/images/brands/logo07-07.png';
import partner08 from '../../../public/images/brands/logo08-08.png';

const PartnersSlider = () => {
  const partners = [
    partner01,
    partner02,
    partner03,
    partner04,
    partner05,
    partner06,
    partner07,
    partner08,
  ];

  return (
    <div className="w-full overflow-hidden flex relative">
      <div className="flex items-center animate-scroll whitespace-nowrap">
        {partners.map((partner, index) => (
          <div
            key={index}
            className="min-w-[130px] md:min-w-[150px] lg:min-w-[210px] mx-[15px] flex items-center justify-center"
          >
            <Image
              src={partner}
              alt={`Partner ${index + 1}`}
              className="w-full h-auto object-contain"
            />
          </div>
        ))}
        {partners.map((partner, index) => (
          <div
            key={`duplicate-${index}`}
            className="min-w-[130px] md:min-w-[150px] lg:min-w-[210px] mx-[15px] flex items-center justify-center"
          >
            <Image
              src={partner}
              alt={`Partner duplicate ${index + 1}`}
              className="w-full h-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnersSlider;
