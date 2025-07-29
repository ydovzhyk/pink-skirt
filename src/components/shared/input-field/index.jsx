'use client';

import Text from '@/components/shared/text/text';

const InputField = ({
  label,
  name,
  register,
  type = 'text',
  defaultValue,
  required,
}) => (
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
    <input
      {...register(name, { required })}
      className="bg-white w-full rounded-md border-2 border-gray-300 outline-none focus:border-[var(--accent)] focus:ring-[var(--accent)] px-3 py-2 text-[var(--text-title)]"
      type={type}
      defaultValue={defaultValue}
      required={required}
    />
  </div>
);

export default InputField;
