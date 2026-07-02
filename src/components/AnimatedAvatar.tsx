import { useState } from 'react';

const AnimatedAvatar = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto md:mx-0 shrink-0 group">
      {/* Brutalist offset shadow (Solid Black) */}
      <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-300" />

      {/* Main frame */}
      <div className="relative w-full h-full border-2 border-black bg-white overflow-hidden group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-300">
        <div className="w-full h-full animate-[float_6s_ease-in-out_infinite] bg-black/5">
          <img
            src={
              imageError
                ? '/images/avatar.jpeg'
                : '/images/avatar.jpeg'
            }
            alt="Pappuri Durga Vara Prasad"
            className="w-full h-full object-cover object-top"
            loading="eager"
            onError={() => setImageError(true)}
          />
        </div>

        {/* Subtle scan line overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 3px)',
          }}
        />
      </div>

      {/* Status badge */}
      <div className="absolute -bottom-3 -right-3 bg-black text-white px-3 py-1 text-[10px] font-mono uppercase tracking-widest border border-black z-10 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-300">
        <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-none mr-1.5 animate-pulse" />
        Available
      </div>
    </div>
  );
};

export default AnimatedAvatar;
