'use client';

import { useSelector } from 'react-redux';
import { getScreenType } from '@/redux/technical/technical-selectors';
import VerticalSlider from './vertical';
import HorizontalSlider from './horizontal';

const ResponsiveSlider = ({ images, desktopSize, mobileSize, ...props }) => {
  const screenType = useSelector(getScreenType);
  const isMobile = screenType === 'isMobile';

  const { width, height } = isMobile ? mobileSize : desktopSize;
  const SliderComponent = isMobile ? HorizontalSlider : VerticalSlider;

  return (
    <SliderComponent images={images} width={width} height={height} {...props} />
  );
};

export default ResponsiveSlider;
