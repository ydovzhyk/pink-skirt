'use client';

import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Text from '@/components/shared/text/text';
import InputField from '@/components/shared/input-field';
import TextareaField from '@/components/shared/textarea-field';
import FileUpload from '@/components/shared/file-upload';
import { toast } from 'react-toastify';
import { editStory, getStories } from '@/redux/stories/stories-operations';
import {
  getEditStory,
  getCurrentPageStories,
} from '@/redux/stories/stories-selectors';
import { clearEditStory } from '@/redux/stories/stories-slice';
import FormErrorMessage from '@/components/shared/form-error-message';

const MAX_IMAGES = 6;
const MAX_IMAGE_SIZE = 500 * 1024;

const EditStory = () => {
  const currentPage = useSelector(getCurrentPageStories);
  const editStoryData = useSelector(getEditStory);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const mainImageRef = useRef(null);
  const imagesRef = useRef(null);

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
      content: '',
      date: new Date().toISOString().split('T')[0],
      mainImage: null,
      images: [],
    },
  });

  useEffect(() => {
    if (editStoryData) {
      reset({
        title: editStoryData.title || '',
        content: editStoryData.content || '',
        date: editStoryData.date || new Date().toISOString().split('T')[0],
        mainImage: null,
        images: [],
      });
    }
  }, [editStoryData, reset]);

  useEffect(() => {
    const mainEl = document.getElementById('mainImage-edit');
    const listEl = document.getElementById('images-edit');

    const onMain = e => {
      const f = e.target.files?.[0] || null;
      setValue('mainImage', f, { shouldValidate: true, shouldDirty: true });
      if (f) clearErrors('mainImage');
    };
    const onList = e => {
      const arr = Array.from(e.target.files || []);
      setValue('images', arr, { shouldValidate: true });
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
    formData.append('folderName', 'stories');

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

      let imageUploadData = {};
      if (allFiles.length > 0) {
        const uploadRes = await fetch('/api/upload-images', {
          method: 'POST',
          body: formData,
        });
        imageUploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(imageUploadData.error);
      }

      const storyData = {
        id: editStoryData.id,
        title: data.title || editStoryData.title,
        content: data.content || editStoryData.content,
        date: data.date,
        mainImageUrl:
          imageUploadData.mainImageUrl || editStoryData.mainImageUrl,
        additionalImageUrls:
          imageUploadData.additionalImageUrls?.length > 0
            ? imageUploadData.additionalImageUrls
            : editStoryData.additionalImageUrls,
      };

      await dispatch(editStory(storyData)).unwrap();
      await dispatch(getStories({ page: currentPage, limit: 2 })).unwrap();

      setTimeout(() => {
        const el = document.getElementById('admin-stories');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      dispatch(clearEditStory());
      reset();
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
    <section id="edit-story" className="container mb-12 lg:my-16">
      <div className="w-full rounded-md border border-[#464c6a] p-3 lg:p-5 bg-white">
        <Text
          type="normal"
          as="p"
          fontWeight="normal"
          className="text-black mb-5"
        >
          Edit Story
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
            label="Content:"
            name="content"
            register={register}
            required={{ value: true, message: 'Content is required' }}
            validation={{ maxLength: 1000 }}
          />
          {errors.content && (
            <FormErrorMessage message={errors.content.message} />
          )}

          <InputField
            label="Date:"
            name="date"
            register={register}
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            required
          />

          <FileUpload
            label="Upload Main Image (≤ 500KB):"
            id="mainImage-edit"
            inputRef={mainImageRef}
            single={true}
          />
          <FileUpload
            label={`Upload Additional Images (Max ${MAX_IMAGES}, ≤ 500KB each):`}
            id="images-edit"
            inputRef={imagesRef}
            max={MAX_IMAGES}
          />

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
          {errors.mainImage && (
            <FormErrorMessage message={errors.mainImage.message} />
          )}

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
          {errors.images && (
            <FormErrorMessage message={errors.images.message} />
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
                  {isLoading ? 'Editing...' : 'Edit Story'}
                </Text>
              </div>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditStory;

