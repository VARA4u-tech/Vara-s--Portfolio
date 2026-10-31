import { useHalloween } from './halloween/HalloweenContext';

const AnimatedAvatar = () => {
  const { isHalloween } = useHalloween();

  return (
    <div className="relative w-48 h-72 md:w-64 md:h-96 mx-auto md:mx-0 shrink-0 group">
      {/* Brutalist offset shadow */}
      <div
        className={`absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-300 ${
          isHalloween ? 'group-hover:bg-[#FF7518]' : ''
        }`}
      />

      {/* Main frame */}
      <div className="relative w-full h-full border-2 border-black bg-white overflow-hidden group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-300">
        <div className="w-full h-full animate-[float_6s_ease-in-out_infinite] bg-black/5">
          <img
            src="/images/avatar.png"
            alt="Pappuri Durga Vara Prasad"
            className="w-full h-full object-cover object-center"
            loading="eager"
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

        {/* Corner spiderweb inside avatar frame */}
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
        className={`absolute -bottom-3 -right-3 bg-black text-white px-3 py-1 text-[10px] font-mono uppercase tracking-widest border border-black z-10 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-300 ${
          isHalloween ? 'hover:border-[#FF7518]' : ''
        }`}
      >
        <span
          className={`inline-block w-1.5 h-1.5 rounded-none mr-1.5 animate-pulse ${
            isHalloween ? 'bg-[#FF7518]' : 'bg-green-400'
          }`}
        />
        {isHalloween ? 'Available 🎃' : 'Available'}
      </div>
    </div>
  );
};

export default AnimatedAvatar;
