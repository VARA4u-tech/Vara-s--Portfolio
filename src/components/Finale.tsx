import { PROFILE, SOCIAL_LINKS } from '@/data/constants';
import {
  Github,
  Linkedin,
  Instagram as InstagramIcon,
  BookOpen,
  Mail,
  Heart,
  Twitter,
} from 'lucide-react';
import { useHalloween, useComic } from '@/context/ThemeContext';
import JackOLantern from './halloween/JackOLantern';
import GraveyardTrees from './halloween/GraveyardTrees';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  instagram: InstagramIcon,
  blog: BookOpen,
  email: Mail,
  x: Twitter,
};

const Finale = () => {
  const currentYear = new Date().getFullYear();
  const { isHalloween } = useHalloween();
  const { isComic } = useComic();

  const baseMarquee = [
    `${PROFILE.shortName} 🚀`,
    'Full Stack Dev | Supabase | React | Blockchain | AI',
    'Designing clean UI/UX + Smart solutions🔖',
    'Exploring tech through Vibe Coding',
  ];

  const comicMarquee = [
    'VOL. 01 // TO BE CONTINUED',
    `${PROFILE.shortName.toUpperCase()} — FULL STACK & AI`,
    'NOIR COMIC PRESS // PRECISION ENGINEERING',
    'CRAFTED IN DEEP BLACK, WHITE & GOLD',
  ];

  const marqueeTags = isComic
    ? comicMarquee
    : isHalloween
      ? [
          '🎃 HAPPY HALLOWEEN 🎃',
          ...baseMarquee,
          'TRICK OR TREAT // CODE & DESIGN 👻',
        ]
      : baseMarquee;

  return (
    <section
      id="finale"
      className="relative w-full bg-white border-t-8 border-black pt-20 overflow-hidden"
    >
      {/* Marquee — 2 copies for seamless -50% translate loop */}
      <div
        className={`absolute top-0 left-0 w-full py-4 overflow-hidden flex whitespace-nowrap ${
          isComic
            ? 'bg-[#171717] border-b border-[#888888]/60'
            : isHalloween
              ? 'bg-black border-b-2 border-[#FF7518]'
              : 'bg-black'
        }`}
      >
        <div className="animate-marquee flex items-center shrink-0">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center">
              {marqueeTags.map((tag, idx) => (
                <span
                  key={`${copy}-${idx}`}
                  className={`font-mono text-xs uppercase tracking-[0.3em] mx-10 ${
                    isComic
                      ? idx === 0
                        ? 'text-[#D9B45B] font-black'
                        : 'text-[#D9D9D9] font-bold'
                      : tag.includes('🎃')
                        ? 'text-[#FF7518] font-bold'
                        : 'text-white'
                  }`}
                >
                  {isComic && idx === 0 && (
                    <span className="text-[#FFFFFF] mr-2">◆</span>
                  )}
                  {tag}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full">
        <GraveyardTrees variant="finale" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex flex-col items-center">
          <div className="relative mb-20 text-center">
            <h2
              className={`text-[12vw] md:text-[8vw] font-black uppercase leading-none tracking-tighter absolute -top-1/2 left-1/2 -translate-x-1/2 select-none pointer-events-none whitespace-nowrap ${
                isComic ? 'text-[#888888]/10' : 'text-black/5'
              }`}
            >
              {isComic
                ? 'VOL. 01 // FIN.'
                : isHalloween
                  ? 'BOO & THANKS'
                  : 'THANK YOU'}
            </h2>
            <p
              className={`text-xl md:text-3xl font-black uppercase tracking-tight italic z-10 relative ${
                isComic ? 'text-[#FFFFFF]' : ''
              }`}
            >
              Let's build something{' '}
              <span
                className={`px-4 py-1 not-italic rounded-none tracking-normal ${
                  isComic
                    ? 'bg-[#D9B45B] text-[#171717] border-2 border-[#FFFFFF] shadow-[4px_4px_0px_#B58B32]'
                    : isHalloween
                      ? 'text-[#FF7518] bg-black'
                      : 'text-white bg-black'
                }`}
              >
                unforgettable
              </span>{' '}
              together.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-20">
            {SOCIAL_LINKS.map((link) => {
              const Icon = ICON_MAP[link.id];
              if (!Icon) return null;

              return (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className={`group flex flex-col items-center justify-center p-8 border-2 transition-all duration-200 rounded-none ${
                    isComic
                      ? 'comic-panel-white hover:!bg-[#D9B45B] hover:!border-[#171717]'
                      : isHalloween
                        ? 'border-black bg-white hover:bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:border-[#FF7518]'
                        : 'border-black bg-white hover:bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]'
                  }`}
                >
                  <Icon
                    className={`w-8 h-8 transition-colors duration-200 ${
                      isComic
                        ? 'text-[#171717]'
                        : isHalloween
                          ? 'group-hover:text-[#FF7518]'
                          : 'group-hover:text-white'
                    }`}
                  />
                  <span
                    className={`mt-4 font-mono text-xs uppercase tracking-widest font-black transition-colors duration-200 ${
                      isComic ? 'text-[#171717]' : 'group-hover:text-white'
                    }`}
                  >
                    {link.label}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Clean Archival Colophon Stamp in Comic Mode */}
          {isComic && (
            <div className="mb-10 comic-badge-concrete px-4 py-2 text-center select-none">
              <span className="text-[#B58B32]">◆</span>
              <span className="text-[9px] tracking-widest">
                PRESS ARCHIVE // EDITION 01 — VERIFIED PRODUCTION BUILD
              </span>
              <span className="text-[#B58B32]">◆</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center gap-4 text-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 border-2 rounded-none transition-all ${
                isComic
                  ? 'bg-[#171717] border-[#D9D9D9] shadow-[3px_3px_0px_#B58B32]'
                  : isHalloween
                    ? 'bg-[#FF7518]/10 border-[#FF7518]'
                    : 'bg-green-100 border-green-600'
              }`}
            >
              {isComic ? (
                <span className="inline-block w-2 h-2 bg-[#D9B45B] mr-1" />
              ) : isHalloween ? (
                <JackOLantern size={20} interactive={true} />
              ) : (
                <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-none mr-1.5 animate-pulse" />
              )}
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${
                  isComic
                    ? 'text-[#FFFFFF]'
                    : isHalloween
                      ? 'text-[#FF7518]'
                      : 'text-green-800'
                }`}
              >
                {isComic
                  ? 'Available For New Commissions'
                  : 'Available for Freelance Projects'}
              </span>
            </div>
            <p
              className={`text-xs font-mono uppercase tracking-widest leading-loose max-w-sm ${
                isComic ? 'text-[#888888]' : 'text-black/70'
              }`}
            >
              Driving Digital Innovation &amp; Building Scalable Tech Products
              🌍
            </p>
          </div>
        </div>
      </div>

      {/* Extreme Bottom Bar */}
      <div
        id="footer-divider"
        className={`w-full pt-10 pb-24 md:pb-10 px-6 mt-auto border-t relative ${
          isComic
            ? 'bg-[#171717] border-t-2 border-[#B58B32]'
            : 'bg-white border-black/10'
        }`}
      >
        <div
          className={`max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 ${
            isComic ? 'text-[#D9D9D9]' : 'opacity-70'
          }`}
        >
          <p
            className={`text-[10px] md:text-[11px] font-mono uppercase tracking-[0.1em] md:tracking-[0.2em] text-center md:text-left ${
              isComic ? 'text-[#D9D9D9] font-medium' : 'text-black'
            }`}
          >
            © {currentYear} {PROFILE.name}{' '}
            {isComic ? (
              <span className="text-[#D9B45B] font-bold">
                • Retro Comic Press Edition
              </span>
            ) : isHalloween ? (
              '• 🎃 Spooky Edition'
            ) : (
              ''
            )}
          </p>
          <div
            className={`flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] md:text-[11px] font-mono uppercase tracking-[0.1em] md:tracking-[0.2em] text-center md:text-right font-medium ${
              isComic ? 'text-[#D9D9D9]' : 'text-black'
            }`}
          >
            <span className="whitespace-nowrap">Designed &amp; Engineered</span>
            <span className="flex items-center gap-2">
              <span>with</span>
              <Heart
                className={`w-3.5 h-3.5 inline-block ${
                  isComic
                    ? 'text-[#D9B45B] fill-[#D9B45B]'
                    : isHalloween
                      ? 'text-[#FF7518] fill-[#FF7518]'
                      : 'text-black fill-black animate-heartbeat'
                }`}
              />
              <span>by {PROFILE.alias}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Finale;
