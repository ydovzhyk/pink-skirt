'use client';

import Logo from '../logo/logo';
import Text from '../text/text';

const quotes = [
  'Fashion should be as unique as you are.',
  'Elegance begins with simplicity.',
  'Wear confidence like your favorite outfit.',
  'Beauty is in the details.',
  'Style is a way to say who you are without speaking.',
  'You were born to stand out, not blend in.',
  'Dress how you want to be addressed.',
  'Chic isn’t just a look – it’s an attitude.',
  'Your outfit should make you feel unstoppable.',
  'Simplicity is the keynote of all true elegance.',
  'The right outfit can change your whole day.',
  'Confidence is the best accessory a woman can wear.',
  'Be your own kind of beautiful.',
  'In a world full of trends, remain classic.',
  'She believed she could, so she dressed like she would.',
];

const QuoteRow = () => (
  <div className="flex items-center whitespace-nowrap py-3 mb-[-40px]">
    {quotes.map((quote, index) => (
      <div key={index} className="flex items-center gap-3 min-w-max">
        <div className="mt-[-20px] ml-[-5px]">
          <Logo width={211} height={58} />
        </div>
        <Text
          type="normal"
          as="span"
          fontWeight="thin"
          className="text-[#4C4C4C]"
        >
          {quote}
        </Text>
      </div>
    ))}
  </div>
);

const MarqueeQuote = () => {
  return (
    <div className="w-full overflow-hidden relative py-3 h-[80px]">
      <div className="absolute top-0 left-0 flex animate-scroll-marquee">
        <QuoteRow />
        <QuoteRow />
      </div>
    </div>
  );
};

export default MarqueeQuote;
