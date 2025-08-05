'use client';

import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Text from '@/components/shared/text/text';
import InputField from '@/components/shared/input-field/index.jsx';
import TextareaField from '@/components/shared/textarea-field/index.jsx';
import FileUpload from '@/components/shared/file-upload/index.jsx';
import SelectField from '@/components/shared/select-field/select-field';
import { toast } from 'react-toastify';
import {
  createReadyGood,
  getReadyGoods,
} from '@/redux/ready-goods/ready-goods-operations';
import { getCurrentPageReadyGoods } from '@/redux/ready-goods/ready-goods-selectors';

const MAX_IMAGES = 6;
const MAX_IMAGE_SIZE = 500 * 1024;

const generateItemId = () => {
  return crypto.randomUUID();
};

const AddReadyGoods = () => {
  const clothingTypes = [
    {
      label: (
        <Text type="tiny" as="span">
          Suit
        </Text>
      ),
      value: 'suit',
    },
    {
      label: (
        <Text type="tiny" as="span">
          Trousers
        </Text>
      ),
      value: 'trousers',
    },
    {
      label: (
        <Text type="tiny" as="span">
          Blouses
        </Text>
      ),
      value: 'blouses',
    },
    {
      label: (
        <Text type="tiny" as="span">
          Skirts
        </Text>
      ),
      value: 'skirts',
    },
    {
      label: (
        <Text type="tiny" as="span">
          Swimsuit
        </Text>
      ),
      value: 'swimsuit',
    },
    {
      label: (
        <Text type="tiny" as="span">
          Dress
        </Text>
      ),
      value: 'dress',
    },
    {
      label: (
        <Text type="tiny" as="span">
          Jacket
        </Text>
      ),
      value: 'jacket',
    },
    {
      label: (
        <Text type="tiny" as="span">
          Outerwear
        </Text>
      ),
      value: 'outerwear',
    },
    {
      label: (
        <Text type="tiny" as="span">
          Accessories
        </Text>
      ),
      value: 'accessories',
    },
    {
      label: (
        <Text type="tiny" as="span">
          Corset
        </Text>
      ),
      value: 'corset',
    },
    {
      label: (
        <Text type="tiny" as="span">
          Lingerie
        </Text>
      ),
      value: 'lingerie',
    },
  ];

  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClothingType, setSelectedClothingType] = useState(null);
  const currentPage = useSelector(getCurrentPageReadyGoods);
  const [error, setError] = useState('');
  const mainImageRef = useRef(null);
  const imagesRef = useRef(null);
  const dispatch = useDispatch();
  const itemId = generateItemId();

  const handleChange = selectedOption => {
    setSelectedClothingType(selectedOption);
  };

  const onSubmit = async data => {
    const formData = new FormData();
    formData.append('folderName', 'ready-goods');
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
        shortDescription: data.shortDescription,
        description: data.description,
        date: data.date,
        details: {
          fabrication: data.fabrication,
          colourway: data.colourway,
          size: data.size,
        },
        isNewest: data.isNewest === 'yes',
        clothingType: selectedClothingType?.value || '',
        mainImageUrl: imageUploadData.mainImageUrl,
        additionalImageUrls: imageUploadData.additionalImageUrls,
      };

      await dispatch(createReadyGood(itemData)).unwrap();
      await dispatch(getReadyGoods({ page: currentPage, limit: 6 })).unwrap();

      setTimeout(() => {
        const el = document.getElementById('admin-ready-goods');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      reset({
        isNewest: 'no',
        date: new Date().toISOString().split('T')[0],
      });
      setSelectedClothingType(null);
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
    <section id="create-ready-goods" className="container mb-12 lg:mb-16">
      <div className="w-full rounded-md border border-[#464c6a] p-3 lg:p-5 bg-white">
        <Text
          type="normal"
          as="p"
          fontWeight="normal"
          className="text-black mb-5"
        >
          Add Ready Good
        </Text>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Title */}
          <InputField
            label="Title:"
            name="title"
            register={register}
            required
          />

          {/* Short Description */}
          <InputField
            label="Short Description:"
            name="shortDescription"
            register={register}
            required
          />

          {/* Description */}
          <TextareaField
            label="Description:"
            name="description"
            register={register}
            required
          />

          {/* Date */}
          <InputField
            label="Date:"
            name="date"
            register={register}
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            required
          />

          {/* Fabrication */}
          <InputField
            label="Fabrication:"
            name="fabrication"
            register={register}
            required
          />

          {/* Colourway */}
          <InputField
            label="Colourway:"
            name="colourway"
            register={register}
            required
          />

          {/* Size */}
          <InputField label="Size:" name="size" register={register} required />

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
                <span className="text-[var(--text-title)] text-sm">Yes</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="no"
                  {...register('isNewest')}
                  defaultChecked
                  className="accent-[var(--accent)]"
                />
                <span className="text-[var(--text-title)] text-sm">No</span>
              </label>
            </div>
          </div>

          {/* Clothing Type Select */}
          <div className="w-full flex flex-row align-center justify-center">
            <SelectField
              name="clothingType"
              value={selectedClothingType}
              handleChange={handleChange}
              placeholder="Clothing Type"
              required={true}
              options={clothingTypes}
              width="100%"
              topPlaceholder={false}
              textColor="black"
              textAlign="left"
            />
          </div>

          {/* Upload Main Image */}
          <FileUpload
            label="Upload Main Image (≤ 500KB):"
            id="mainImage-addReadyGood"
            inputRef={mainImageRef}
            single={true}
          />

          {/* Upload Additional Images */}
          <FileUpload
            label={`Upload Additional Images (Max ${MAX_IMAGES}, ≤ 500KB each):`}
            id="images-addReadyGood"
            inputRef={imagesRef}
            max={MAX_IMAGES}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

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
                  {isLoading ? 'Submitting...' : 'Submit Good'}
                </Text>
              </div>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddReadyGoods;
