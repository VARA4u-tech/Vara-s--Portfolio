import { useState } from "react";
import SectionBlock from "./SectionBlock";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact: ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.location.href = `mailto:puttadurga@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <SectionBlock id="contact" title="Get in touch">
      <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
        <div>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-transparent border-b border-foreground/20 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors text-sm tracking-wide"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-transparent border-b border-foreground/20 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors text-sm tracking-wide"
          />
        </div>
        <div>
          <textarea
            placeholder="Message"
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-transparent border-b border-foreground/20 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors text-sm tracking-wide resize-none"
          />
        </div>
        <button
          type="submit"
          className="group w-full md:w-auto relative cursor-pointer inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-black bg-black text-white text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:bg-white hover:text-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <span>Send Message</span>
          <span className="w-2 h-2 border-r-2 border-t-2 border-current rotate-45 group-hover:translate-x-1 transition-transform duration-300"></span>
        </button>
      </form>
    </SectionBlock>
  );
};

export default ContactSection;
