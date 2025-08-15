// 'use client';

// import { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useRouter } from 'next/navigation';
// import { getAllFabrics } from '@/redux/fabrics/fabrics-selectors';
// import Text from '../../shared/text/text';
// import { RiArrowGoBackFill } from 'react-icons/ri';
// import { getScreenType } from '@/redux/technical/technical-selectors';

// const FabricDetail = ({
//   id,
//   name,
//   shortDescription,
//   description,
//   price,
//   suggestedGarments,
//   imageUrls,
// }) => {
//   const allFabrics = useSelector(getAllFabrics);
//   const router = useRouter();
//   const screenType = useSelector(getScreenType);

//   const currentIndex = allFabrics.findIndex(item => item.id === id);
//   const hasPrevious = currentIndex > 0;
//   const hasNext = currentIndex < allFabrics.length - 1;

//   const handleNavigate = (fabricCategory, shortDescription, id) => {
//     const formattedTitle = (shortDescription || '')
//       .trim()
//       .toLowerCase()
//       .replace(/\s+/g, '-')
//       .replace(/[^a-z0-9-]/g, '')
//       .replace(/-+/g, '-');
//     const categorySlug = String(fabricCategory).trim().toLowerCase();
//     router.push(`/fabrics/${categorySlug}/${formattedTitle}/${id}`);
//   };

//   const handlePreviousItem = () => {
//     const previousFabric = allFabrics[currentIndex - 1];
//     if (previousFabric) {
//       handleNavigate(
//         previousFabric.name,
//         previousFabric.shortDescription,
//         previousFabric.id
//       );
//     }
//   };

//   const handleNextItem = () => {
//     const nextFabric = allFabrics[currentIndex + 1];
//     if (nextFabric) {
//       handleNavigate(
//         previousFabric.name,
//         previousFabric.shortDescription,
//         previousFabric.id
//       );
//     }
//   };

//   return (
//     <section
//       id="story-detail"
//       className="relative container py-12 lg:py-16 flex flex-col gap-10 lg:gap-12"
//     >
//       <button
//         onClick={() => router.back()}
//         className="absolute top-5 left-0 flex items-center gap-2 px-3 py-2 text-[var(--text-title)] hover:text-[var(--accent)] transition-colors duration-300"
//       >
//         <RiArrowGoBackFill className="w-5 h-5" />
//         <Text
//           type="small"
//           as="p"
//           fontWeight="light"
//           className="text-[var(--text-title)]"
//         >
//           Go back
//         </Text>
//       </button>

//       {screenType === 'isMobile' && (
//         <div className="text-center mt-[-20px]">
//           <Text
//             type="normal"
//             as="h2"
//             fontWeight="medium"
//             className="text-black mb-5"
//           >
//             {shortDescription}
//           </Text>
//         </div>
//       )}

//       <div className="grid gap-10 md:grid-cols-2 mt-[-10px]">


//       </div>

//       <div className="flex justify-between items-center">
//         <button
//           onClick={handlePreviousItem}
//           disabled={!hasPrevious}
//           className={`text-black border-b w-fit transition-colors duration-200 ${
//             hasPrevious
//               ? 'border-gray-400 hover:border-[var(--accent)]'
//               : 'border-gray-300 opacity-50 cursor-not-allowed'
//           }`}
//         >
//           <Text
//             type="extra-small"
//             as="p"
//             fontWeight="light"
//             className="text-black"
//           >
//             Previous item
//           </Text>
//         </button>
//         <button
//           onClick={handleNextItem}
//           disabled={!hasNext}
//           className={`text-black border-b w-fit transition-colors duration-200 ${
//             hasNext
//               ? 'border-gray-400 hover:border-[var(--accent)]'
//               : 'border-gray-300 opacity-50 cursor-not-allowed'
//           }`}
//         >
//           <Text
//             type="extra-small"
//             as="p"
//             fontWeight="light"
//             className="text-black"
//           >
//             Next item
//           </Text>
//         </button>
//       </div>
//     </section>
//   );
// };

// export default FabricDetail;

'use client';

import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Text from '../../shared/text/text';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { getAllFabrics } from '@/redux/fabrics/fabrics-selectors';
import { getScreenType } from '@/redux/technical/technical-selectors';

