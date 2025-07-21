'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Text from '@/components/shared/text/text';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddStory = () => {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async data => {
    const formData = new FormData();

    // Обмеження розміру
    const validateFile = file => {
      if (!file) return true;
      return file.size <= 500 * 1024; // 500 KB
    };

    if (!validateFile(data.mainImage[0])) {
      toast.error('Main image must be under 500 KB!');
      return;
    }

    for (const file of data.additionalImages || []) {
      if (!validateFile(file)) {
        toast.error('Each additional image must be under 500 KB!');
        return;
      }
    }

    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('date', new Date().toISOString());

    formData.append('mainImage', data.mainImage[0]);

    Array.from(data.additionalImages || []).forEach((file, index) => {
      formData.append('additionalImages', file);
    });

    try {
      setIsLoading(true);
      const origin =
        typeof window !== 'undefined' ? window.location.origin : '';

      await axios.post(`${origin}/api/stories`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Story created!');
      reset();
    } catch (err) {
      toast.error('Error creating story!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container my-12 lg:my-16">
      <div className="max-w-xl w-full mx-auto border border-gray-300 p-6 rounded-md">
        <Text
          as="p"
          type="normal"
          fontWeight="normal"
          className="mb-5 text-black"
        >
          Add New Story
        </Text>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register('title', { required: true })}
            placeholder="Title"
            className="input"
          />
          <textarea
            {...register('content', { required: true })}
            placeholder="Content"
            rows="5"
            className="input"
          />
          <label className="text-sm text-black">Main Image (max 500KB)</label>
          <input
            {...register('mainImage', { required: true })}
            type="file"
            accept="image/*"
          />
          <label className="text-sm text-black">
            Additional Images (up to 5, max 500KB each)
          </label>
          <input
            {...register('additionalImages')}
            type="file"
            multiple
            accept="image/*"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-pink-600 hover:bg-pink-700 transition text-white py-2 px-4 rounded"
          >
            {isLoading ? 'Creating...' : 'Create Story'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddStory;
