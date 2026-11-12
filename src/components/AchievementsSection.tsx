import { useState } from 'react';
import SectionBlock from './SectionBlock';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ArrowUpRight, Award } from 'lucide-react';
import { useComic, useHalloween } from '@/context/ThemeContext';
import { playClick, playHover } from '@/hooks/useSoundEffects';

type Category = 'All' | 'Hackathon' | 'Bootcamp' | 'Workshop' | 'Internship';

const achievements: {
  title: string;
  issuer: string;
  date: string;
  description: string;
  image: string;
  category: Exclude<Category, 'All'>;
  tag: string;
}[] = [
  {
    title: 'ChatGPT Codex India Hackathon 2026',
    issuer: 'BlockseBlock',
    date: 'AUG 2026',
    description:
      'Participated in the ChatGPT Codex India Hackathon 2026, building agentic applications utilizing OpenAI Codex for advanced AI workflows.',
    image:
      'https://res.cloudinary.com/dqi1epget/image/upload/v1787065010/Screenshot_2026-08-18_202615_fedqbc.png',
    category: 'Hackathon',
    tag: 'National Level',
  },
  {
    title: 'How Software Teams Actually Work',
    issuer: 'Frontlines EduTech (FLM)',
    date: 'MAY 2026',
    description:
      'Actively participated in the "How Software Teams Actually Work" session organized by Frontlines EduTech Private Limited, learning about agile workflows, team collaboration, and industry software development practices.',
    image:
      'https://res.cloudinary.com/dqi1epget/image/upload/v1779377800/WhatsApp_Image_2026-05-21_at_9.05.51_PM_etr9z3.jpg',
    category: 'Workshop',
    tag: 'Industry Skills',
  },
  {
    title: 'Innovate Andhra Hackathon 2025 (Data & AI)',
    issuer: 'Academy of Tech Masters',
    date: 'DEC 2025',
    description:
      'Participated in the Innovate Andhra Hackathon 2025 (Data & AI) held at Academy Of Tech Masters, showcasing strong innovation, problem-solving, and teamwork skills in building data-driven AI solutions.',
    image:
      'https://res.cloudinary.com/dqi1epget/image/upload/v1777568671/ChatGPT_Image_Apr_30_2026_10_34_14_PM_g4hcev.png',
    category: 'Hackathon',
    tag: 'National Level',
  },
  {
    title: 'Machine Learning & LLMs Webinar',
    issuer: 'GUVI | HCL',
    date: 'OCT 2025',
    description:
      'Participated in the "Step into Machine Learning – From Foundations to Deep Learning and LLMs" webinar organized by GUVI and HCL, gaining valuable insights into advanced AI and machine learning concepts.',
    image:
      'https://res.cloudinary.com/dqi1epget/image/upload/v1777567637/WhatsApp_Image_2026-04-30_at_10.08.49_PM_ambhw8.jpg',
    category: 'Workshop',
    tag: 'AI / ML',
  },
  {
    title: 'Winter School on Decentralised Trust & Blockchains',
    issuer: 'IIT Madras (CyStar)',
    date: 'SEP 2025',
    description:
      'Successfully completed the Online Phase of the Winter School on Decentralised Trust and Blockchains 2025 organized by the Centre for Cybersecurity, Trust and Reliability (CyStar), IIT Madras.',
    image:
      'https://res.cloudinary.com/dqi1epget/image/upload/v1777567622/CODE25CEP133331087_blqiix.jpg',
    category: 'Workshop',
    tag: 'IIT Madras',
  },
  {
    title: 'Rise In & Build On Aptos Bootcamp',
    issuer: 'Rise in Aptos',
    date: 'AUG 2025',
    description:
      'Successfully graduated from the Rise In & Build On Aptos Bootcamp, demonstrating proficiency in Aptos blockchain development and building decentralized applications.',
    image:
      'https://res.cloudinary.com/dqi1epget/image/upload/v1777568814/ChatGPT_Image_Apr_30_2026_10_36_44_PM_pzo6dn.png',
    category: 'Bootcamp',
    tag: 'Blockchain',
  },
  {
    title: 'CODE SPARK India 2025',
    issuer: 'KBN College (Autonomous)',
    date: 'AUG 2025',
    description:
      'Participated in "CODE SPARK INDIA 2025", a two-day National-Level Coding and Innovation Hackathon. Demonstrated dedication, problem-solving abilities, and technical excellence in software development.',
    image:
      'https://res.cloudinary.com/dqi1epget/image/upload/v1777568705/ChatGPT_Image_Apr_30_2026_10_34_37_PM_hlgdqz.png',
    category: 'Hackathon',
    tag: '2-Day Event',
  },
  {
    title: 'Generative AI & Prompt Engineering Certificate',
    issuer: 'Blackbuck Engineers',
    date: 'MAY – JUL 2025',
    description:
      'Completed a 120-hour Short-Term Internship program focusing on ChatGPT, Prompt Engineering, and Generative AI. Developed expertise in designing structured prompt templates, leveraging Large Language Models, and integrating Generative AI workflows into application development.',
    image:
      'https://res.cloudinary.com/dqi1epget/image/upload/v1779377183/blackbucks_chrnv6.png',
    category: 'Internship',
    tag: '120 Hours',
  },
];

