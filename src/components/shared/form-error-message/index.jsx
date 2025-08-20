'use client';

import Text from '../text/text';

const FormErrorMessage = ({ message, id }) => {
  if (!message) return null;
  return (
    <div id={id} role="alert" aria-live="polite" className="w-full flex flex-row items-center justify-start">
      <Text
        type="extraSmall"
        as="p"
        fontWeight="light"
        className="text-red-600"
      >
        {message}
      </Text>
    </div>
  );
};

export default FormErrorMessage;
