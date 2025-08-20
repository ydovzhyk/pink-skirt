'use client';

import Text from '@/components/shared/text/text';

const getRuleValue = rule =>
  typeof rule === 'object' && rule !== null ? rule.value : rule;

const InputField = ({
  label,
  name,
  register,
  type = 'text',
  defaultValue,
  required,
  validation = {},
  error,
  inputProps = {},
}) => {
  const isRequired =
    typeof required === 'object' ? !!required.value : !!required;

  const minL = getRuleValue(validation.minLength);
  const maxL = getRuleValue(validation.maxLength);

  const rules = {
    ...(required ? { required } : {}),
    ...validation,
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={name}>
          <Text
            type="tiny"
            as="p"
            fontWeight="light"
            className="text-[var(--text-title)]"
          >
            {label}
          </Text>
        </label>
      )}

      <input
        id={name}
        {...register(name, rules)}
        className="bg-white w-full rounded-md border-2 border-gray-300 outline-none focus:border-[var(--accent)] focus:ring-[var(--accent)] px-3 py-2 text-[var(--text-title)]"
        type={type}
        defaultValue={defaultValue}
        required={isRequired}
        minLength={typeof minL === 'number' ? minL : undefined}
        maxLength={typeof maxL === 'number' ? maxL : undefined}
        aria-invalid={!!error || undefined}
        {...inputProps}
      />
    </div>
  );
};

export default InputField;