const CATEGORIES: Category[] = [
  'All',
  'Hackathon',
  'Bootcamp',
  'Workshop',
  'Internship',
];

const AchievementsSection = () => {
  const { isComic } = useComic();
  const { isHalloween } = useHalloween();
  const [active, setActive] = useState<Category>('All');

  const filtered =
    active === 'All'
      ? achievements
      : achievements.filter((a) => a.category === active);

  return (
    <SectionBlock id="achievements" title="Achievements">
      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div
        className={`mb-8 pb-6 border-b-2 space-y-4 ${
          isComic ? 'border-[#888888]/50' : 'border-black/10'
        }`}
      >
        {/* Stats row */}
        <div className="flex items-center gap-3">
          <Award
            className={`w-4 h-4 shrink-0 ${
              isComic ? 'text-[#D9B45B]' : isHalloween ? 'text-[#FF7518]' : ''
            }`}
          />
          <span
            className={`font-mono text-xs sm:text-sm font-bold tracking-widest uppercase ${
              isComic ? 'text-[#FFFFFF]' : ''
            }`}
          >
            {achievements.length} Certificates
          </span>
          <span
            className={`font-mono text-xs ${
              isComic ? 'text-[#888888]' : 'text-foreground/40'
            }`}
          >
            / {filtered.length} shown
          </span>
        </div>

        {/* Filter pills — horizontally scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playClick();
                setActive(cat);
              }}
              onMouseEnter={playHover}
              className={`font-mono text-[10px] sm:text-[11px] tracking-widest uppercase px-3 sm:px-4 py-1.5 border-2 transition-all duration-200 whitespace-nowrap shrink-0 ${
                active === cat
                  ? isComic
                    ? 'bg-[#D9B45B] text-[#171717] font-black border-[#FFFFFF] shadow-[3px_3px_0px_#B58B32]'
                    : isHalloween
                      ? 'bg-black text-[#FF7518] font-black border-[#FF7518] shadow-[3px_3px_0px_0px_#FF7518]'
                      : 'bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.25)]'
                  : isComic
                    ? 'bg-[#171717] text-[#D9D9D9] border-[#888888] hover:border-[#D9B45B] hover:text-[#FFFFFF] hover:shadow-[3px_3px_0px_#B58B32]'
                    : isHalloween
                      ? 'bg-transparent text-foreground border-black/30 hover:border-[#FF7518] hover:text-[#FF7518] hover:shadow-[3px_3px_0px_0px_#FF7518]'
                      : 'bg-transparent text-foreground border-black/25 hover:border-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Awwwards / Press List ───────────────────────────────── */}
      <div
        className={`border-t-2 ${
          isComic ? 'border-[#888888]' : 'border-black'
        }`}
      >
        {filtered.map((item, idx) => (
          <Dialog key={item.title}>
            <DialogTrigger asChild>
              {/* ── Row wrapper */}
              <div
                role="button"
                tabIndex={0}
                onClick={playClick}
                onMouseEnter={playHover}
                aria-label={`View certificate: ${item.title}`}
                className={`group relative border-b-2 cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  isComic
                    ? 'border-[#888888] focus-visible:ring-[#D9B45B]'
                    : isHalloween
                      ? 'border-black hover:border-[#FF7518] focus-visible:ring-[#FF7518]'
                      : 'border-black focus-visible:ring-black'
                }`}
              >
                {/* ── Hover slide fill (desktop only) */}
                <div
                  className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-[480ms] ease-[cubic-bezier(0.76,0,0.24,1)] pointer-events-none hidden sm:block ${
                    isComic ? 'bg-[#FFFFFF]' : 'bg-black'
                  }`}
                  aria-hidden="true"
                />

                {/* ── Thumbnail slides in from right on desktop hover */}
                <div
                  className="absolute top-0 right-0 h-full w-44 lg:w-56 z-10 overflow-hidden pointer-events-none
                              translate-x-full group-hover:translate-x-0
                              transition-transform duration-[480ms] ease-[cubic-bezier(0.76,0,0.24,1)]
                              hidden sm:block"
                  aria-hidden="true"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  <div
                    className={`absolute inset-0 ${
                      isComic ? 'bg-[#171717]/20' : 'bg-black/50'
                    }`}
                  />
                  <div
                    className={`absolute left-0 top-0 h-full border-l-4 ${
                      isComic
                        ? 'border-[#D9B45B]'
                        : isHalloween
                          ? 'border-[#FF7518]'
                          : 'border-black'
                    }`}
                  />
                </div>

                {/* ═══════════════════════════════════
                    MOBILE layout (< sm)
                    Small thumbnail always visible + stacked text
                ════════════════════════════════════ */}
                <div
                  className={`flex sm:hidden items-start gap-3 px-4 py-4 transition-colors ${
                    isComic ? 'active:bg-[#D9D9D9]/10' : 'active:bg-black/5'
                  }`}
                >
                  {/* Thumbnail */}
                  <div
                    className={`w-16 h-16 shrink-0 overflow-hidden border-2 ${
                      isComic ? 'border-[#D9D9D9]' : 'border-black/20'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>

                  {/* Text block */}
                  <div className="flex-1 min-w-0">
                    {/* Category + date on same line */}
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span
                        className={`text-[9px] font-mono font-black px-1.5 py-0.5 leading-none ${
                          isComic
                            ? 'bg-[#D9B45B] text-[#171717]'
                            : 'bg-black text-white'
                        }`}
                      >
                        {item.category.toUpperCase()}
                      </span>
                      <span
                        className={`font-mono text-[9px] tracking-widest uppercase ${
                          isComic ? 'text-[#888888]' : 'text-foreground/40'
                        }`}
                      >
                        {item.date}
                      </span>
                    </div>
                    <h3
                      className={`font-black text-sm leading-snug tracking-tight mb-0.5 line-clamp-2 ${
                        isComic ? 'text-[#FFFFFF]' : ''
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`font-mono text-[10px] line-clamp-1 ${
                        isComic ? 'text-[#D9D9D9]' : 'text-foreground/50'
                      }`}
                    >
                      {item.issuer}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowUpRight
                    className={`w-4 h-4 mt-1 shrink-0 ${
                      isComic ? 'text-[#D9B45B]' : 'text-foreground/25'
                    }`}
                  />
                </div>

                {/* ═══════════════════════════════════
                    TABLET / DESKTOP layout (≥ sm)
                    Full awwwards row
                ════════════════════════════════════ */}
                <div className="hidden sm:flex items-center gap-4 lg:gap-6 px-6 lg:px-8 py-5 lg:py-6 pr-[12rem] lg:pr-[15rem] relative z-20 transition-colors duration-[480ms]">
                  {/* Index */}
                  <span
                    className={`font-mono text-xs font-bold transition-colors duration-300 w-6 shrink-0 select-none ${
                      isComic
                        ? 'text-[#D9B45B] group-hover:text-[#171717]'
                        : 'text-foreground/25 group-hover:text-white/30'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* Category pill */}
                  <span
                    className={`text-[10px] font-mono font-black px-2 py-1 shrink-0 leading-none transition-colors duration-300 ${
                      isComic
                        ? 'bg-[#D9D9D9] text-[#171717] group-hover:bg-[#D9B45B]'
                        : isHalloween
                          ? 'bg-black text-white group-hover:bg-[#FF7518] group-hover:text-black'
                          : 'bg-black text-white'
                    }`}
                  >
                    {item.category.toUpperCase()}
                  </span>

                  {/* Title + issuer */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-black text-base lg:text-lg leading-tight tracking-tight transition-colors duration-300 line-clamp-1 ${
                        isComic
                          ? 'text-[#FFFFFF] group-hover:text-[#171717]'
                          : 'group-hover:text-white'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`font-mono text-xs transition-colors duration-300 mt-0.5 ${
                        isComic
                          ? 'text-[#D9D9D9] group-hover:text-[#888888]'
                          : 'text-foreground/50 group-hover:text-white/50'
                      }`}
                    >
                      {item.issuer}
                    </p>
                  </div>

                  {/* Tag chip — desktop only */}
                  <span
                    className={`hidden lg:inline-block font-mono text-[10px] border px-2 py-1 transition-colors duration-300 shrink-0 ${
                      isComic
                        ? 'border-[#888888] text-[#D9D9D9] group-hover:border-[#171717] group-hover:text-[#171717]'
                        : 'border-black/20 group-hover:border-white/30 text-foreground/50 group-hover:text-white/50'
                    }`}
                  >
                    {item.tag}
                  </span>

                  {/* Date */}
                  <span
                    className={`font-mono text-[10px] tracking-widest uppercase transition-colors duration-300 shrink-0 ${
                      isComic
                        ? 'text-[#888888] group-hover:text-[#171717]'
                        : 'text-foreground/35 group-hover:text-white/40'
                    }`}
                  >
                    {item.date}
                  </span>

                  {/* Arrow */}
                  <ArrowUpRight
                    className={`w-5 h-5 group-hover:rotate-12 transition-all duration-300 shrink-0 ${
                      isComic
                        ? 'text-[#D9B45B] group-hover:text-[#171717]'
                        : isHalloween
                          ? 'text-foreground/35 group-hover:text-[#FF7518]'
                          : 'text-foreground/25 group-hover:text-white'
                    }`}
                  />
                </div>
              </div>
            </DialogTrigger>

            {/* ── Lightbox ─────────────────────────────────────────── */}
            <DialogContent
              className={`w-[95vw] max-w-5xl p-0 rounded-none overflow-hidden max-h-[90vh] overflow-y-auto ${
                isComic
                  ? 'border-2 sm:border-4 border-[#171717] bg-[#FFFFFF] text-[#171717] shadow-[8px_8px_0px_0px_#B58B32] sm:shadow-[16px_16px_0px_0px_#D9B45B]'
                  : isHalloween
                    ? 'border-2 sm:border-4 border-black bg-white shadow-[8px_8px_0px_0px_#FF7518] sm:shadow-[16px_16px_0px_0px_#FF7518]'
                    : 'border-2 sm:border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.6)] sm:shadow-[20px_20px_0px_0px_rgba(0,0,0,0.85)]'
              }`}
            >
              <DialogTitle className="sr-only">{item.title}</DialogTitle>
              <DialogDescription className="sr-only">
                {item.issuer} — {item.category}
              </DialogDescription>

              {/* Stacks vertically on mobile, side-by-side on md+ */}
              <div className="flex flex-col md:flex-row h-full">
                {/* Image panel */}
                <div
                  className={`flex-1 flex items-center justify-center p-3 sm:p-4 min-h-[200px] sm:min-h-[45vh] ${
                    isComic ? 'bg-[#D9D9D9]' : 'bg-black/5'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto max-h-[50vh] sm:max-h-[72vh] object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Details sidebar */}
                <div
                  className={`md:w-72 p-4 sm:p-6 border-t-2 md:border-t-0 md:border-l-4 flex flex-col justify-between bg-[#FFFFFF] ${
                    isComic ? 'border-[#171717] text-[#171717]' : 'border-black'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-[10px] font-mono font-black px-2 py-1 ${
                          isComic
                            ? 'bg-[#D9B45B] text-[#171717] border border-[#171717]'
                            : isHalloween
                              ? 'bg-black text-[#FF7518] border border-[#FF7518]'
                              : 'bg-black text-white'
                        }`}
                      >
                        {item.category.toUpperCase()}
                      </span>
                      <span
                        className={`font-mono text-xs font-bold ${
                          isComic ? 'text-[#888888]' : 'text-foreground/30'
                        }`}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h2 className="font-black text-lg sm:text-xl leading-tight mb-2 tracking-tight text-[#171717]">
                      {item.title}
                    </h2>
                    <p
                      className={`font-mono text-sm font-semibold mb-1 ${
                        isComic ? 'text-[#171717]' : 'text-foreground/70'
                      }`}
                    >
                      {item.issuer}
                    </p>
                    <p
                      className={`font-mono text-xs tracking-widest uppercase mb-4 sm:mb-6 ${
                        isComic
                          ? 'text-[#B58B32] font-bold'
                          : isHalloween
                            ? 'text-[#FF7518] font-bold'
                            : 'text-foreground/35'
                      }`}
                    >
                      {item.date}
                    </p>
                    <p
                      className={`text-sm leading-relaxed ${
                        isComic ? 'text-[#171717]/85' : 'text-foreground/65'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  <div
                    className={`mt-4 sm:mt-6 pt-4 border-t-2 flex items-center justify-between ${
                      isComic ? 'border-[#D9D9D9]' : 'border-black/10'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs px-3 py-1.5 inline-block font-bold tracking-wider ${
                        isComic
                          ? 'bg-[#171717] text-[#D9B45B]'
                          : 'bg-black text-white'
                      }`}
                    >
                      {item.tag}
                    </span>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-widest ${
                        isComic ? 'text-[#888888]' : 'text-foreground/30'
                      }`}
                    >
                      Certificate
                    </span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {/* ── Empty state */}
      {filtered.length === 0 && (
        <div
          className={`flex flex-col items-center justify-center py-16 sm:py-24 border-b-2 ${
            isComic
              ? 'border-[#888888] text-[#888888]'
              : 'border-black text-foreground/30'
          }`}
        >
          <Award className="w-10 h-10 mb-3 opacity-20" />
          <p className="font-mono text-sm">No certificates in this category</p>
        </div>
      )}
    </SectionBlock>
  );
};

export default AchievementsSection;
