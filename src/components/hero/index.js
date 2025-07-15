'use client';

const VideoBanner = () => {
  return (
    <div className="w-full h-[250px] sm:h-[400px] md:h-[580px] overflow-hidden relative">
      <video
        className="w-full h-full object-cover"
        src="/video/banner.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};

export default VideoBanner;
