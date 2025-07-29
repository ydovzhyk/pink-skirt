'use client';

import Text from '@/components/shared/text/text';

const TextareaField = ({ label, name, register, required }) => (
  <div className="flex flex-col gap-2">
    <label>
      <Text
        type="tiny"
        as="p"
        fontWeight="light"
        className="text-[var(--text-title)]"
      >
        {label}
      </Text>
    </label>
    <textarea
      {...register(name, { required })}
      className="bg-white w-full rounded-md border-2 border-gray-300 outline-none focus:border-[var(--accent)] focus:ring-[var(--accent)] px-3 py-2 text-[var(--text-title)]"
      rows="4"
      maxLength="1000"
      required={required}
    />
  </div>
);

export default TextareaField;
