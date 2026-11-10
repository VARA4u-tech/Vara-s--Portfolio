import { useState, useEffect } from 'react';
import { Dog, ShieldCheck } from 'lucide-react';
import { playClick, playHover } from '@/hooks/useSoundEffects';
import { useComic } from '@/context/ThemeContext';

const PetToggle = () => {
  const { isComic } = useComic();
  const [isPetVisible, setIsPetVisible] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('site_pet_visible');
    if (saved === 'false') {
      setIsPetVisible(false);
    }
  }, []);

  const togglePet = () => {
    const newState = !isPetVisible;
    setIsPetVisible(newState);
    localStorage.setItem('site_pet_visible', String(newState));
    window.dispatchEvent(
      new CustomEvent('pet-toggle', { detail: { visible: newState } }),
    );
    playClick();
  };

  const label = isComic
    ? isPetVisible
      ? 'Hide Hero Assistant'
      : 'Show Hero Assistant'
    : isPetVisible
      ? 'Hide PixelPet'
      : 'Show PixelPet';

  return (
    <button
      onClick={togglePet}
      onMouseEnter={playHover}
      className="p-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 rounded-none relative"
      aria-label={label}
      title={label}
    >
      {isComic ? (
        <ShieldCheck className="w-4 h-4" />
      ) : (
        <Dog className="w-4 h-4" />
      )}
      {!isPetVisible && (
        <div
          className={`absolute left-[3px] top-[16px] w-5 h-0.5 -rotate-45 ${
            isComic ? 'bg-[#888888]' : 'bg-red-500'
          }`}
        />
      )}
    </button>
  );
};

export default PetToggle;
