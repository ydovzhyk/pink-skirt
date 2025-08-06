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
  color,
}) => {
  const typeClasses = {
    xxl: 'text-[30px] sm:text-[30px] md:text-[36px] lg:text-[48px]', // раніше: 3xl → 30px, 4xl → 36px, 5xl → 48px
    title: 'text-[20px] sm:text-[24px] md:text-[30px] lg:text-[36px]', // xl → 20px, 2xl → 24px, 3xl → 30px, 4xl → 36px
    normal: 'text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px]', // base → 16px, lg → 18px, xl → 20px, 2xl → 24px
    regular: 'text-[18px] sm:text-[16px] md:text-[18px] lg:text-[20px]', // спец: 18 → 16 → 18 → 20
    tiny: 'text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px]', // вручну оновлено
    small: 'text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]', // xs → 12px, sm → 14px, base → 16px, lg → 18px
    extraSmall: 'text-[12px]', // фіксований 12px
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
        color,
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
