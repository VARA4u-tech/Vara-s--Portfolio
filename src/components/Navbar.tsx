import { useState } from 'react';
import { playClick, playHover } from '@/hooks/useSoundEffects';
import SoundToggle from './SoundToggle';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-6 bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between lg:justify-center relative">
        {/* Desktop Navbar (Hidden on Mobile) */}
        <div className="hidden lg:flex items-center justify-center gap-0">
          {links.map((link, i) => (
            <span key={link.href} className="flex items-center">
              <a
                href={link.href}
                className="nav-link px-4 py-1 active:opacity-50 transition-opacity"
                onClick={playClick}
                onMouseEnter={playHover}
                onTouchStart={playClick}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  link.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
              >
                {link.label}
              </a>
              {i < links.length - 1 && (
                <span className="text-foreground/20 text-xs">|</span>
              )}
            </span>
          ))}
        </div>

        {/* Desktop Sound Toggle (Absolute Right) */}
        <div className="hidden lg:block absolute right-6">
          <SoundToggle />
        </div>

        {/* Mobile Header (Toggle Left, Sound Right) */}
        <div className="lg:hidden flex justify-between w-full items-center">
          <button
            onClick={() => {
              playClick();
              setOpen(!open);
            }}
            onMouseEnter={playHover}
            onTouchStart={playClick}
            className="nav-link active:scale-95 transition-transform"
          >
            {open ? 'Close' : 'Menu'}
          </button>
          <div className="scale-75">
            <SoundToggle />
          </div>
        </div>

        {/* Mobile menu (Centered Links) */}
        {open && (
          <div className="lg:hidden flex flex-col items-center justify-center w-full gap-6 mt-12 animate-in fade-in slide-in-from-top-4 duration-300">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-sm tracking-[0.3em] active:scale-95 transition-transform"
                onClick={() => {
                  playClick();
                  setOpen(false);
                }}
                onMouseEnter={playHover}
                onTouchStart={playClick}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  link.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
