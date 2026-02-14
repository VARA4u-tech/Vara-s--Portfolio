const AnimatedAvatar = () => {
  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto md:mx-0 shrink-0">
      {/* Outer frame with brutalist shadow */}
      <div className="absolute inset-0 border-2 border-black translate-x-2 translate-y-2" />
      <div className="relative w-full h-full border-2 border-black bg-white overflow-hidden">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background grid pattern */}
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#00000008"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#grid)" />

          {/* Body / Shoulders */}
          <ellipse
            cx="100"
            cy="210"
            rx="65"
            ry="45"
            fill="#0d0d0d"
            className="animate-[breathe_4s_ease-in-out_infinite]"
          />

          {/* Neck */}
          <rect x="88" y="140" width="24" height="20" rx="4" fill="#e8d5c4" />

          {/* Head */}
          <g className="animate-[float_6s_ease-in-out_infinite]">
            {/* Face */}
            <ellipse cx="100" cy="105" rx="38" ry="44" fill="#e8d5c4" />

            {/* Hair */}
            <path
              d="M62 95 Q62 60 100 55 Q138 60 138 95 Q138 75 130 68 Q120 58 100 56 Q80 58 70 68 Q62 75 62 95Z"
              fill="#1a1a1a"
            />

            {/* Left eye */}
            <g>
              <ellipse cx="85" cy="105" rx="5" ry="5" fill="#1a1a1a">
                <animate
                  attributeName="ry"
                  values="5;0.5;5"
                  dur="4s"
                  repeatCount="indefinite"
                  keyTimes="0;0.04;0.08"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                />
              </ellipse>
              {/* Eye glint */}
              <circle cx="87" cy="103" r="1.5" fill="white" opacity="0.8" />
            </g>

            {/* Right eye */}
            <g>
              <ellipse cx="115" cy="105" rx="5" ry="5" fill="#1a1a1a">
                <animate
                  attributeName="ry"
                  values="5;0.5;5"
                  dur="4s"
                  repeatCount="indefinite"
                  keyTimes="0;0.04;0.08"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                />
              </ellipse>
              {/* Eye glint */}
              <circle cx="117" cy="103" r="1.5" fill="white" opacity="0.8" />
            </g>

            {/* Eyebrows */}
            <line
              x1="77"
              y1="95"
              x2="92"
              y2="94"
              stroke="#1a1a1a"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="108"
              y1="94"
              x2="123"
              y2="95"
              stroke="#1a1a1a"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Nose */}
            <path
              d="M100 110 L97 118 L103 118"
              fill="none"
              stroke="#c4a98a"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Mouth - subtle smile */}
            <path
              d="M90 126 Q100 133 110 126"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Glasses */}
            <rect
              x="73"
              y="97"
              width="24"
              height="18"
              rx="3"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
            <rect
              x="103"
              y="97"
              width="24"
              height="18"
              rx="3"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
            <line
              x1="97"
              y1="105"
              x2="103"
              y2="105"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
            <line
              x1="73"
              y1="105"
              x2="67"
              y2="103"
              stroke="#1a1a1a"
              strokeWidth="1"
            />
            <line
              x1="127"
              y1="105"
              x2="133"
              y2="103"
              stroke="#1a1a1a"
              strokeWidth="1"
            />
          </g>

          {/* Laptop on body */}
          <g className="animate-[breathe_4s_ease-in-out_infinite]">
            <rect x="72" y="175" width="56" height="5" rx="1" fill="#333" />
            <rect x="76" y="168" width="48" height="8" rx="1" fill="#4a4a4a" />
            {/* Screen glow */}
            <rect
              x="78"
              y="169"
              width="44"
              height="5.5"
              rx="0.5"
              fill="#a0e8af"
              opacity="0.5"
            >
              <animate
                attributeName="opacity"
                values="0.3;0.6;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </rect>
            {/* Typing cursor on screen */}
            <rect x="82" y="171" width="6" height="1.5" fill="#1a1a1a">
              <animate
                attributeName="opacity"
                values="1;0;1"
                dur="1s"
                repeatCount="indefinite"
              />
            </rect>
          </g>

          {/* Floating code symbols */}
          <g
            opacity="0.15"
            className="animate-[float_8s_ease-in-out_infinite_reverse]"
          >
            <text
              x="20"
              y="50"
              fontFamily="monospace"
              fontSize="12"
              fill="#1a1a1a"
            >
              &lt;/&gt;
            </text>
            <text
              x="155"
              y="40"
              fontFamily="monospace"
              fontSize="10"
              fill="#1a1a1a"
            >
              {}
            </text>
            <text
              x="15"
              y="160"
              fontFamily="monospace"
              fontSize="10"
              fill="#1a1a1a"
            >
              fn()
            </text>
            <text
              x="160"
              y="150"
              fontFamily="monospace"
              fontSize="11"
              fill="#1a1a1a"
            >
              01
            </text>
          </g>
        </svg>
      </div>

      {/* Status badge */}
      <div className="absolute -bottom-3 -right-3 bg-black text-white px-3 py-1 text-[10px] font-mono uppercase tracking-widest border border-black">
        <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse" />
        Available
      </div>
    </div>
  );
};

export default AnimatedAvatar;