const GARMENT_ICONS_BASE = '/images/garments';
const formatPriceUAH = (v) => `₴${Number(v || 0).toFixed(2)} UAH`;
const norm = (s) => String(s || '').trim().toLowerCase();
const slugify = (s) =>
  String(s || '')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .trim().toLowerCase()
    .replace(/[^a-z0-9\-_\s]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const FabricDetail = ({
  id,
  name, // категорія
  shortDescription,
  description,
  price,
  suggestedGarments = [],
  imageUrls = [],
}) => {
  const router = useRouter();
  const screenType = useSelector(getScreenType);
  const allFabrics = useSelector(getAllFabrics);

  // зображення поточної тканини
  const images = useMemo(
    () => (Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : []),
    [imageUrls]
  );
  const [hoverMain, setHoverMain] = useState(false);
  const mainSrc = hoverMain && images[1] ? images[1] : (images[0] || '');

  // інші тканини цієї ж категорії
  const categoryKey = norm(name);
  const categoryFabrics = useMemo(
    () => allFabrics.filter((f) => norm(f?.name) === categoryKey),
    [allFabrics, categoryKey]
  );
  const activeInGroupIdx = categoryFabrics.findIndex((f) => f.id === id);
  const hasPrevious = activeInGroupIdx > 0;
  const hasNext = activeInGroupIdx >= 0 && activeInGroupIdx < categoryFabrics.length - 1;

  const goToFabric = (cat, title, fabricId) => {
    router.push(`/fabrics/${slugify(cat)}/${slugify(title)}/${fabricId}`);
  };

  const handlePreviousItem = () => {
    if (!hasPrevious) return;
    const prev = categoryFabrics[activeInGroupIdx - 1];
    if (prev) goToFabric(prev.name, prev.shortDescription, prev.id);
  };

  const handleNextItem = () => {
    if (!hasNext) return;
    const next = categoryFabrics[activeInGroupIdx + 1];
    if (next) goToFabric(next.name, next.shortDescription, next.id);
  };

  return (
    <section
      id="fabric-detail"
      className="relative container py-12 lg:py-16 flex flex-col gap-10 lg:gap-12"
    >
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="absolute top-5 left-0 flex items-center gap-2 px-3 py-2 text-[var(--text-title)] hover:text-[var(--accent)] transition-colors duration-300"
      >
        <RiArrowGoBackFill className="w-5 h-5" />
        <Text type="small" as="p" fontWeight="light" className="text-[var(--text-title)]">
          Go back
        </Text>
      </button>

      {/* Title (mobile) */}
      {screenType === 'isMobile' && (
        <div className="text-center mt-[-20px]">
          <Text type="normal" as="h2" fontWeight="medium" className="text-black mb-5">
            {shortDescription}
          </Text>
        </div>
      )}

      <div className="grid gap-10 md:grid-cols-2 mt-[-10px]">
        {/* LEFT: головне фото (на hover показує друге) */}
        <div className="w-full">
          <div
            className="aspect-square w-full overflow-hidden rounded-md border border-gray-300 bg-white"
            onMouseEnter={() => setHoverMain(true)}
            onMouseLeave={() => setHoverMain(false)}
          >
            {mainSrc ? (
              <img
                src={mainSrc}
                alt={shortDescription || 'fabric'}
                className="w-full h-full object-cover transition-opacity duration-200"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: заголовок/ціна/опис + грід інших тканин категорії */}
        <div className="flex flex-col gap-6">
          {screenType !== 'isMobile' && (
            <Text type="normal" as="h2" fontWeight="medium" className="text-black">
              {shortDescription}
            </Text>
          )}

          <Text type="tiny" as="p" fontWeight="light" className="text-[var(--accent)]">
            {formatPriceUAH(price)} / half-metre
          </Text>

          {/* Грід інших тканин цієї категорії */}
          {categoryFabrics.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {categoryFabrics.map((f) => {
                const thumb = (f.imageUrls || []).filter(Boolean)[0];
                const isActive = f.id === id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => goToFabric(f.name, f.shortDescription, f.id)}
                    className={`text-left rounded-md overflow-hidden border bg-white transition-all duration-200 ${
                      isActive
                        ? 'border-[var(--text-title)] ring-1 ring-[var(--text-title)]'
                        : 'border-gray-300 hover:border-[var(--accent)]'
                    }`}
                    aria-label={f.shortDescription}
                    title={f.shortDescription}
                  >
                    <div className="w-full h-[86px]">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={f.shortDescription || 'fabric option'}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          —
                        </div>
                      )}
                    </div>
                    <div className="px-2 py-1">
                      <Text
                        type="extraSmall"
                        as="p"
                        fontWeight="light"
                        className="text-[var(--text-title)] line-clamp-2"
                      >
                        {f.shortDescription || f.name}
                      </Text>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Опис */}
          {description && (
            <div className="leading-relaxed text-[var(--text-title)] mt-2">
              {description}
            </div>
          )}

          {/* Suggested Garments */}
          {Array.isArray(suggestedGarments) && suggestedGarments.length > 0 && (
            <div className="mt-2">
              <Text type="tiny" as="p" fontWeight="light" className="text-[var(--text-title)] mb-2">
                SUGGESTED GARMENTS
              </Text>
              <div className="flex flex-wrap items-center gap-3">
                {suggestedGarments.map((key) => (
                  <div
                    key={key}
                    className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 bg-white"
                    title={key}
                  >
                    <img
                      src={`${GARMENT_ICONS_BASE}/${key}.png`}
                      alt={key}
                      className="max-w-[22px] max-h-[22px] object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prev / Next в межах категорії */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousItem}
          disabled={!hasPrevious}
          className={`text-black border-b w-fit transition-colors duration-200 ${
            hasPrevious
              ? 'border-gray-400 hover:border-[var(--accent)]'
              : 'border-gray-300 opacity-50 cursor-not-allowed'
          }`}
        >
          <Text type="extra-small" as="p" fontWeight="light" className="text-black">
            Previous item
          </Text>
        </button>

        <button
          onClick={handleNextItem}
          disabled={!hasNext}
          className={`text-black border-b w-fit transition-colors duration-200 ${
            hasNext
              ? 'border-gray-400 hover:border-[var(--accent)]'
              : 'border-gray-300 opacity-50 cursor-not-allowed'
          }`}
        >
          <Text type="extra-small" as="p" fontWeight="light" className="text-black">
            Next item
          </Text>
        </button>
      </div>
    </section>
  );
}


export default FabricDetail;
