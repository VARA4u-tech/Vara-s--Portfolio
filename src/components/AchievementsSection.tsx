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
    title: 'How Software Teams Actually Work',
    issuer: 'Frontlines EduTech (FLM)',
    date: 'MAY 2026',
    description:
      'Actively participated in the "How Software Teams Actually Work" session organized by Frontlines EduTech Private Limited, learning about agile workflows, team collaboration, and industry software development practices.',
    image: 'https://res.cloudinary.com/dqi1epget/image/upload/v1779377800/WhatsApp_Image_2026-05-21_at_9.05.51_PM_etr9z3.jpg',
    category: 'Workshop',
    tag: 'Industry Skills',
  },
  {
    title: 'Innovate Andhra Hackathon 2025 (Data & AI)',
    issuer: 'Academy of Tech Masters',
    date: 'DEC 2025',
    description:
      'Participated in the Innovate Andhra Hackathon 2025 (Data & AI) held at Academy Of Tech Masters, showcasing strong innovation, problem-solving, and teamwork skills in building data-driven AI solutions.',
    image: 'https://res.cloudinary.com/dqi1epget/image/upload/v1777568671/ChatGPT_Image_Apr_30_2026_10_34_14_PM_g4hcev.png',
    category: 'Hackathon',
    tag: 'National Level',
  },
  {
    title: 'Machine Learning & LLMs Webinar',
    issuer: 'GUVI | HCL',
    date: 'OCT 2025',
    description:
      'Participated in the "Step into Machine Learning – From Foundations to Deep Learning and LLMs" webinar organized by GUVI and HCL, gaining valuable insights into advanced AI and machine learning concepts.',
    image: 'https://res.cloudinary.com/dqi1epget/image/upload/v1777567637/WhatsApp_Image_2026-04-30_at_10.08.49_PM_ambhw8.jpg',
    category: 'Workshop',
    tag: 'AI / ML',
  },
  {
    title: 'Winter School on Decentralised Trust & Blockchains',
    issuer: 'IIT Madras (CyStar)',
    date: 'SEP 2025',
    description:
      'Successfully completed the Online Phase of the Winter School on Decentralised Trust and Blockchains 2025 organized by the Centre for Cybersecurity, Trust and Reliability (CyStar), IIT Madras.',
    image: 'https://res.cloudinary.com/dqi1epget/image/upload/v1777567622/CODE25CEP133331087_blqiix.jpg',
    category: 'Workshop',
    tag: 'IIT Madras',
  },
  {
    title: 'Rise In & Build On Aptos Bootcamp',
    issuer: 'Rise in Aptos',
    date: 'AUG 2025',
    description:
      'Successfully graduated from the Rise In & Build On Aptos Bootcamp, demonstrating proficiency in Aptos blockchain development and building decentralized applications.',
    image: 'https://res.cloudinary.com/dqi1epget/image/upload/v1777568814/ChatGPT_Image_Apr_30_2026_10_36_44_PM_pzo6dn.png',
    category: 'Bootcamp',
    tag: 'Blockchain',
  },
  {
    title: 'CODE SPARK India 2025',
    issuer: 'KBN College (Autonomous)',
    date: 'AUG 2025',
    description:
      'Participated in "CODE SPARK INDIA 2025", a two-day National-Level Coding and Innovation Hackathon. Demonstrated dedication, problem-solving abilities, and technical excellence in software development.',
    image: 'https://res.cloudinary.com/dqi1epget/image/upload/v1777568705/ChatGPT_Image_Apr_30_2026_10_34_37_PM_hlgdqz.png',
    category: 'Hackathon',
    tag: '2-Day Event',
  },
  {
    title: 'Generative AI & Prompt Engineering Certificate',
    issuer: 'Blackbuck Engineers',
    date: 'MAY – JUL 2025',
    description:
      'Completed a 120-hour Short-Term Internship program focusing on ChatGPT, Prompt Engineering, and Generative AI. Developed expertise in designing structured prompt templates, leveraging Large Language Models, and integrating Generative AI workflows into application development.',
    image: 'https://res.cloudinary.com/dqi1epget/image/upload/v1779377183/blackbucks_chrnv6.png',
    category: 'Internship',
    tag: '120 Hours',
  },
];

const CATEGORIES: Category[] = ['All', 'Hackathon', 'Bootcamp', 'Workshop', 'Internship'];

const categoryAccent: Record<Exclude<Category, 'All'>, string> = {
  Hackathon: 'bg-orange-400 text-black',
  Bootcamp:  'bg-violet-500 text-white',
  Workshop:  'bg-sky-400 text-black',
  Internship:'bg-emerald-400 text-black',
};

const categoryBorder: Record<Exclude<Category, 'All'>, string> = {
  Hackathon: 'border-orange-400',
  Bootcamp:  'border-violet-500',
  Workshop:  'border-sky-400',
  Internship:'border-emerald-400',
};

