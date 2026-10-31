import {
  Github,
  Linkedin,
  InstagramIcon,
  Mail,
  Heart,
  BookOpen,
  Twitter,
} from 'lucide-react';
import { PROFILE, SOCIAL_LINKS } from '@/data/constants';
import { useHalloween } from './halloween/HalloweenContext';
import JackOLantern from './halloween/JackOLantern';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  instagram: InstagramIcon,
  blog: BookOpen,
  x: Twitter,
};

const Finale = () => {
  const currentYear = new Date().getFullYear();
  const { isHalloween } = useHalloween();

  const baseMarquee = [
    `${PROFILE.shortName} 🚀`,
    'Full Stack Dev | Supabase | React | Blockchain | AI',
    'Designing clean UI/UX + Smart solutions🔖',
    'Exploring tech through Vibe Coding',
  ];

  const marqueeTags = isHalloween
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
      {/* Marquee — 2 copies of the tag list is all that's needed for a
          seamless -50% translate loop; more copies just waste DOM nodes */}
      <div className="absolute top-0 left-0 w-full py-4 bg-black overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee flex items-center shrink-0">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center">
              {marqueeTags.map((tag) => (
                <span
                  key={tag}
                  className={`font-mono text-xs uppercase tracking-[0.3em] mx-10 ${
                    tag.includes('🎃')
                      ? 'text-[#FF7518] font-bold'
                      : 'text-white'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center">
        <div className="relative mb-20 text-center">
          <h2 className="text-[12vw] md:text-[8vw] font-black uppercase leading-none tracking-tighter text-black/5 absolute -top-1/2 left-1/2 -translate-x-1/2 select-none pointer-events-none">
            {isHalloween ? 'BOO & THANKS' : 'THANK YOU'}
          </h2>
          <p className="text-xl md:text-3xl font-black uppercase tracking-tight italic z-10 relative">
            Let's build something{' '}
            <span
              className={`text-white bg-black px-4 py-1 not-italic rounded-none tracking-normal ${
                isHalloween ? 'text-[#FF7518]' : ''
              }`}
            >
              unforgettable
            </span>{' '}
            together.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-24">
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
                className={`group flex flex-col items-center justify-center p-8 border-2 border-black bg-white hover:bg-black transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] rounded-none ${
                  isHalloween ? 'hover:border-[#FF7518]' : ''
                }`}
              >
                <Icon
                  className={`w-8 h-8 group-hover:text-white transition-colors duration-300 ${
                    isHalloween ? 'group-hover:text-[#FF7518]' : ''
                  }`}
                />
                <span className="mt-4 font-mono text-xs uppercase tracking-widest font-black group-hover:text-white">
                  {link.label}
                </span>
              </a>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 text-center">
          <div
            className={`flex items-center gap-2 px-4 py-2 border-2 rounded-none transition-all ${
              isHalloween
                ? 'bg-[#FF7518]/10 border-[#FF7518]'
                : 'bg-green-100 border-green-600'
            }`}
          >
            {isHalloween ? (
              <JackOLantern size={20} interactive={true} />
            ) : (
              <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-none mr-1.5 animate-pulse" />
            )}
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${
                isHalloween ? 'text-[#FF7518]' : 'text-green-800'
              }`}
            >
              Available for Freelance Projects
            </span>
          </div>
          <p className="text-xs font-mono text-black/70 uppercase tracking-widest leading-loose max-w-sm">
            Driving Digital Innovation & Building Scalable Tech Products 🌍
          </p>
        </div>
      </div>

      {/* Extreme Bottom Bar */}
      <div
        id="footer-divider"
        className="w-full bg-white pt-10 pb-24 md:pb-10 px-6 mt-auto border-t border-black/10 relative"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 opacity-70">
          <p className="text-[10px] md:text-[11px] font-mono text-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-center md:text-left">
            © {currentYear} {PROFILE.name}{' '}
            {isHalloween && '• 🎃 Spooky Edition'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] md:text-[11px] font-mono text-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-center md:text-right font-medium">
            <span className="whitespace-nowrap">Designed & Engineered</span>
            <span className="flex items-center gap-2">
              <span>with</span>
              <Heart
                className={`w-3.5 h-3.5 inline-block ${
                  isHalloween
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
