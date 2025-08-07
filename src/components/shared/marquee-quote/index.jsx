'use client';

import { useSelector } from 'react-redux';
import { getScreenType } from '@/redux/technical/technical-selectors';
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

const QuoteRow = () => {
  const screenType = useSelector(getScreenType);

  const getLogoSize = screenType => {
    switch (screenType) {
      case 'isDesktop':
        return { width: 211, height: 58, marginTop: '-25px' };
      case 'isLaptop':
        return { width: 179, height: 49, marginTop: '-23px' };
      case 'isTablet':
        return { width: 152, height: 42, marginTop: '-21px' };
      case 'isMobile':
        return { width: 129, height: 36, marginTop: '-19px' };
      default:
        return { width: 211, height: 58, marginTop: '-25px' };
    }
  };

  const { width, height, marginTop } = getLogoSize(screenType);

  return (
    <div
      className="flex items-center whitespace-nowrap pt-5"
      style={{
        marginBottom:
          screenType === 'isDesktop'
            ? '-50px'
            : screenType === 'isLaptop'
              ? '-50px'
              : screenType === 'isTablet'
                ? '-85px'
                : '-85px',
      }}
    >
      {quotes.map((quote, index) => (
        <div key={index} className="flex items-center gap-3 min-w-max">
          <div style={{ marginTop }} className="ml-[5px]">
            <Logo width={width} height={height} />
          </div>
          <Text
            type={
              screenType === 'isDesktop'
                ? 'tiny'
                : screenType === 'isLaptop'
                  ? 'tiny'
                  : screenType === 'isTablet'
                    ? 'small'
                    : screenType === 'isMobile'
                      ? 'normal'
                      : 'tiny'
            }
            as="p"
            fontWeight="thin"
            lineHeight="snug"
            className="ext-[#4C4C4C]"
          >
            {quote}
          </Text>
        </div>
      ))}
    </div>
  );
};

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
