'use client';

import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import Text from '@/components/shared/text/text';
import InputField from '@/components/shared/input-field/index.jsx';
import TextareaField from '@/components/shared/textarea-field/index.jsx';
import FileUpload from '@/components/shared/file-upload/index.jsx';
import { toast } from 'react-toastify';
import { createModel, getModels } from '@/redux/models/models-operations';
import { v4 as uuidv4 } from 'uuid';

const MAX_IMAGES = 6;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const AddModels = () => {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const mainImageRef = useRef(null);
  const imagesRef = useRef(null);
  const dispatch = useDispatch();
  const itemId = uuidv4();

  const onSubmit = async data => {
    const formData = new FormData();
    formData.append('folderName', 'models');
    formData.append('itemId', itemId);

    const mainImageFile = mainImageRef.current?.files?.[0];
    const additionalImages = Array.from(imagesRef.current?.files || []);

    const allFiles = [...additionalImages];
    if (mainImageFile) allFiles.push(mainImageFile);

    const oversized = allFiles.some(file => file.size > MAX_IMAGE_SIZE);
    if (oversized) {
      setError('Each image must be smaller than 500KB');
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

      reset({
        date: new Date().toISOString().split('T')[0],
      });
      mainImageRef.current.value = '';
      imagesRef.current.value = '';
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
            required
          />
          <TextareaField
            label="Description:"
            name="description"
            register={register}
            required
            validation={{ maxLength: 130 }}
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
            label="Upload Media (≤ 5MB):"
            id="mainImage-addModel"
            inputRef={mainImageRef}
            accept="image/*,video/*"
            max={1}
            maxFileSize={MAX_IMAGE_SIZE}
          />
          <FileUpload
            label={`Upload Additional Media (Max ${MAX_IMAGES}, ≤ 5MB each):`}
            id="images-addModel"
            inputRef={imagesRef}
            accept="image/*,video/*"
            max={MAX_IMAGES}
            maxFileSize={MAX_IMAGE_SIZE}
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
