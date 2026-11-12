import SectionBlock from './SectionBlock';
import { useComic, useHalloween } from '@/context/ThemeContext';

interface EducationItem {
  degree: string;
  school: string;
  year: string;
  description?: string[];
}

const education: EducationItem[] = [
  {
    degree:
      'Master of Computer Applications (MCA), DVR & Dr. HS MIC College of Technology (Autonomous),Kanchikacherla',
    school:
      'Affiliated to Jawaharlal Nehru Technological University Kakinada (JNTUK)',
    year: '2024 – 2026(Pursuing)',
    description: [
      'Completed industry-focused training in Full Stack Web Development, covering React.js, Node.js, Express.js , MongoDB, and RESTful APIs.',
      'Acquired practical knowledge of Java Programming, Object-Oriented Programming (OOP), and Data Structures.',
      'Strengthened skills in Database Management Systems (DBMS), SQL query optimization, and database design.',
      'Gained hands-on experience in Web Technologies including HTML5, CSS3, JavaScript, and responsive design principles.',
    ],
  },
  {
    degree:
      'Bachelor of Science (B.Sc. – Mathematics, Statistics & Computer Science),Gowtham Degree College,Vijayawada',
    school: 'Affiliated to Krishna University',
    year: '2021 – 2024',
    description: [
      'Built a strong foundation in Computer Science, programming, database management, and problem-solving.',
      'Developed analytical and quantitative skills through Mathematics and Statistics.',
      'Gained knowledge of software development concepts, data analysis, and computational thinking.',
    ],
  },
];

const EducationSection = () => {
  const { isComic } = useComic();
  const { isHalloween } = useHalloween();

  return (
    <SectionBlock id="education" title="Education">
      <div className="space-y-8">
        {education.map((item) => {
          const isMca = item.degree.includes('Master');
          const badgeText = isMca
            ? 'POSTGRADUATE // MCA'
            : 'UNDERGRADUATE // B.SC';

          return (
            <div
              key={item.degree}
              className={`transition-all duration-300 ${
                isComic
                  ? `${isMca ? 'comic-panel-white border-l-4 border-l-[#D9B45B]' : 'comic-panel-concrete border-l-4 border-l-[#171717]'} p-6`
                  : isHalloween
                    ? 'border-l-2 border-[#FF7518]/50 pl-6 py-2 hover:border-[#FF7518]'
                    : 'border-l-2 border-black/10 pl-6 py-2 hover:border-black'
              }`}
            >
              {isComic && (
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`${isMca ? 'comic-badge-gold' : 'comic-badge-dark'} text-[9px] px-2 py-0.5`}
                  >
                    {badgeText}
                  </span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#171717]/60">
                    ACADEMIC RECORD
                  </span>
                </div>
              )}

              <h3
                className={`text-base md:text-lg font-bold ${
                  isComic ? 'text-[#171717]' : 'text-foreground'
                }`}
              >
                {item.degree}
              </h3>
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-2">
                <span
                  className={`text-sm font-medium ${
                    isComic ? 'text-[#171717]' : 'text-foreground'
                  }`}
                >
                  {item.school}
                </span>
                <span
                  className={`hidden md:inline ${
                    isComic ? 'text-[#888888]' : 'text-foreground/20'
                  }`}
                >
                  •
                </span>
                <span
                  className={`font-mono text-xs ${
                    isComic
                      ? 'font-bold text-[#B58B32]'
                      : isHalloween
                        ? 'font-bold text-[#FF7518]'
                        : 'text-foreground/60'
                  }`}
                >
                  {item.year}
                </span>
              </div>
              {item.description && (
                <ul
                  className={`mt-4 space-y-2 list-disc list-outside pl-4 text-sm ${
                    isComic
                      ? 'text-[#171717]/85'
                      : isHalloween
                        ? 'text-foreground/85 marker:text-[#FF7518]'
                        : 'text-foreground/80'
                  }`}
                >
                  {item.description.map((point, i) => (
                    <li key={i} className="leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </SectionBlock>
  );
};

export default EducationSection;
