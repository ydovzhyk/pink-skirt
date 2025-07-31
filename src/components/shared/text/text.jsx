import clsx from 'clsx';
import { TranslatedText } from '@/utils/translating/translating';

const Text = ({
  type = 'normal',
  as: Tag = 'p',
  fontFamily = 'urbanist',
  fontWeight = 'normal',
  lineHeight = 'tight',
  children,
  className,
  noTranslate = false,
  textShadow = null, // 'black' | 'white' | null
}) => {
  const typeClasses = {
    xxl: 'text-3xl sm:text-3xl md:text-4xl lg:text-5xl',
    title: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
    normal: 'text-base sm:text-lg md:text-xl lg:text-2xl',
    regular: 'text-sm sm:text-base md:text-lg lg:text-xl',
    small: 'text-xs sm:text-sm md:text-base lg:text-lg',
    tiny: 'text-[16px]',
    extraSmall: 'text-[12px] sm:text-[12px] md:text-[12px] lg:text-[12px]',
  };

  const fontClasses = {
    josefin: 'font-josefin',
    maven: 'font-maven',
    oblik: 'font-oblik',
    fraunces: 'font-fraunces',
    urbanist: 'font-urbanist',
  };

  const fontWeightClasses = {
    thin: 'font-thin',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  };

  const lineHeightValues = {
    none: '1',
    tight: '1.2',
    snug: '1.3',
    normal: '1.5',
    relaxed: '1.6',
    loose: '1.7',
  };

  return (
    <Tag
      className={clsx(
        typeClasses[type],
        fontClasses[fontFamily],
        fontWeightClasses[fontWeight],
        className
      )}
      style={{
        lineHeight: lineHeightValues[lineHeight],
        ...(textShadow === 'black' && {
          textShadow: '2px 1px 1px rgba(0, 0, 0, 0.5)',
        }),
        ...(textShadow === 'white' && {
          textShadow: '2px 1px 2px rgba(255, 255, 255, 0.8)',
        }),
      }}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        noTranslate ? (
          children
        ) : (
          <TranslatedText text={String(children)} />
        )
      ) : (
        children
      )}
    </Tag>
  );
};

export default Text;
