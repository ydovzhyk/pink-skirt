'use client';

const VideoBanner = ({ type = 'top', id }) => {
  const videoSrc =
    type === 'top' ? '/video/banner-top.mp4' : '/video/banner-bottom.mp4';
  const heightClasses =
    type === 'top'
      ? 'h-[450px] sm:h-[500px] md:h-[580px]'
      : 'h-[450px] sm:h-[400px] md:h-[450px]';

  return (
    <section id={id} className={`w-full ${heightClasses} overflow-hidden relative`}>
      <video
        className="w-full h-full object-cover"
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
      />
    </section>
  );
};

export default VideoBanner;
