'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import Text from '@/components/shared/text/text';
import InputField from '@/components/shared/input-field';
import FileUpload from '@/components/shared/file-upload';
import SelectField from '@/components/shared/select-field/select-field';
import TextareaField from '@/components/shared/textarea-field';
import { toast } from 'react-toastify';
import { createFabric, getFabrics } from '@/redux/fabrics/fabrics-operations';
import SuggestedGarmentsField from '@/components/shared/suggested-garments-field';
import { SUGGESTED_GARMENTS } from '@/components/shared/suggested-garments-field';
import FormErrorMessage from '@/components/shared/form-error-message';

const MAX_IMAGE_SIZE = 500 * 1024;

const fabricTypes = [
  {
    label: (
      <Text type="tiny" as="span">
        Cotton
      </Text>
    ),
    value: 'Cotton',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Linen
      </Text>
    ),
    value: 'Linen',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Wool
      </Text>
    ),
    value: 'Wool',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Silk
      </Text>
    ),
    value: 'Silk',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Viscose
      </Text>
    ),
    value: 'Viscose',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Polyester
      </Text>
    ),
    value: 'Polyester',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Cashmere
      </Text>
    ),
    value: 'Cashmere',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Denim (Jeans)
      </Text>
    ),
    value: 'Denim',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Velvet
      </Text>
    ),
    value: 'Velvet',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Chiffon
      </Text>
    ),
    value: 'Chiffon',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Organza
      </Text>
    ),
    value: 'Organza',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Tulle
      </Text>
    ),
    value: 'Tulle',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Tweed
      </Text>
    ),
    value: 'Tweed',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Jersey
      </Text>
    ),
    value: 'Jersey',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Satin
      </Text>
    ),
    value: 'Satin',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Crepe
      </Text>
    ),
    value: 'Crepe',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Modal
      </Text>
    ),
    value: 'Modal',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Rayon
      </Text>
    ),
    value: 'Rayon',
  },
  {
    label: (
      <Text type="tiny" as="span">
        Neoprene
      </Text>
    ),
    value: 'Neoprene',
  },
];

