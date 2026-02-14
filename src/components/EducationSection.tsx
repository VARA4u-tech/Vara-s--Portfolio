import SectionBlock from "./SectionBlock";

const education = [
  {
    degree: "Bachelor of Technology — Computer Science",
    school: "University of Technology",
    year: "2019 – 2023",
  },
  {
    degree: "Higher Secondary Education",
    school: "State Board of Education",
    year: "2017 – 2019",
  },
];

const EducationSection = () => (
  <SectionBlock id="education" title="Education">
    <div className="space-y-10">
      {education.map((item) => (
        <div key={item.degree}>
          <h3 className="text-lg md:text-xl font-bold text-foreground">
            {item.degree}
          </h3>
          <p className="body-text mt-1">{item.school}</p>
          <p className="text-foreground/40 text-sm mt-1 tracking-wide">{item.year}</p>
        </div>
      ))}
    </div>
  </SectionBlock>
);

export default EducationSection;
