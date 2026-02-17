import { Github, Linkedin, InstagramIcon, Mail, Heart } from "lucide-react";

const Finale = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: "https://github.com/VARA4u-tech", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/vara4u",
      label: "LinkedIn",
    },
    {
      icon: Mail,
      href: "mailto:pappuridurgavaraprasad4pl@gmail.com",
      label: "Email",
    },
    {
      icon: InstagramIcon,
      href: "https://instagram.com/d_v_p6",
      label: "Instagram",
    },
  ];

  const marqueeTags = [
    "DURGA VARA PRASAD",
    "FULL STACK DEVELOPER",
    "FLUTTER EXPERT",
    "REACT ENTHUSIAST",
    "BLOCKCHAIN DEVELOPER",
    "AI INTEGRATION",
    "UI/UX DESIGNER",
  ];

  return (
    <section className="relative w-full bg-white border-t-8 border-black pt-20 overflow-hidden">
      {/* Marquee Section */}
      <div className="absolute top-0 left-0 w-full py-4 bg-black overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee flex items-center shrink-0">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center">
              {marqueeTags.map((tag) => (
                <span
                  key={tag}
                  className="text-white font-mono text-xs uppercase tracking-[0.3em] mx-10"
                >
                  {tag}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center">
        {/* Big Thank You */}
        <div className="relative mb-20 text-center">
          <h2 className="text-[12vw] md:text-[8vw] font-black uppercase leading-none tracking-tighter text-black/5 absolute -top-1/2 left-1/2 -translate-x-1/2 select-none pointer-events-none">
            THANK YOU
          </h2>
          <p className="text-xl md:text-3xl font-black uppercase tracking-tight italic z-10 relative">
            Let's build something{" "}
            <span className="text-white bg-black px-4 py-1 not-italic">
              unforgettable
            </span>{" "}
            together.
          </p>
        </div>

        {/* Social Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-24">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center p-8 border-2 border-black bg-white hover:bg-black transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
            >
              <link.icon className="w-8 h-8 group-hover:text-white transition-colors duration-300" />
              <span className="mt-4 font-mono text-xs uppercase tracking-widest font-black group-hover:text-white">
                {link.label}
              </span>
            </a>
          ))}
        </div>

        {/* Status Line */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border-2 border-green-600 rounded-full">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-green-800">
              Available for Freelance Projects
            </span>
          </div>
          <p className="text-xs font-mono text-black/70 uppercase tracking-widest leading-loose max-w-sm">
            From India 🇮🇳 to the World 🌍 • Crafting Scalable Digital Products
          </p>
        </div>
      </div>

      {/* Extreme Bottom Bar */}
      <div className="w-full bg-white pt-10 pb-24 md:pb-10 px-6 mt-auto border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 opacity-60">
          <p className="text-[12px] md:text-[12px] font-mono text-black uppercase tracking-[0.1em] md:tracking-[0.3em] text-center md:text-left">
            © {currentYear} Pappuri Durga Vara Prasad
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12px] md:text-[12px] font-mono text-black uppercase tracking-[0.1em] md:tracking-[0.3em] text-center md:text-right">
            <span className="whitespace-nowrap">Designed & Engineered</span>
            <span className="flex items-center gap-2">
              <span>with</span>
              <Heart className="w-3 h-3 text-black fill-black animate-heartbeat inline-block" />
              <span>by Vara</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Finale;
