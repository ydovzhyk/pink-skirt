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
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const currentPage = useSelector(getCurrentPageReadyGoods);
  const editData = useSelector(getEditReadyGood);
  const [selectedType, setSelectedType] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const mainImageRef = useRef(null);
  const imagesRef = useRef(null);

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

  const handleChange = option => setSelectedType(option);

  const onSubmit = async data => {
    const formData = new FormData();
    formData.append('folderName', 'ready-goods');
    formData.append('itemId', editData.id);

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

      const uploadRes = await fetch('/api/upload-images', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error);

      const updatedGood = {
        id: editData.id,
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        date: data.date,
        isNewest: data.isNewest === 'yes',
        clothingType: selectedType?.value || editData.clothingType,
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
      setTimeout(() => {
        reset(
          {
            title: '',
            shortDescription: '',
            description: '',
            fabrication: '',
            colourway: '',
            size: '',
            date: new Date().toISOString().split('T')[0],
            isNewest: 'no',
          },
          { keepDefaultValues: true }
        );
        setSelectedType(null);
        mainImageRef.current.value = '';
        imagesRef.current.value = '';
      }, 0);

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
            required
          />
          <InputField
            label="Short Description:"
            name="shortDescription"
            register={register}
            required
          />
          <TextareaField
            label="Description:"
            name="description"
            register={register}
            required
          />
          <InputField
            label="Date:"
            name="date"
            type="date"
            register={register}
            defaultValue={new Date().toISOString().split('T')[0]}
            required
          />
          <InputField
            label="Fabrication:"
            name="fabrication"
            register={register}
            required
          />
          <InputField
            label="Colourway:"
            name="colourway"
            register={register}
            required
          />
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
          <FileUpload
            label={`Upload Additional Images (Max ${MAX_IMAGES}, ≤ 500KB each):`}
            id="images-editReadyGood"
            inputRef={imagesRef}
            max={MAX_IMAGES}
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