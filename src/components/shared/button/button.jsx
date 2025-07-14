'use client';

import React from 'react';
import Text from '../text/text';
import Image from 'next/image';

const Button = ({
  text = '',
  type = 'submit',
  btnClass = 'btnDark',
  textColor = 'text-black',
  onClick,
  id = '',
  image = null,
  disabled = false,
  width = '150px',
}) => {
  const baseClasses =
    'flex items-center justify-center gap-2.5 hover-transition group h-[40px] md:w-[170px] px-[5px]';

  const btnDarkClasses = 'regular-border bg-white';
  const btnLightClasses = 'accent-border bg-[var(--accent)] text-white';
  const btnDisabledClasses =
    'bg-text-color border border-text-color text-main-color cursor-not-allowed';

  let buttonClasses = '';

  if (disabled) {
    buttonClasses = btnDisabledClasses;
  } else if (btnClass === 'btnDark') {
    buttonClasses = btnDarkClasses;
  } else if (btnClass === 'btnLight') {
    buttonClasses = btnLightClasses;
  }

  return (
    <button
      id={id}
      className={`${baseClasses} ${buttonClasses}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={{ width, borderRadius: '5px' }}
    >
      {image && (
        <Image
          src={image}
          alt="icon"
          width={20}
          height={20}
          className="w-5 h-5"
        />
      )}
      {text && (
        <Text
          type="small"
          as="span"
          fontWeight="normal"
          lineHeight="none"
          className={`${textColor} group-hover:font-bold mt-[1px]`}
        >
          {text}
        </Text>
      )}
    </button>
  );
};

export default Button;
