import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative px-6">
      <div className="text-center">
        <h1
          className="heading-brutal"
          style={{ fontSize: "clamp(60px, 12vw, 150px)" }}
        >
          Portfolio.
        </h1>
        <p className="mt-4 text-foreground/70 text-lg md:text-xl tracking-[0.15em] font-medium">
          Pappuri Durga Vara Prasad
        </p>

        <div className="flex gap-4 justify-center mt-8">
          {[
            { Icon: Github, href: "https://github.com/VARA4u-tech" },
            { Icon: Linkedin, href: "https://linkedin.com/in/vara4u" },
            { Icon: Twitter, href: "https://twitter.com/vara4u" },
            { Icon: Mail, href: "mailto:contact@vara.dev" },
          ].map(({ Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center p-3 border-2 border-black bg-white text-black transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-black hover:text-white"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        <div className="mt-12">
          <a
            href="/resume.pdf"
            download
            className="group relative inline-flex items-center gap-2 px-8 py-4 border-2 border-black bg-black text-white text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:bg-white hover:text-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <span>Download Resume</span>
            <span className="w-2 h-2 border-r-2 border-b-2 border-current rotate-45 -translate-y-[1px] group-hover:translate-y-[1px] transition-transform duration-300"></span>
          </a>
        </div>
      </div>
      <div className="absolute bottom-10 left-6 md:left-10">
        <span className="text-foreground/40 text-xs tracking-[0.2em] uppercase">
          www.prasad.dev
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
