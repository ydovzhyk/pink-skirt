'use client';

import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import Text from '@/components/shared/text/text';
import { toast } from 'react-toastify';
import { createStory } from '@/redux/stories/stories-operations';

const MAX_IMAGES = 6;
const MAX_IMAGE_SIZE = 500 * 1024;

const generateStoryId = () => {
  return crypto.randomUUID();
};

const AddStory = () => {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const mainImageRef = useRef(null);
  const imagesRef = useRef(null);
  const dispatch = useDispatch();

  const storyId = generateStoryId();

  const onSubmit = async data => {
    const formData = new FormData();
    formData.append('folderName', 'stories');
    formData.append('storyId', storyId);

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

      const imageUploadRes = await fetch('/api/upload-story-images', {
        method: 'POST',
        body: formData,
      });

      const imageUploadData = await imageUploadRes.json();
      if (!imageUploadRes.ok) throw new Error(imageUploadData.error);

      const storyData = {
        id: storyId,
        title: data.title,
        content: data.content,
        date: data.date,
        mainImageUrl: imageUploadData.mainImageUrl,
        additionalImageUrls: imageUploadData.additionalImageUrls,
      };

      const result = await dispatch(createStory(storyData));
      if (createStory.fulfilled.match(result)) {
        toast.success('Story successfully submitted!');
      } else {
        toast.error(result.payload || 'Story creation failed.');
      }
      reset();
      if (mainImageRef.current) mainImageRef.current.value = '';
      if (imagesRef.current) imagesRef.current.value = '';
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <section id="create-story" className="container my-12 lg:my-16">
        <div className="w-full rounded-md border border-[#464c6a] p-3 lg:p-5">
          <Text
            type="normal"
            as="p"
            fontWeight="normal"
            className="text-black mb-5"
          >
            Add New Story
          </Text>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label>
                <Text
                  type="tiny"
                  as="p"
                  fontWeight="light"
                  className="text-[var(--text-title)]"
                >
                  Title:
                </Text>
              </label>
              <input
                {...register('title', { required: true })}
                className="bg-white w-full rounded-md border-2 border-gray-300 outline-none focus:border-[var(--accent)] focus:ring-[var(--accent)] px-3 py-2 text-[var(--text-title)]"
                type="text"
                maxLength="100"
                required
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2">
              <label>
                <Text
                  type="tiny"
                  as="p"
                  fontWeight="light"
                  className="text-[var(--text-title)]"
                >
                  Content:
                </Text>
              </label>
              <textarea
                {...register('content', { required: true })}
                className="bg-white w-full rounded-md border-2 border-gray-300 outline-none focus:border-[var(--accent)] focus:ring-[var(--accent)] px-3 py-2 text-[var(--text-title)]"
                rows="4"
                maxLength="1000"
                required
              />
            </div>

            {/* Date */}
            <div className="flex flex-col gap-2">
              <label>
                <Text
                  type="tiny"
                  as="p"
                  fontWeight="light"
                  className="text-[var(--text-title)]"
                >
                  Date:
                </Text>
              </label>
              <input
                {...register('date', { required: true })}
                className="bg-white w-full rounded-md border-2 border-gray-300 outline-none focus:border-[var(--accent)] focus:ring-[var(--accent)] px-3 py-2 text-[var(--text-title)]"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Upload Main Image */}
            <div className="flex flex-col gap-2">
              <Text
                type="tiny"
                as="p"
                fontWeight="light"
                className="text-[var(--text-title)]"
              >
                Upload Main Image (≤ 500KB):
              </Text>

              <div className="group">
                <label
                  htmlFor="mainImage"
                  className="w-fit flex items-center gap-1 group-hover:gap-3 px-3 md:px-8 py-3 md:py-4 rounded-md border-gray-400 tracking-wider transition-all duration-300 ease-out bg-transparent group-hover:bg-[#F8F1F1] group-hover:border-[#F8F1F1] group-hover:shadow-md cursor-pointer btn-shine uppercase"
                  style={{ borderWidth: '0.5px' }}
                >
                  <Text
                    type="tiny"
                    as="span"
                    fontWeight="light"
                    className="text-[var(--text-title)]"
                  >
                    Choose Image
                  </Text>
                </label>

                <input
                  id="mainImage"
                  ref={mainImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file && file.size > MAX_IMAGE_SIZE) {
                      e.target.value = '';
                      toast.error('Image size must be 500KB or less.');
                    }
                  }}
                />
              </div>
            </div>

            {/* Upload Additional Images */}
            <div className="flex flex-col gap-2">
              <Text
                type="tiny"
                as="p"
                fontWeight="light"
                className="text-[var(--text-title)]"
              >
                Upload Additional Images (Max {MAX_IMAGES}, ≤ 500KB each):
              </Text>

              <div className="group">
                <label
                  htmlFor="images"
                  className="w-fit flex items-center gap-1 group-hover:gap-3 px-3 md:px-8 py-3 md:py-4 rounded-md border-gray-400 tracking-wider transition-all duration-300 ease-out bg-transparent group-hover:bg-[#F8F1F1] group-hover:border-[#F8F1F1] group-hover:shadow-md cursor-pointer btn-shine uppercase"
                  style={{ borderWidth: '0.5px' }}
                >
                  <Text
                    type="tiny"
                    as="span"
                    fontWeight="light"
                    className="text-[var(--text-title)]"
                  >
                    Choose Images
                  </Text>
                </label>

                <input
                  id="images"
                  ref={imagesRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => {
                    const files = e.target.files;
                    if (files.length > MAX_IMAGES) {
                      e.target.value = '';
                      toast.error(`You can upload up to ${MAX_IMAGES} images.`);
                      return;
                    }
                    const oversize = Array.from(files).some(
                      file => file.size > MAX_IMAGE_SIZE
                    );
                    if (oversize) {
                      e.target.value = '';
                      toast.error('Each image must be 500KB or less.');
                    }
                  }}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            {/* Submit */}
            <div className="flex justify-center mt-4">
              <button type="submit" className="group" disabled={isLoading}>
                <div
                  style={{ borderWidth: '0.5px' }}
                  className="w-fit flex items-center justify-center gap-1 group-hover:gap-3 px-6 py-3 md:px-8 md:py-4 rounded-md border-gray-400 transition-all duration-300 ease-out bg-transparent group-hover:bg-[#F8F1F1] group-hover:border-[#F8F1F1] group-hover:shadow-md btn-shine uppercase"
                >
                  <Text
                    type="tiny"
                    as="span"
                    fontWeight="light"
                    className="text-[var(--text-title)]"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Story'}
                  </Text>
                </div>
              </button>
            </div>
          </form>
        </div>
      </section>
  );
};

export default AddStory;

