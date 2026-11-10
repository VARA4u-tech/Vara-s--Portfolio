import { useHalloween, useComic } from '@/context/ThemeContext';

const AnimatedAvatar = () => {
  const { isHalloween } = useHalloween();
  const { isComic } = useComic();

  return (
    <div className="relative w-48 h-72 md:w-64 md:h-96 mx-auto md:mx-0 shrink-0 group">
      {/* Architectural offset shadow plate */}
      <div
        className={`absolute inset-0 translate-x-2 translate-y-2 group-hover:translate-x-3.5 group-hover:translate-y-3.5 transition-transform duration-300 ${
          isComic
            ? 'bg-[#D9B45B] border-2 border-[#171717]'
            : isHalloween
              ? 'bg-black group-hover:bg-[#FF7518]'
              : 'bg-black'
        }`}
      />

      {/* Main portrait frame */}
      <div
        className={`relative w-full h-full border-2 overflow-hidden group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 transition-transform duration-300 ${
          isComic
            ? 'border-[#FFFFFF] bg-[#FFFFFF] shadow-[3px_3px_0px_#B58B32]'
            : 'border-black bg-white'
        }`}
      >
        <div className="w-full h-full animate-[float_6s_ease-in-out_infinite] bg-black/5">
          <img
            src="/images/avatar.png"
            alt="Pappuri Durga Vara Prasad - Full Stack Developer and AI Engineer"
            width={256}
            height={384}
            className={`w-full h-full object-cover object-center ${
              isComic ? 'contrast-105' : ''
            }`}
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Minimalist archival figure mark in Comic mode */}
        {isComic && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-block px-2 py-0.5 border border-[#171717] bg-[#FFFFFF] text-[#171717] font-mono text-[8px] font-black uppercase tracking-widest shadow-[2px_2px_0px_#D9B45B]">
              FIG. 01
            </span>
          </div>
        )}

        {/* Subtle scan line overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 3px)',
          }}
        />

        {/* Corner spiderweb inside avatar frame (Halloween only) */}
        {isHalloween && (
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-40 select-none">
            <svg viewBox="0 0 100 100" fill="none" className="text-foreground">
              <line
                x1="100"
                y1="0"
                x2="0"
                y2="0"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="100"
                y1="0"
                x2="100"
                y2="100"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="100"
                y1="0"
                x2="20"
                y2="80"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M 80 0 Q 80 20 100 20"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M 60 0 Q 60 40 100 40"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M 40 0 Q 40 60 100 60"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Status badge */}
      <div
        className={`absolute -bottom-3 -right-3 px-3 py-1 text-[10px] font-mono uppercase tracking-widest border z-10 group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 transition-transform duration-300 ${
          isComic
            ? 'bg-[#171717] text-[#FFFFFF] font-bold border-2 border-[#D9D9D9] shadow-[3px_3px_0px_#B58B32]'
            : isHalloween
              ? 'border-black bg-black text-white hover:border-[#FF7518]'
              : 'border-black bg-black text-white'
        }`}
      >
        <span
          className={`inline-block w-1.5 h-1.5 rounded-none mr-1.5 ${
            isComic
              ? 'bg-[#D9B45B]'
              : isHalloween
                ? 'bg-[#FF7518] animate-pulse'
                : 'bg-green-400 animate-pulse'
          }`}
        />
        {isComic
          ? 'STATUS: ACTIVE'
          : isHalloween
            ? 'Available 🎃'
            : 'Available'}
      </div>
    </div>
  );
};

export default AnimatedAvatar;
