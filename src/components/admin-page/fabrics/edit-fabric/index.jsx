'use client';

import { useRef, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Text from '@/components/shared/text/text';
import InputField from '@/components/shared/input-field';
import FileUpload from '@/components/shared/file-upload';
import SelectField from '@/components/shared/select-field/select-field';
import TextareaField from '@/components/shared/textarea-field';
import { toast } from 'react-toastify';
import { getEditFabric } from '@/redux/fabrics/fabrics-selectors';
import { editFabric, getFabrics } from '@/redux/fabrics/fabrics-operations';
import { clearEditFabric } from '@/redux/fabrics/fabrics-slice';
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

const EditFabric = () => {
  const dispatch = useDispatch();
  const fabricData = useSelector(getEditFabric);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fabricType: null,
      shortDescription: '',
      description: '',
      color: '',
      price: '',
      suggestedGarments: [],
    },
    mode: 'onChange',
  });

  const mainImageRef = useRef(null);
  const secondaryImageRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (fabricData) {
      reset({
        fabricType: fabricTypes.find(t => t.value === fabricData.name) || null,
        shortDescription: fabricData.shortDescription || '',
        description: fabricData.description || '',
        color: fabricData.color || '',
        price: fabricData.price ?? '',
        suggestedGarments: fabricData.suggestedGarments || [],
      });
    }
  }, [fabricData, reset]);

  const onSubmit = async data => {
    clearErrors('root');
    const mainImageFile = mainImageRef.current?.files?.[0];
    const secondaryImageFile = secondaryImageRef.current?.files?.[0];
    const allFiles = [mainImageFile, secondaryImageFile].filter(Boolean);

    if (allFiles.some(file => file.size > MAX_IMAGE_SIZE)) {
      setError('root', {
        type: 'manual',
        message: 'Each image must be smaller than 500KB',
      });
      return;
    }

    const formData = new FormData();
    formData.append('folderName', 'fabrics');
    formData.append('fabricId', fabricData.id);
    allFiles.forEach(file => formData.append('images', file));
    if (mainImageFile?.name)
      formData.append('mainFileName', mainImageFile.name);

    try {
      setIsLoading(true);

      let uploadData = {};
      if (allFiles.length > 0) {
        const uploadRes = await fetch('/api/upload-images', {
          method: 'POST',
          body: formData,
        });
        uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error);
      }

      const updatedFabric = {
        id: fabricData.id,
        name: data.fabricType.value,
        shortDescription: data.shortDescription,
        description: data.description,
        color: data.color || '',
        price: Number(data.price) || 0,
        suggestedGarments: data.suggestedGarments,
        imageUrls: [
          uploadData.mainImageUrl || fabricData.imageUrls[0],
          uploadData.additionalImageUrls?.[0] || fabricData.imageUrls[1],
        ],
        variations: fabricData.variations || [],
      };

      await dispatch(editFabric(updatedFabric)).unwrap();
      await dispatch(getFabrics()).unwrap();
      dispatch(clearEditFabric());

      setTimeout(() => {
        document
          .getElementById('admin-fabrics')
          ?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      reset({
        fabricType: null,
        shortDescription: '',
        description: '',
        color: '',
        price: '',
        suggestedGarments: [],
      });
      if (mainImageRef.current) mainImageRef.current.value = '';
      if (secondaryImageRef.current) secondaryImageRef.current.value = '';
    } catch (err) {
      console.error(err);
      setError('root', { type: 'manual', message: 'Failed to update fabric' });
      toast.error('Failed to update fabric');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="edit-fabric" className="container mb-12 lg:my-16">
      <div className="w-full rounded-md border border-[#464c6a] p-3 lg:p-5 bg-white">
        <Text
          type="normal"
          as="p"
          fontWeight="normal"
          className="text-black mb-5"
        >
          Edit Fabric
        </Text>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                options={fabricTypes}
                width="100%"
                topPlaceholder={false}
                textColor="black"
                textAlign="left"
              />
            )}
          />
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
            id="mainImage-edit"
            inputRef={mainImageRef}
            single
          />
          <FileUpload
            label="Upload Secondary Image (≤ 500KB):"
            id="secondaryImage-edit"
            inputRef={secondaryImageRef}
            single
          />

          {errors.root?.message && (
            <FormErrorMessage message={errors.root.message} />
          )}

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
                  {isLoading ? 'Updating...' : 'Update Fabric'}
                </Text>
              </div>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditFabric;
