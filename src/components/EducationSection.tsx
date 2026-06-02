import SectionBlock from './SectionBlock';

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

const EducationSection = () => (
  <SectionBlock id="education" title="Education">
    <div className="space-y-10">
      {education.map((item) => (
        <div
          key={item.degree}
          className="border-l-2 border-black/10 pl-6 py-2 hover:border-black transition-colors duration-300"
        >
          <h3 className="text-base md:text-lg font-bold text-foreground">
            {item.degree}
          </h3>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-2">
            <span className="text-sm font-medium text-foreground">
              {item.school}
            </span>
            <span className="hidden md:inline text-foreground/20">•</span>
            <span className="font-mono text-xs text-foreground/60">
              {item.year}
            </span>
          </div>
          {item.description && (
            <ul className="mt-4 space-y-2 list-disc list-outside pl-4 text-sm text-foreground/80">
              {item.description.map((point, index) => (
                <li key={index} className="leading-relaxed">
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  </SectionBlock>
);

export default EducationSection;
