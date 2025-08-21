'use client';

import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import Text from '@/components/shared/text/text';
import InputField from '@/components/shared/input-field/index.jsx';
import TextareaField from '@/components/shared/textarea-field/index.jsx';
import FileUpload from '@/components/shared/file-upload/index.jsx';
import { toast } from 'react-toastify';
import { createModel, getModels } from '@/redux/models/models-operations';
import { v4 as uuidv4 } from 'uuid';
import FormErrorMessage from '@/components/shared/form-error-message';

const MAX_IMAGES = 6;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const AddModels = () => {
  const [isLoading, setIsLoading] = useState(false);
  const mainImageRef = useRef(null);
  const imagesRef = useRef(null);
  const dispatch = useDispatch();
  const itemId = uuidv4();

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
      description: '',
      date: new Date().toISOString().split('T')[0],
      mainMedia: null,
      additionalMedia: [],
    },
  });

  useEffect(() => {
    const mainEl = document.getElementById('mainImage-addModel');
    const listEl = document.getElementById('images-addModel');

    const onMain = e => {
      const f = e.target.files?.[0] || null;
      setValue('mainMedia', f, { shouldValidate: true, shouldDirty: true });
      if (f) clearErrors('mainMedia');
    };
    const onList = e => {
      const arr = Array.from(e.target.files || []);
      setValue('additionalMedia', arr, {
        shouldValidate: true,
        shouldDirty: true,
      });
      if (arr.length) clearErrors('additionalMedia');
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
    formData.append('folderName', 'models');
    formData.append('itemId', itemId);

    const mainImageFile = data.mainMedia;
    const additionalImages = Array.isArray(data.additionalMedia)
      ? data.additionalMedia
      : [];

    const allFiles = [...additionalImages];
    if (mainImageFile) allFiles.push(mainImageFile);

    const tooBigMain = mainImageFile && mainImageFile.size > MAX_IMAGE_SIZE;
    const tooBigExtra = additionalImages.find(f => f.size > MAX_IMAGE_SIZE);

    if (tooBigMain || tooBigExtra) {
      if (tooBigMain) {
        setError('mainMedia', {
          type: 'validate',
          message: 'Main media must be ≤ 5MB',
        });
      }
      if (tooBigExtra) {
        setError('additionalMedia', {
          type: 'validate',
          message: 'Each additional file must be ≤ 5MB',
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

      const imageUploadRes = await fetch('/api/upload-images', {
        method: 'POST',
        body: formData,
      });

      const imageUploadData = await imageUploadRes.json();
      if (!imageUploadRes.ok) throw new Error(imageUploadData.error);

      const itemData = {
        id: itemId,
        title: data.title,
        description: data.description,
        date: data.date,
        media: [
          ...(imageUploadData.mainImageUrl
            ? [imageUploadData.mainImageUrl]
            : []),
          ...(imageUploadData.additionalImageUrls || []),
        ],
      };

      await dispatch(createModel(itemData)).unwrap();
      await dispatch(getModels()).unwrap();

      setTimeout(() => {
        const el = document.getElementById('admin-models');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      reset();
      if (mainImageRef.current) mainImageRef.current.value = '';
      if (imagesRef.current) imagesRef.current.value = '';
      toast.success('Model created successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit model.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="create-models" className="container mb-12 lg:mb-16">
      <div className="w-full rounded-md border border-[#464c6a] p-3 lg:p-5 bg-white">
        <Text
          type="normal"
          as="p"
          fontWeight="normal"
          className="text-black mb-5"
        >
          Add Model
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

          <TextareaField
            label="Description:"
            name="description"
            register={register}
            required={{ value: true, message: 'Description is required' }}
            validation={{ maxLength: 130 }}
          />
          {errors.description && (
            <FormErrorMessage message={errors.description.message} />
          )}

          <InputField
            label="Date:"
            name="date"
            type="date"
            register={register}
            required={{ value: true, message: 'Date is required' }}
          />
          {errors.date && <FormErrorMessage message={errors.date.message} />}

          <FileUpload
            label="Upload Media (≤ 5MB):"
            id="mainImage-addModel"
            inputRef={mainImageRef}
            accept="image/*,video/*"
            max={1}
            maxFileSize={MAX_IMAGE_SIZE}
          />
          {errors.mainMedia && (
            <FormErrorMessage message={errors.mainMedia.message} />
          )}

          <FileUpload
            label={`Upload Additional Media (Max ${MAX_IMAGES}, ≤ 5MB each):`}
            id="images-addModel"
            inputRef={imagesRef}
            accept="image/*,video/*"
            max={MAX_IMAGES}
            maxFileSize={MAX_IMAGE_SIZE}
          />
          {errors.additionalMedia && (
            <FormErrorMessage message={errors.additionalMedia.message} />
          )}

          <input
            type="hidden"
            {...register('mainMedia', {
              validate: f => {
                if (!f) return 'Main media is required';
                if (f.size > MAX_IMAGE_SIZE) return 'Main media must be ≤ 5MB';
                return true;
              },
            })}
          />

          <input
            type="hidden"
            {...register('additionalMedia', {
              validate: arr => {
                if (!Array.isArray(arr)) return true;
                if (arr.length > MAX_IMAGES)
                  return `Maximum ${MAX_IMAGES} additional files`;
                const tooBig = arr.find(f => f.size > MAX_IMAGE_SIZE);
                if (tooBig) return 'Each additional file must be ≤ 5MB';
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
                  {isLoading ? 'Submitting...' : 'Submit Model'}
                </Text>
              </div>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddModels;
