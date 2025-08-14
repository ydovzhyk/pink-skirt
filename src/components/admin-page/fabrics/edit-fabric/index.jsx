'use client';

import { useRef, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Text from '@/components/shared/text/text';
import InputField from '@/components/shared/input-field';
import FileUpload from '@/components/shared/file-upload';
import SelectField from '@/components/shared/select-field/select-field';
import { toast } from 'react-toastify';
import { getEditFabric } from '@/redux/fabrics/fabrics-selectors';
import { editFabric, getFabrics } from '@/redux/fabrics/fabrics-operations';
import { clearEditFabric } from '@/redux/fabrics/fabrics-slice';

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
  const { register, handleSubmit, reset, control } = useForm();
  const fabricData = useSelector(getEditFabric);
  const mainImageRef = useRef(null);
  const secondaryImageRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (fabricData) {
      reset({
        fabricType:
          fabricTypes.find(type => type.value === fabricData.name) || null,
        description: fabricData.description || '',
      });
    }
  }, [fabricData, reset]);

  const onSubmit = async data => {
    if (!data.fabricType) {
      setError('Please select a fabric type');
      return;
    }

    const formData = new FormData();
    formData.append('folderName', 'fabrics');
    formData.append('fabricId', fabricData.id);

    const mainImageFile = mainImageRef.current?.files?.[0];
    const secondaryImageFile = secondaryImageRef.current?.files?.[0];

    const allFiles = [mainImageFile, secondaryImageFile].filter(Boolean);
    const oversized = allFiles.some(file => file.size > MAX_IMAGE_SIZE);
    if (oversized) {
      setError('Each image must be smaller than 500KB');
      return;
    }

    allFiles.forEach(file => formData.append('images', file));
    if (mainImageFile?.name)
      formData.append('mainFileName', mainImageFile.name);

    try {
      setIsLoading(true);
      setError('');

      const uploadRes = await fetch('/api/upload-images', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error);

      const updatedFabric = {
        id: fabricData.id,
        name: data.fabricType.value,
        description: data.description,
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
        const el = document.getElementById('admin-fabrics');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      reset({
        fabricType: null,
        description: '',
      });
      mainImageRef.current.value = '';
      secondaryImageRef.current.value = '';

      toast.success('Fabric updated successfully');
    } catch (err) {
      console.error(err);
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
            rules={{ required: true }}
            render={({ field }) => (
              <SelectField
                name="fabricType"
                value={field.value}
                handleChange={field.onChange}
                placeholder="Fabric Name"
                required={true}
                options={fabricTypes}
                width="100%"
                topPlaceholder={false}
                textColor="black"
                textAlign="left"
              />
            )}
          />

          <InputField
            label="Short Description:"
            name="description"
            register={register}
            required
          />

          <FileUpload
            label="Upload Main Image (≤ 500KB):"
            id="mainImage-edit"
            inputRef={mainImageRef}
            single={true}
          />

          <FileUpload
            label="Upload Secondary Image (≤ 500KB):"
            id="secondaryImage-edit"
            inputRef={secondaryImageRef}
            single={true}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-center mt-4">
            <button type="submit" className="group" disabled={isLoading}>
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
