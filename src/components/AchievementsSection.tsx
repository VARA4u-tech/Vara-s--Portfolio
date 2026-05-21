import SectionBlock from './SectionBlock';

const achievements = [
  {
    title: 'Your Achievement Name',
    issuer: 'Issuing Organization',
    date: '[MMM YYYY]',
    description: 'Add a brief description about what you learned or achieved here.',
  },
];

const AchievementsSection = () => (
  <SectionBlock id="achievements" title="Achievements">
    <div className="space-y-12">
      {achievements.map((item) => (
        <div
          key={item.title}
          className="relative pl-8 md:pl-0 border-l md:border-l-0 border-black/20 md:grid md:grid-cols-[1fr_2fr] md:gap-8 pb-12 last:pb-0"
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
            <h3 className="text-lg font-bold text-foreground hidden md:block mb-3">
              {item.title}
            </h3>
            <p className="body-text text-sm">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  </SectionBlock>
);

export default AchievementsSection;
