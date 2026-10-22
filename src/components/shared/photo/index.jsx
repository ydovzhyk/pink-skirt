export const photoFrameClass =
  'absolute inset-0 h-full w-full object-cover object-center';

const Photo = ({ src, title = '', index = 0, className, ...rest }) => {
  if (!src) return null;

  const name = String(title).trim();
  const alt =
    name && Number(index) > 0 ? `${name}, photo ${Number(index) + 1}` : name;

  return (
    <img
      {...rest}
      src={src}
      alt={alt}
      className={className || photoFrameClass}
    />
  );
};

export default Photo;
