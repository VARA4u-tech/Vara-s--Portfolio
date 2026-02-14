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

        <div className="flex gap-6 justify-center mt-8">
          <a
            href="https://github.com/VARA4u-tech"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all duration-300"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/vara4u"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all duration-300"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com/vara4u"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all duration-300"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="mailto:contact@vara.dev"
            className="p-2 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all duration-300"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>

        <div className="mt-12">
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 px-8 py-3 border border-black text-sm font-medium tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300"
          >
            Download Resume
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
