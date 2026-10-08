const openDays = [
  'https://schema.org/Sunday',
  'https://schema.org/Monday',
  'https://schema.org/Tuesday',
  'https://schema.org/Wednesday',
  'https://schema.org/Thursday',
];

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://pinkskirt.uk/#atelier',
  name: 'Pink Skirt',
  description:
    'Bespoke women’s clothing atelier in Cambridge. Clothing repairs from £15 and made-to-measure garments from £150.',
  url: 'https://pinkskirt.uk',
  image: 'https://pinkskirt.uk/og-image.png',
  telephone: '+447748068828',
  email: 'pinkskirt.atelier@gmail.com',
  priceRange: '££',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Brooklands Ave',
    addressLocality: 'Cambridge',
    postalCode: 'CB2 8DG',
    addressCountry: 'GB',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 52.19155,
    longitude: 0.1282208,
  },
  hasMap: 'https://maps.app.goo.gl/v3SjQJRuz45qsr957',
  sameAs: [
    'https://www.instagram.com/pinkskirt.uk/',
    'https://maps.app.goo.gl/v3SjQJRuz45qsr957',
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: openDays,
      opens: '10:00',
      closes: '20:00',
    },
  ],
  makesOffer: [
    {
      '@type': 'Offer',
      name: 'Clothing repair',
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: 15,
        priceCurrency: 'GBP',
      },
    },
    {
      '@type': 'Offer',
      name: 'Bespoke garment',
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: 150,
        priceCurrency: 'GBP',
      },
    },
  ],
};
