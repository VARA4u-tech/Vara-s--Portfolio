import { useState } from 'react';
import SectionBlock from './SectionBlock';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Maximize2, Award, ExternalLink } from 'lucide-react';

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
    title: 'Generative AI & Prompt Engineering Certificate',
    issuer: 'Blackbuck Engineers',
    date: 'MAY – JUL 2025',
    description:
      'Completed a 120-hour Short-Term Internship program focusing on ChatGPT, Prompt Engineering, and Generative AI. Developed expertise in designing structured prompt templates, leveraging Large Language Models, and integrating Generative AI workflows into application development.',
    image: 'https://res.cloudinary.com/dqi1epget/image/upload/v1779377183/blackbucks_chrnv6.png',
    category: 'Internship',
    tag: '120 Hours',
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
    title: 'How Software Teams Actually Work',
    issuer: 'Frontlines EduTech (FLM)',
    date: 'MAY 2026',
    description:
      'Actively participated in the "How Software Teams Actually Work" session organized by Frontlines EduTech Private Limited, learning about agile workflows, team collaboration, and industry software development practices.',
    image: 'https://res.cloudinary.com/dqi1epget/image/upload/v1779377800/WhatsApp_Image_2026-05-21_at_9.05.51_PM_etr9z3.jpg',
    category: 'Workshop',
    tag: 'Industry Skills',
  },
];

const CATEGORIES: Category[] = ['All', 'Hackathon', 'Bootcamp', 'Workshop', 'Internship'];

const categoryColors: Record<Exclude<Category, 'All'>, string> = {
  Hackathon: 'bg-orange-100 text-orange-800 border-orange-300',
  Bootcamp: 'bg-purple-100 text-purple-800 border-purple-300',
  Workshop: 'bg-blue-100 text-blue-800 border-blue-300',
  Internship: 'bg-green-100 text-green-800 border-green-300',
};

const AchievementsSection = () => {
  const [active, setActive] = useState<Category>('All');

  const filtered =
    active === 'All' ? achievements : achievements.filter((a) => a.category === active);

  return (
    <SectionBlock id="achievements" title="Achievements">
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-6 mb-10 pb-8 border-b-2 border-black/10">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-black" />
          <span className="font-mono text-sm font-bold">{achievements.length} Certificates</span>
        </div>
        {CATEGORIES.filter((c) => c !== 'All').map((cat) => {
          const count = achievements.filter((a) => a.category === cat).length;
          if (count === 0) return null;
          return (
            <div key={cat} className="flex items-center gap-1.5">
              <span className={`text-xs font-mono px-2 py-0.5 border font-semibold ${categoryColors[cat]}`}>
                {cat}
              </span>
              <span className="text-xs text-foreground/50 font-mono">×{count}</span>
            </div>
          );
        })}
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`font-mono text-xs tracking-widest uppercase px-4 py-2 border-2 transition-all duration-200 ${
              active === cat
                ? 'bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]'
                : 'bg-transparent text-foreground border-black/30 hover:border-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            {cat}
            {cat !== 'All' && (
              <span className="ml-1.5 opacity-60">
                ({achievements.filter((a) => a.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Certificate Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <Dialog key={item.title}>
            <DialogTrigger asChild>
              <button className="group relative flex flex-col text-left overflow-hidden border-2 border-black bg-white transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                
                {/* Certificate Thumbnail */}
                <div className="relative w-full aspect-[1.414/1] overflow-hidden bg-muted/30">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0 grayscale-[20%]"
                  />
                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 bg-white text-black p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                  {/* Category badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${categoryColors[item.category]}`}>
                      {item.category.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 border-t-2 border-black/10 w-full">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-sm leading-snug text-foreground line-clamp-2 flex-1">
                      {item.title}
                    </h3>
                    <ExternalLink className="w-3.5 h-3.5 text-foreground/30 group-hover:text-black transition-colors shrink-0 mt-0.5" />
                  </div>
                  <p className="font-mono text-xs text-foreground/60 mb-2">{item.issuer}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-foreground/40 tracking-widest uppercase">
                      {item.date}
                    </span>
                    <span className="text-[10px] font-mono bg-black/5 px-2 py-0.5 border border-black/10">
                      {item.tag}
                    </span>
                  </div>
                </div>
              </button>
            </DialogTrigger>

            {/* Lightbox */}
            <DialogContent className="max-w-5xl w-full p-0 border-4 border-black rounded-none shadow-[20px_20px_0px_0px_rgba(0,0,0,0.8)] overflow-hidden bg-white">
              <DialogTitle className="sr-only">{item.title}</DialogTitle>
              <DialogDescription className="sr-only">{item.issuer} — {item.category}</DialogDescription>
              <div className="flex flex-col md:flex-row h-full">
                {/* Image panel */}
                <div className="flex-1 bg-muted/20 flex items-center justify-center p-4 min-h-[50vh]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto max-h-[75vh] object-contain"
                  />
                </div>
                {/* Details panel */}
                <div className="md:w-72 p-6 border-t-4 md:border-t-0 md:border-l-4 border-black flex flex-col justify-between bg-white">
                  <div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-1 border inline-block mb-4 ${categoryColors[item.category]}`}>
                      {item.category.toUpperCase()}
                    </span>
                    <h2 className="font-bold text-lg leading-tight mb-2">{item.title}</h2>
                    <p className="font-mono text-sm text-foreground/70 font-semibold mb-1">{item.issuer}</p>
                    <p className="font-mono text-xs text-foreground/40 tracking-widest uppercase mb-6">{item.date}</p>
                    <p className="text-sm text-foreground/70 leading-relaxed">{item.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t-2 border-black/10">
                    <span className="font-mono text-xs bg-black text-white px-3 py-1 inline-block">
                      {item.tag}
                    </span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </SectionBlock>
  );
};

export default AchievementsSection;
