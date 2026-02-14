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
