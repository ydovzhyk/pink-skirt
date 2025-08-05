'use client';

import Text from '@/components/shared/text/text';
import { toast } from 'react-toastify';

const FileUpload = ({
  label,
  id,
  inputRef,
  single = false,
  max,
  accept = 'image/*',
  maxFileSize = 500 * 1024, // 500KB by default
}) => {
  const acceptedTypes = accept.split(',').map(type => type.trim());

  const labelText = acceptedTypes.includes('video/*')
    ? single
      ? 'Choose Media'
      : 'Choose Media'
    : acceptedTypes.includes('image/*') && acceptedTypes.includes('video/*')
      ? 'Choose Files'
      : single
        ? 'Choose Image'
        : 'Choose Images';

  return (
    <div className="flex flex-col gap-2">
      <Text
        type="tiny"
        as="p"
        fontWeight="light"
        className="text-[var(--text-title)]"
      >
        {label}
      </Text>

      <div className="group">
        <label
          htmlFor={id}
          className="w-fit flex items-center gap-1 group-hover:gap-3 px-3 md:px-8 py-3 md:py-4 rounded-md border-gray-400 tracking-wider transition-all duration-300 ease-out bg-transparent group-hover:bg-[#F8F1F1] group-hover:border-[#F8F1F1] group-hover:shadow-md cursor-pointer btn-shine uppercase"
          style={{ borderWidth: '0.5px' }}
        >
          <Text
            type="tiny"
            as="span"
            fontWeight="light"
            className="text-[var(--text-title)]"
          >
            {labelText}
          </Text>
        </label>

        <input
          id={id}
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={!single}
          className="hidden"
          onChange={e => {
            const files = e.target.files;
            if (!single && max && files.length > max) {
              e.target.value = '';
              toast.error(`You can upload up to ${max} files.`);
              return;
            }

            const oversize = Array.from(files).some(
              file => file.size > maxFileSize
            );

            if (oversize) {
              e.target.value = '';
              toast.error(
                `Each file must be ${Math.round(maxFileSize / 1024)}KB or less.`
              );
            }
          }}
        />
      </div>
    </div>
  );
};

export default FileUpload;
