'use client';

import Text from '@/components/shared/text/text';

export default function SuggestedGarmentsField({
  label = 'Suggested Garments',
  name,
  options,
  register,
  required = false,
  error,
}) {
  return (
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

      <div
        role="group"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2"
      >
        {options.map(opt => {
          const id = `${name}-${opt.value}`;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className="flex items-center gap-2 rounded-md border-2 border-gray-300 bg-white px-3 py-2 hover:border-[var(--accent)] cursor-pointer"
            >
              <input
                id={id}
                type="checkbox"
                value={opt.value}
                {...register(name, { required })}
                className="h-4 w-4"
              />
              <span className="text-[var(--text-title)] text-sm">
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>

      {error ? <p className="text-xs text-red-500 mt-1">{error}</p> : null}
    </div>
  );
}

export const SUGGESTED_GARMENTS = [
  {
    value: 'raincoat',
    label: (
      <Text type="extraSmall" as="span">
        Raincoat
      </Text>
    ),
  },
  {
    value: 'bikini',
    label: (
      <Text type="extraSmall" as="span">
        Bikini
      </Text>
    ),
  },
  {
    value: 'sweater',
    label: (
      <Text type="extraSmall" as="span">
        Sweater
      </Text>
    ),
  },
  {
    value: 'overcoat',
    label: (
      <Text type="extraSmall" as="span">
        Overcoat
      </Text>
    ),
  },
  {
    value: 'jacket',
    label: (
      <Text type="extraSmall" as="span">
        Jacket
      </Text>
    ),
  },
  {
    value: 'shirt',
    label: (
      <Text type="extraSmall" as="span">
        Shirt
      </Text>
    ),
  },
  {
    value: 'blazer',
    label: (
      <Text type="extraSmall" as="span">
        Blazer
      </Text>
    ),
  },
  {
    value: 'trouser',
    label: (
      <Text type="extraSmall" as="span">
        Trousers
      </Text>
    ),
  },
  {
    value: 'corset',
    label: (
      <Text type="extraSmall" as="span">
        Corset
      </Text>
    ),
  },
  {
    value: 'skirt',
    label: (
      <Text type="extraSmall" as="span">
        Skirt
      </Text>
    ),
  },
  {
    value: 'blouse',
    label: (
      <Text type="extraSmall" as="span">
        Blouse
      </Text>
    ),
  },
  {
    value: 'dress',
    label: (
      <Text type="extraSmall" as="span">
        Dress
      </Text>
    ),
  },
  {
    value: 'pyjama',
    label: (
      <Text type="extraSmall" as="span">
        Pyjama
      </Text>
    ),
  },
  {
    value: 'cardigan',
    label: (
      <Text type="extraSmall" as="span">
        Cardigan
      </Text>
    ),
  },
  {
    value: 'turtleneck',
    label: (
      <Text type="extraSmall" as="span">
        Turtleneck
      </Text>
    ),
  },
  {
    value: 'undershirt',
    label: (
      <Text type="extraSmall" as="span">
        Undershirt
      </Text>
    ),
  },
  {
    value: 'thin',
    label: (
      <Text type="extraSmall" as="span">
        Thin layer
      </Text>
    ),
  },
  {
    value: 'overalls',
    label: (
      <Text type="extraSmall" as="span">
        Overalls
      </Text>
    ),
  },
  {
    value: 'shorts',
    label: (
      <Text type="extraSmall" as="span">
        Shorts
      </Text>
    ),
  },
  {
    value: 'underwear',
    label: (
      <Text type="extraSmall" as="span">
        Underwear
      </Text>
    ),
  },
];
