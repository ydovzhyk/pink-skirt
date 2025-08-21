'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Text from '@/components/shared/text/text';
import InputField from '@/components/shared/input-field';
import TextareaField from '@/components/shared/textarea-field';
import FileUpload from '@/components/shared/file-upload';
import SelectField from '@/components/shared/select-field/select-field';
import { toast } from 'react-toastify';
import {
  editReadyGood,
  getReadyGoods,
} from '@/redux/ready-goods/ready-goods-operations';
import {
  getEditReadyGood,
  getCurrentPageReadyGoods,
} from '@/redux/ready-goods/ready-goods-selectors';
import { clearEditReadyGood } from '@/redux/ready-goods/ready-goods-slice';
import FormErrorMessage from '@/components/shared/form-error-message';

const MAX_IMAGES = 6;
const MAX_IMAGE_SIZE = 500 * 1024;

const clothingTypes = [
  'suit',
  'trousers',
  'blouses',
  'skirts',
  'swimsuit',
  'dress',
  'jacket',
  'outerwear',
  'accessories',
  'corset',
  'lingerie',
].map(type => ({
  label: (
    <Text type="tiny" as="span">
      {type[0].toUpperCase() + type.slice(1)}
    </Text>
  ),
  value: type,
}));

const EditReadyGood = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector(getCurrentPageReadyGoods);
  const editData = useSelector(getEditReadyGood);

  const mainImageRef = useRef(null);
  const imagesRef = useRef(null);
  const [selectedType, setSelectedType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      shortDescription: '',
      description: '',
      fabrication: '',
      colourway: '',
      size: '',
      date: new Date().toISOString().split('T')[0],
      isNewest: 'no',
      clothingType: '',
      mainImage: null,
      images: [],
    },
  });

  useEffect(() => {
    if (editData) {
      reset({
        title: editData.title,
        shortDescription: editData.shortDescription,
        description: editData.description,
        fabrication: editData.details?.fabrication || '',
        colourway: editData.details?.colourway || '',
        size: editData.details?.size || '',
        date: editData.date,
        isNewest: editData.isNewest ? 'yes' : 'no',
        clothingType: editData.clothingType,
        mainImage: null,
        images: [],
      });
      setSelectedType({
        value: editData.clothingType,
        label: (
          <Text type="tiny" as="span">
            {editData.clothingType}
          </Text>
        ),
      });
    }
  }, [editData, reset]);

  const handleChange = option => {
    setSelectedType(option);
    setValue('clothingType', option?.value || '', { shouldValidate: true });
  };

  useEffect(() => {
    const mainEl = document.getElementById('mainImage-editReadyGood');
    const listEl = document.getElementById('images-editReadyGood');

    const onMain = e => {
      const f = e.target.files?.[0] || null;
      setValue('mainImage', f, { shouldValidate: true, shouldDirty: true });
      if (f) clearErrors('mainImage');
    };
    const onList = e => {
      const arr = Array.from(e.target.files || []);
      setValue('images', arr, { shouldValidate: true, shouldDirty: true });
      if (arr.length) clearErrors('images');
    };

    mainEl?.addEventListener('change', onMain);
    listEl?.addEventListener('change', onList);
    return () => {
      mainEl?.removeEventListener('change', onMain);
      listEl?.removeEventListener('change', onList);
    };
  }, [setValue, clearErrors]);

  const onSubmit = async data => {
    const formData = new FormData();
    formData.append('folderName', 'ready-goods');
    formData.append('itemId', editData.id);

    const mainImageFile = data.mainImage;
    const additionalImages = data.images || [];
    const allFiles = [...additionalImages];
    if (mainImageFile) allFiles.push(mainImageFile);

    const oversized = allFiles.some(file => file.size > MAX_IMAGE_SIZE);
    if (oversized) {
      if (mainImageFile?.size > MAX_IMAGE_SIZE) {
        setError('mainImage', {
          type: 'validate',
          message: 'Main image must be ≤ 500KB',
        });
      }
      if (additionalImages.some(f => f.size > MAX_IMAGE_SIZE)) {
        setError('images', {
          type: 'validate',
          message: 'Each additional image must be ≤ 500KB',
        });
      }
      return;
    }

    additionalImages.forEach(file => formData.append('images', file));
    if (mainImageFile) formData.append('images', mainImageFile);
    if (mainImageFile?.name)
      formData.append('mainFileName', mainImageFile.name);

    try {
      setIsLoading(true);

      const hasPendingFiles = [
        ...(mainImageRef.current?.files || []),
        ...(imagesRef.current?.files || []),
      ].some(file => file.size === 0);
      if (hasPendingFiles) {
        toast.error('Some files are still loading. Please wait...');
        setIsLoading(false);
        return;
      }

      let uploadData = {};
      if (allFiles.length > 0) {
        const uploadRes = await fetch('/api/upload-images', {
          method: 'POST',
          body: formData,
        });
        uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error);
      }

      const updatedGood = {
        id: editData.id,
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        date: data.date,
        isNewest: data.isNewest === 'yes',
        clothingType: data.clothingType,
        mainImageUrl: uploadData.mainImageUrl || editData.mainImageUrl,
        additionalImageUrls:
          uploadData.additionalImageUrls?.length > 0
            ? uploadData.additionalImageUrls
            : editData.additionalImageUrls,
        details: {
          fabrication: data.fabrication,
          colourway: data.colourway,
          size: data.size,
        },
      };

      await dispatch(editReadyGood(updatedGood)).unwrap();
      await dispatch(getReadyGoods({ page: currentPage, limit: 6 })).unwrap();

      setTimeout(() => {
        const el = document.getElementById('admin-ready-goods');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      dispatch(clearEditReadyGood());
      reset({
        title: '',
        shortDescription: '',
        description: '',
        fabrication: '',
        colourway: '',
        size: '',
        date: new Date().toISOString().split('T')[0],
        isNewest: 'no',
        clothingType: '',
        mainImage: null,
        images: [],
      });
      setSelectedType(null);
      mainImageRef.current.value = '';
      imagesRef.current.value = '';
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit item.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="edit-ready-good" className="container mb-12 lg:mb-16">
      <div className="w-full rounded-md border border-[#464c6a] p-3 lg:p-5 bg-white">
        <Text
          type="normal"
          as="p"
          fontWeight="normal"
          className="text-black mb-5"
        >
          Edit Ready Good
        </Text>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <InputField
            label="Title:"
            name="title"
            register={register}
            required={{ value: true, message: 'Title is required' }}
            validation={{
              minLength: { value: 2, message: 'At least 2 characters' },
            }}
          />
          {errors.title && <FormErrorMessage message={errors.title.message} />}

          <InputField
            label="Short Description:"
            name="shortDescription"
            register={register}
            required={{ value: true, message: 'Short Description is required' }}
            validation={{
              minLength: { value: 2, message: 'At least 2 characters' },
            }}
          />
          {errors.shortDescription && (
            <FormErrorMessage message={errors.shortDescription.message} />
          )}

          <TextareaField
            label="Description:"
            name="description"
            register={register}
            required={{ value: true, message: 'Description is required' }}
            validation={{ maxLength: 1000 }}
          />
          {errors.description && (
            <FormErrorMessage message={errors.description.message} />
          )}

          <InputField
            label="Date:"
            name="date"
            type="date"
            register={register}
            required
          />

          <InputField
            label="Fabrication:"
            name="fabrication"
            register={register}
            required={{ value: true, message: 'Fabrication is required' }}
            validation={{
              minLength: { value: 2, message: 'At least 2 characters' },
            }}
          />
          {errors.fabrication && (
            <FormErrorMessage message={errors.fabrication.message} />
          )}

          <InputField
            label="Colourway:"
            name="colourway"
            register={register}
            required={{ value: true, message: 'Colourway is required' }}
            validation={{
              minLength: { value: 2, message: 'At least 2 characters' },
            }}
          />
          {errors.colourway && (
            <FormErrorMessage message={errors.colourway.message} />
          )}

          <InputField
            label="Size:"
            name="size"
            register={register}
            required={{ value: true, message: 'Size is required' }}
            validation={{
              minLength: { value: 2, message: 'At least 2 characters' },
            }}
          />
          {errors.size && <FormErrorMessage message={errors.size.message} />}

          <div className="flex flex-col gap-2">
            <Text
              type="tiny"
              as="p"
              fontWeight="light"
              className="text-[var(--text-title)]"
            >
              Is this your newest good?
            </Text>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="yes"
                  {...register('isNewest')}
                  className="accent-[var(--accent)]"
                />
                <span className="text-sm text-[var(--text-title)]">Yes</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="no"
                  {...register('isNewest')}
                  className="accent-[var(--accent)]"
                />
                <span className="text-sm text-[var(--text-title)]">No</span>
              </label>
            </div>
          </div>

          <SelectField
            name="clothingType"
            value={selectedType}
            handleChange={handleChange}
            placeholder="Clothing Type"
            required={true}
            options={clothingTypes}
            width="100%"
            topPlaceholder={false}
            textColor="black"
            textAlign="left"
          />

          <FileUpload
            label="Upload Main Image (≤ 500KB):"
            id="mainImage-editReadyGood"
            inputRef={mainImageRef}
            single={true}
          />
          {errors.mainImage && (
            <FormErrorMessage message={errors.mainImage.message} />
          )}

          <FileUpload
            label={`Upload Additional Images (Max ${MAX_IMAGES}, ≤ 500KB each):`}
            id="images-editReadyGood"
            inputRef={imagesRef}
            max={MAX_IMAGES}
          />
          {errors.images && (
            <FormErrorMessage message={errors.images.message} />
          )}

          <input
            type="hidden"
            {...register('mainImage', {
              validate: f => {
                if (f && f.size > MAX_IMAGE_SIZE)
                  return 'Main image must be ≤ 500KB';
                return true;
              },
            })}
          />

          <input
            type="hidden"
            {...register('images', {
              validate: arr => {
                if (!Array.isArray(arr)) return true;
                if (arr.length > MAX_IMAGES)
                  return `Maximum ${MAX_IMAGES} additional images`;
                const tooBig = arr.find(f => f.size > MAX_IMAGE_SIZE);
                if (tooBig) return 'Each additional image must be ≤ 500KB';
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
                  {isLoading ? 'Editing...' : 'Edit Item'}
                </Text>
              </div>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditReadyGood;
