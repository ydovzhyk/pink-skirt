import Text from '@/components/shared/text/text';
import { toast } from 'react-toastify';

const MAX_IMAGE_SIZE = 500 * 1024;

const FileUpload = ({ label, id, inputRef, single = false, max }) => (
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
          Choose Image{single ? '' : 's'}
        </Text>
      </label>

      <input
        id={id}
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={!single}
        className="hidden"
        onChange={e => {
          const files = e.target.files;
          if (!single && max && files.length > max) {
            e.target.value = '';
            toast.error(`You can upload up to ${max} images.`);
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
  </div>
);

export default FileUpload;