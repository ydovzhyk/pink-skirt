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
import { getEditStory } from '@/redux/stories/stories-selectors';
import { clearEditStory } from '@/redux/stories/stories-slice';
import { getCurrentPageStories } from '@/redux/stories/stories-selectors';
import FormErrorMessage from '@/components/shared/form-error-message';

const MAX_IMAGES = 6;
const MAX_IMAGE_SIZE = 500 * 1024;

const EditStory = () => {
  const { register, handleSubmit, reset } = useForm();
  const currentPage = useSelector(getCurrentPageStories);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const mainImageRef = useRef(null);
  const imagesRef = useRef(null);
  const dispatch = useDispatch();
  const editStoryData = useSelector(getEditStory);

  useEffect(() => {
    if (editStoryData) {
      reset({
        title: editStoryData.title || '',
        content: editStoryData.content || '',
        date: editStoryData.date || new Date().toISOString().split('T')[0],
      });
    }
  }, [editStoryData, reset]);

  const onSubmit = async data => {
    const formData = new FormData();
    formData.append('folderName', 'stories');

    const mainImageFile = mainImageRef.current?.files?.[0];
    const additionalImages = Array.from(imagesRef.current?.files || []);

    const allFiles = [...additionalImages];
    if (mainImageFile) allFiles.push(mainImageFile);
    const oversized = allFiles.some(file => file.size > MAX_IMAGE_SIZE);
    if (oversized) {
      setError('mainMedia', {
        type: 'validate',
        message: 'Main media must be ≤ 500KB',
      });
      setError('additionalMedia', {
        type: 'validate',
        message: 'Each additional file must be ≤ 500KB',
      });
      return;
    }

    additionalImages.forEach(file => formData.append('images', file));
    if (mainImageFile) formData.append('images', mainImageFile);
    if (mainImageFile?.name)
      formData.append('mainFileName', mainImageFile.name);

    try {
      setIsLoading(true);
      setError('');

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
            required
          />
          <TextareaField
            label="Content:"
            name="content"
            register={register}
            required
          />
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

          {error && <FormErrorMessage message={error} />}

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
