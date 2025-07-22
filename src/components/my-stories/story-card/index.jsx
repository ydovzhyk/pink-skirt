import { useRouter } from 'next/navigation';
import Text from '../../shared/text/text';

const StoryCard = ({
  id,
  title,
  date,
  content,
  mainImageUrl,
}) => {
  const router = useRouter();

  const formattedTitle = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');

  const handleNavigate = () => {
    router.push(`/story/${formattedTitle}/${id}`);
  };

  return (
    <div className="relative flex flex-col sm:flex-row sm:items-center">
      <div
        className="relative w-full sm:w-1/2 aspect-[3/4] rounded-md bg-cover bg-center"
        style={{ backgroundImage: `url(${mainImageUrl})` }}
      ></div>

      <div className="relative z-10 flex flex-col justify-between bg-white sm:absolute sm:right-[60px] sm:bottom-[-40px] w-full sm:w-1/2 aspect-[3/4] px-6 py-4 sm:px-6 sm:py-5 rounded-md shadow-lg">
        <div className="flex flex-col gap-3">
          <Text
            type="normal"
            as="h3"
            fontWeight="medium"
            className="text-black"
          >
            {title}
          </Text>
          <Text type="tiny" as="p" fontWeight="light" className="text-black">
            {new Date(date).toDateString()}
          </Text>
          <Text
            type="tiny"
            as="p"
            fontWeight="light"
            lineHeight="snug"
            className="text-black whitespace-pre-line"
          >
            {content.slice(0, 240)}...
          </Text>
        </div>
        <button
          className="text-black border-b border-gray-400 hover:border-black w-fit transition-colors duration-200"
          onClick={handleNavigate}
        >
          <Text
            type="extra-small"
            as="p"
            fontWeight="light"
            className="text-black"
          >
            Read more
          </Text>
        </button>
      </div>
    </div>
  );
};

export default StoryCard;
