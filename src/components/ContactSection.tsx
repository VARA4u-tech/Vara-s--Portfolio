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
          className="border border-foreground text-foreground px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-colors duration-300"
        >
          Send
        </button>
      </form>
    </SectionBlock>
  );
};

export default ContactSection;
