import { useState, useRef } from 'react';
import { playClick, playHover } from '@/hooks/useSoundEffects';
import { useLenis } from 'lenis/react';
import ThemeSelector from './ThemeSelector';
import PreferencesPopover from './PreferencesPopover';
import { useComic, useHalloween } from '@/context/ThemeContext';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useGSAPContext } from '@/hooks/useGSAPContext';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Work', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  // { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isComic } = useComic();
  const { isHalloween } = useHalloween();
  const lenis = useLenis();
  const navRef = useRef<HTMLElement>(null);

  // GSAP: hide navbar on scroll down, reveal on scroll up
  useGSAPContext(
    () => {
      // Delay all Navbar logic until AFTER the loading screen finishes (3 seconds)
      const timer = setTimeout(() => {
        let lastScrollY = window.scrollY;
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        // Mobile scrolls in shorter bursts — lower threshold
        const hideThreshold = isMobile ? 50 : 100;

        ScrollTrigger.create({
          start: 'top -60px',
          end: 'max',
          onUpdate: () => {
            const currentY = window.scrollY;
            const isScrollingDown =
              currentY > lastScrollY && currentY > hideThreshold;
            lastScrollY = currentY;

            if (!navRef.current) return;

            const currentlyMobile = window.innerWidth <= 768;

            if (isScrollingDown && !currentlyMobile) {
              // Slide navbar out upward
              gsap.to(navRef.current, {
                yPercent: -110,
                duration: 0.4,
                ease: 'power2.inOut',
                overwrite: true,
              });
            } else {
              // Slide navbar back in (or keep it visible on mobile)
              gsap.to(navRef.current, {
                yPercent: 0,
                duration: currentlyMobile ? 0.3 : 0.5,
                ease: 'power3.out',
                overwrite: true,
              });
            }
          },
        });

        // Initial entrance animation - drops in smoothly right as loader finishes
        gsap.from(navRef.current, {
          y: -60,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      }, 3000);

      return () => clearTimeout(timer);
    },
    navRef,
    [],
  );

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      lenis?.scrollTo(href, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 py-6 bg-background/80 backdrop-blur-sm cursor-pointer lg:cursor-pointer ${
        isHalloween ? 'border-b border-[#FF7518]/35' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:grid lg:grid-cols-[auto_1fr_auto] items-center lg:gap-4 w-full relative">
        {/* Comic Edition Brand Plate (Desktop Left, 2xl+ or aligned cleanly in grid) */}
        <div className="hidden lg:flex items-center shrink-0">
          {isComic && (
            <span className="hidden xl:inline-flex comic-badge-dark text-[9px] px-2.5 py-1 tracking-widest select-none">
              <span className="text-[#D9B45B]">◆</span>
              <span>VARA PRESS</span>
            </span>
          )}
        </div>

        {/* Desktop Navbar (Hidden on Mobile, Flexbox Grid Center — Zero Overlap) */}
        <div className="hidden lg:flex items-center justify-center gap-0 cursor-pointer min-w-0">
          {links.map((link, i) => (
            <span key={link.href} className="flex items-center shrink-0">
              <a
                href={link.href}
                className={`nav-link px-2 xl:px-3 py-1 active:opacity-50 transition-all whitespace-nowrap ${
                  isHalloween ? 'hover:text-[#FF7518]' : ''
                }`}
                onClick={(e) => {
                  playClick();
                  handleScroll(e, link.href);
                }}
                onMouseEnter={playHover}
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
                <span
                  className={`font-bold mx-0.5 xl:mx-1 text-xs select-none ${
                    isComic
                      ? 'text-[#888888]'
                      : isHalloween
                        ? 'text-[#FF7518]/65'
                        : 'text-foreground/60'
                  }`}
                >
                  |
                </span>
              )}
            </span>
          ))}
        </div>

        {/* Desktop Toggles (Compact 2-Control Cluster: Theme + Preferences) */}
        <div className="hidden lg:flex items-center justify-end shrink-0">
          <div className="flex gap-2 items-center">
            <ThemeSelector />
            <PreferencesPopover />
          </div>
        </div>

        {/* Mobile Header (Menu Left, 2 Crisp Controls Right) */}
        <div className="lg:hidden flex justify-between w-full items-center">
          <button
            onClick={() => {
              playClick();
              setOpen(!open);
            }}
            onMouseEnter={playHover}
            className="nav-link active:scale-95 transition-transform"
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {open ? '[ Close ]' : '[ Menu ]'}
          </button>
          <div className="flex gap-2 items-center">
            <ThemeSelector />
            <PreferencesPopover />
          </div>
        </div>

        {/* Mobile menu (Centered Links) */}
        {open && (
          <div
            id="mobile-nav-menu"
            role="navigation"
            className="lg:hidden flex flex-col items-center justify-center w-full gap-6 mt-12 animate-in fade-in slide-in-from-top-4 duration-300"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link text-sm tracking-[0.3em] active:scale-95 transition-all ${
                  isHalloween ? 'hover:text-[#FF7518]' : ''
                }`}
                onClick={(e) => {
                  playClick();
                  setOpen(false);
                  handleScroll(e, link.href);
                }}
                onMouseEnter={playHover}
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