const AchievementsSection = () => {
  const [active, setActive]   = useState<Category>('All');
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered =
    active === 'All' ? achievements : achievements.filter((a) => a.category === active);

  return (
    <SectionBlock id="achievements" title="Achievements">

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b-2 border-black/10">
        {/* Stats */}
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5" />
          <span className="font-mono text-sm font-bold tracking-widest uppercase">
            {achievements.length} Certificates
          </span>
          <span className="font-mono text-xs text-foreground/40">/ {filtered.length} shown</span>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`font-mono text-[11px] tracking-widest uppercase px-4 py-1.5 border-2 transition-all duration-200 ${
                active === cat
                  ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.25)]'
                  : 'bg-transparent text-foreground border-black/25 hover:border-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Awwwards List ────────────────────────────────────── */}
      <div className="border-t-2 border-black">
        {filtered.map((item, idx) => (
          <Dialog key={item.title}>
            <DialogTrigger asChild>
              {/* Row */}
              <div
                role="button"
                tabIndex={0}
                aria-label={`View certificate: ${item.title}`}
                className="group relative border-b-2 border-black cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* ── Animated black fill (slides up on hover) */}
                <div
                  className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-[480ms] ease-[cubic-bezier(0.76,0,0.24,1)] pointer-events-none"
                  aria-hidden="true"
                />

                {/* ── Certificate thumbnail (slides from right) */}
                <div
                  className="absolute top-0 right-0 h-full w-56 z-10 overflow-hidden pointer-events-none translate-x-full group-hover:translate-x-0 transition-transform duration-[480ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
                  aria-hidden="true"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  {/* Left border on the image panel */}
                  <div className={`absolute left-0 top-0 h-full w-1 ${categoryBorder[item.category]} border-l-4`} />
                </div>

                {/* ── Row content */}
                <div className="relative z-20 flex items-center gap-4 sm:gap-6 px-4 sm:px-8 py-5 sm:py-6 pr-4 sm:pr-60 transition-colors duration-[480ms]">

                  {/* Index */}
                  <span className="font-mono text-xs font-bold text-foreground/25 group-hover:text-white/30 transition-colors duration-300 w-6 shrink-0 select-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* Category pill */}
                  <span
                    className={`hidden sm:inline-block text-[10px] font-mono font-black px-2 py-1 shrink-0 leading-none ${categoryAccent[item.category]}`}
                  >
                    {item.category.toUpperCase()}
                  </span>

                  {/* Title + issuer */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base sm:text-lg leading-tight tracking-tight group-hover:text-white transition-colors duration-300 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="font-mono text-xs text-foreground/50 group-hover:text-white/50 transition-colors duration-300 mt-0.5">
                      {item.issuer}
                    </p>
                  </div>

                  {/* Tag chip */}
                  <span className="hidden lg:inline-block font-mono text-[10px] border border-black/20 group-hover:border-white/30 px-2 py-1 text-foreground/50 group-hover:text-white/50 transition-colors duration-300 shrink-0">
                    {item.tag}
                  </span>

                  {/* Date */}
                  <span className="font-mono text-[10px] tracking-widest uppercase text-foreground/35 group-hover:text-white/40 transition-colors duration-300 shrink-0 hidden sm:block">
                    {item.date}
                  </span>

                  {/* Arrow */}
                  <ArrowUpRight
                    className="w-5 h-5 text-foreground/25 group-hover:text-white group-hover:rotate-12 transition-all duration-300 shrink-0"
                  />
                </div>
              </div>
            </DialogTrigger>

            {/* ── Lightbox ──────────────────────────────────── */}
            <DialogContent className="max-w-5xl w-full p-0 border-4 border-black rounded-none shadow-[20px_20px_0px_0px_rgba(0,0,0,0.85)] overflow-hidden bg-white">
              <DialogTitle className="sr-only">{item.title}</DialogTitle>
              <DialogDescription className="sr-only">{item.issuer} — {item.category}</DialogDescription>

              <div className="flex flex-col md:flex-row h-full">
                {/* Image panel */}
                <div className="flex-1 bg-black/5 flex items-center justify-center p-4 min-h-[45vh] relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto max-h-[72vh] object-contain"
                  />
                </div>

                {/* Details sidebar */}
                <div className="md:w-72 p-6 border-t-4 md:border-t-0 md:border-l-4 border-black flex flex-col justify-between bg-white">
                  <div>
                    {/* Top index + category */}
                    <div className="flex items-center justify-between mb-5">
                      <span className={`text-[10px] font-mono font-black px-2 py-1 ${categoryAccent[item.category]}`}>
                        {item.category.toUpperCase()}
                      </span>
                      <span className="font-mono text-xs text-foreground/30 font-bold">
                        {String(filtered.indexOf(item) + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h2 className="font-black text-xl leading-tight mb-2 tracking-tight">
                      {item.title}
                    </h2>
                    <p className="font-mono text-sm text-foreground/70 font-semibold mb-1">
                      {item.issuer}
                    </p>
                    <p className="font-mono text-xs text-foreground/35 tracking-widest uppercase mb-6">
                      {item.date}
                    </p>
                    <p className="text-sm text-foreground/65 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-black/10 flex items-center justify-between">
                    <span className="font-mono text-xs bg-black text-white px-3 py-1.5 inline-block font-bold tracking-wider">
                      {item.tag}
                    </span>
                    <span className="font-mono text-[10px] text-foreground/30 uppercase tracking-widest">
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
        <div className="flex flex-col items-center justify-center py-24 border-b-2 border-black text-foreground/30">
          <Award className="w-10 h-10 mb-3 opacity-20" />
          <p className="font-mono text-sm">No certificates in this category</p>
        </div>
      )}
    </SectionBlock>
  );
};

export default AchievementsSection;