const AddFabric = () => {
  const dispatch = useDispatch();
  const mainImageRef = useRef(null);
  const secondaryImageRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      fabricType: null,
      shortDescription: '',
      description: '',
      color: '',
      price: '',
      suggestedGarments: [],
      mainImage: null,
      secondaryImage: null,
    },
  });

  useEffect(() => {
    const mainEl = document.getElementById('mainImage');
    const secEl = document.getElementById('secondaryImage');

    const onMain = e => {
      const f = e.target.files?.[0] || null;
      setValue('mainImage', f, { shouldValidate: true });
    };
    const onSec = e => {
      const f = e.target.files?.[0] || null;
      setValue('secondaryImage', f, { shouldValidate: true });
    };

    mainEl?.addEventListener('change', onMain);
    secEl?.addEventListener('change', onSec);
    return () => {
      mainEl?.removeEventListener('change', onMain);
      secEl?.removeEventListener('change', onSec);
    };
  }, [setValue]);

  const onSubmit = async data => {
    try {
      const fabricId = uuidv4();

      const mainImageFile = data.mainImage;
      const secondaryImageFile = data.secondaryImage;

      if (!mainImageFile || !secondaryImageFile) {
        return;
      }
      if (
        mainImageFile.size > MAX_IMAGE_SIZE ||
        secondaryImageFile.size > MAX_IMAGE_SIZE
      ) {
        return;
      }
      if (!data.suggestedGarments || data.suggestedGarments.length === 0) {
        toast.error('Please select at least one suggested garment');
        return;
      }

      const formData = new FormData();
      formData.append('folderName', 'fabrics');
      formData.append('fabricId', fabricId);
      formData.append('images', mainImageFile);
      formData.append('images', secondaryImageFile);
      formData.append('mainFileName', mainImageFile.name);

      setIsLoading(true);

      const uploadRes = await fetch('/api/upload-images', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData?.error || 'Upload failed');

      const fabricData = {
        id: fabricId,
        name: data.fabricType.value,
        shortDescription: data.shortDescription,
        description: data.description,
        color: data.color || '',
        price: Number(data.price) || 0,
        suggestedGarments: data.suggestedGarments,
        imageUrls: [
          uploadData.mainImageUrl,
          uploadData.additionalImageUrls?.[0] || '',
        ],
        variations: [],
      };

      await dispatch(createFabric(fabricData)).unwrap();
      await dispatch(getFabrics()).unwrap();

      reset();
      if (mainImageRef.current) mainImageRef.current.value = '';
      if (secondaryImageRef.current) secondaryImageRef.current.value = '';
    } catch (err) {
      console.error(err);
      toast.error('Failed to create fabric');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container my-12 lg:my-16">
      <div className="w-full rounded-md border border-[#464c6a] p-3 lg:p-5 bg-white">
        <Text
          type="normal"
          as="p"
          fontWeight="normal"
          className="text-black mb-5"
        >
          Add Fabric
        </Text>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="w-full flex flex-row align-center justify-center">
            <Controller
              name="fabricType"
              control={control}
              rules={{ required: 'Please select a fabric type' }}
              render={({ field }) => (
                <SelectField
                  name="fabricType"
                  value={field.value}
                  handleChange={field.onChange}
                  placeholder="Fabric Name"
                  required
                  options={fabricTypes}
                  width="100%"
                  topPlaceholder={false}
                  textColor="black"
                  textAlign="left"
                />
              )}
            />
          </div>
          {errors.fabricType && (
            <FormErrorMessage message={errors.fabricType?.message} />
          )}

          <InputField
            label="Short Description:"
            name="shortDescription"
            register={register}
            required={{ value: true, message: 'Short description is required' }}
            validation={{
              minLength: { value: 2, message: 'At least 2 characters' },
            }}
          />
          {errors.shortDescription && (
            <FormErrorMessage message={errors.shortDescription?.message} />
          )}

          <TextareaField
            label="Description:"
            name="description"
            register={register}
            required={{ value: true, message: 'Description is required' }}
          />
          {errors.description && (
            <FormErrorMessage message={errors.description?.message} />
          )}

          <InputField
            label="Color:"
            name="color"
            register={register}
            required={{ value: true, message: 'Color is required' }}
          />
          {errors.color && <FormErrorMessage message={errors.color?.message} />}

          <InputField
            label="Price (half-metre):"
            name="price"
            register={register}
            required={{ value: true, message: 'Price is required' }}
          />
          {errors.price && <FormErrorMessage message={errors.price?.message} />}

          <SuggestedGarmentsField
            label="Suggested Garments"
            name="suggestedGarments"
            options={SUGGESTED_GARMENTS}
            register={register}
            rules={{
              validate: vals =>
                (Array.isArray(vals) && vals.length > 0) ||
                'Please select at least one suggested garment',
            }}
            error={errors.suggestedGarments?.message}
          />

          <FileUpload
            label="Upload Main Image (≤ 500KB):"
            id="mainImage"
            inputRef={mainImageRef}
            single
          />

          <FileUpload
            label="Upload Secondary Image (≤ 500KB):"
            id="secondaryImage"
            inputRef={secondaryImageRef}
            single
          />

          <input
            type="hidden"
            {...register('mainImage', {
              validate: f => {
                if (!f) return 'Main image is required';
                if (f.size > MAX_IMAGE_SIZE)
                  return 'Main image must be ≤ 500KB';
                return true;
              },
            })}
          />

          <input
            type="hidden"
            {...register('secondaryImage', {
              validate: f => {
                if (!f) return 'Secondary image is required';
                if (f.size > MAX_IMAGE_SIZE)
                  return 'Secondary image must be ≤ 500KB';
                return true;
              },
            })}
          />

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="group"
              disabled={isLoading || isSubmitting}
            >
              <div
                style={{ borderWidth: '0.5px' }}
                className="w-fit flex items-center justify-center gap-1 group-hover:gap-3 px-6 py-3 md:px-8 md:py-4 rounded-md border-gray-400 transition-all duration-300 ease-out bg-transparent group-hover:bg-[#F8F1F1] group-hover:border-[#F8F1F1] group-hover:shadow-md btn-shine uppercase"
              >
                <Text
                  type="small"
                  as="span"
                  fontWeight="light"
                  className="text-[var(--text-title)]"
                >
                  {isLoading ? 'Submitting...' : 'Submit Fabric'}
                </Text>
              </div>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddFabric;
