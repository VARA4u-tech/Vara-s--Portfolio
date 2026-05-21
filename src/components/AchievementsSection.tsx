import SectionBlock from './SectionBlock';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Maximize2 } from 'lucide-react';

const achievements = [
  {
    title: 'Rise In & Build On Aptos Bootcamp Graduate',
    issuer: 'Rise in Aptos',
    date: '[2025]',
    description:
      'Successfully graduated from the Rise In & Build On Aptos Bootcamp, demonstrating proficiency in Aptos blockchain development and building decentralized applications.',
    image: 'https://res.cloudinary.com/dqi1epget/image/upload/v1777568814/ChatGPT_Image_Apr_30_2026_10_36_44_PM_pzo6dn.png', // Upload this to Cloudinary or place in public/
  },
  {
    title: 'Innovate Andhra Hackathon 2025 (Data & AI) Participant',
    issuer: 'Academy of Tech Masters',
    date: '[DEC 2025]',
    description:
      'Participated in the Innovate Andhra Hackathon 2025 (Data & AI) held at the Academy Of Tech Masters, showcasing strong innovation, problem-solving, and teamwork skills in building data-driven AI solutions.',
    image: 'https://res.cloudinary.com/dqi1epget/image/upload/v1777568671/ChatGPT_Image_Apr_30_2026_10_34_14_PM_g4hcev.png',
  },
  {
    title: 'Generative AI & Prompt Engineering Certificate',
    issuer: 'Blackbuck Engineers',
    date: '[MAY 2025 – JUL 2025]',
    description:
      'Completed a 120-hour Short-Term Internship program focusing on ChatGPT, Prompt Engineering, and Generative AI. Developed expertise in designing structured prompt templates, leveraging Large Language Models, and integrating Generative AI workflows into application development.',
    image: 'https://res.cloudinary.com/dqi1epget/image/upload/v1779377183/blackbucks_chrnv6.png',
  },
];

const AchievementsSection = () => (
  <SectionBlock id="achievements" title="Achievements">
    <div className="space-y-16">
      {achievements.map((item) => (
        <div
          key={item.title}
          className="relative pl-8 md:pl-0 border-l md:border-l-0 border-black/20 md:grid md:grid-cols-[1fr_2fr] md:gap-12 pb-12 last:pb-0"
        >
          <div className="md:text-right md:pr-8 md:border-r border-black/20 relative">
            <div className="hidden md:block absolute top-1 -right-[5px] w-[9px] h-[9px] rounded-none bg-black"></div>
            <div className="md:hidden absolute top-1 -left-[5px] w-[9px] h-[9px] rounded-none bg-black"></div>

            <h4 className="font-mono text-xs tracking-widest text-foreground/60 uppercase mb-1">
              {item.date}
            </h4>
            <h3 className="font-bold text-base md:text-lg">{item.issuer}</h3>
          </div>

          <div className="mt-2 md:mt-0">
            <h3 className="text-base font-bold text-foreground md:hidden mb-2">
              {item.title}
            </h3>
            <h3 className="text-lg font-bold text-foreground hidden md:block mb-4">
              {item.title}
            </h3>
            <p className="body-text text-sm mb-6">{item.description}</p>
            
            {item.image && (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="group relative block w-full max-w-md overflow-hidden border-2 border-black bg-muted/20 transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[2px] hover:-translate-x-[2px] cursor-zoom-in">
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20 z-10 flex items-center justify-center">
                      <div className="opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 bg-white text-black p-3 rounded-none border-2 border-black">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="aspect-[1.414/1] w-full overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover object-top filter grayscale-[15%] transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                      />
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full p-1 border-4 border-black rounded-none shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white">
                  <DialogTitle className="sr-only">{item.title}</DialogTitle>
                  <DialogDescription className="sr-only">{item.issuer} Certificate</DialogDescription>
                  <div className="relative w-full h-full flex items-center justify-center p-2">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-auto max-h-[80vh] object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      ))}
    </div>
  </SectionBlock>
);

export default AchievementsSection;
