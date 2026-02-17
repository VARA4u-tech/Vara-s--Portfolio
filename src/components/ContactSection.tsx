import { useState } from "react";
import SectionBlock from "./SectionBlock";
import {
  Mail,
  MapPin,
  Copy,
  Check,
  ArrowRight,
  Github,
  Linkedin,
  MessageCircle,
  InstagramIcon,
} from "lucide-react";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = "+919550533315";
    const text = `Name: ${form.name}\nEmail: ${form.email}\nMessage: ${form.message}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, "_blank");
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("pappuridurgavaraprasad4pl@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SectionBlock id="contact" title="Get in touch">
      <div className="grid md:grid-cols-2 gap-8 md:gap-20">
        {/* Left Column: Contact Info */}
        <div className="space-y-8 md:space-y-10">
          <p className="text-foreground/80 leading-relaxed font-light text-lg">
            I'm always interested in hearing about new projects and
            opportunities. Whether you have a question or just want to say hi,
            feel free to drop a message.
          </p>

          <div className="space-y-6">
            <div className="group flex items-center gap-4 p-4 border border-foreground/10 bg-white/50 hover:border-black transition-colors duration-300">
              <div className="p-3 bg-black text-white self-start">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">
                  Email
                </p>
                <p className="font-mono text-sm break-all">
                  pappuridurgavaraprasad4pl@gmail.com
                </p>
              </div>
              <button
                onClick={copyEmail}
                className="p-2 hover:bg-black/5 rounded-full transition-colors relative"
                title="Copy email"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-foreground/40" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 border border-foreground/10 bg-white/50 hover:border-black transition-colors duration-300">
              <div className="p-3 bg-black text-white self-start">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">
                  Whatsapp
                </p>
                <p className="font-mono text-sm">+91 9550533315</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">
              Connect
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Github, href: "https://github.com/VARA4u-tech" },
                { Icon: Linkedin, href: "https://linkedin.com/in/vara4u" },
                { Icon: InstagramIcon, href: "https://instagram.com/d_v_p6" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border border-foreground/20 hover:bg-black hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group relative">
            <input
              type="text"
              required
              placeholder=" "
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="peer w-full bg-transparent border-2 border-foreground/10 px-4 py-4 text-foreground focus:outline-none focus:border-black transition-colors"
            />
            <label className="absolute left-4 top-4 text-foreground/40 text-sm uppercase tracking-widest transition-all duration-300 pointer-events-none peer-focus:-translate-y-7 peer-focus:text-xs peer-focus:text-black peer-focus:bg-background peer-focus:px-2 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-black peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-2">
              Your Name
            </label>
          </div>

          <div className="group relative">
            <input
              type="email"
              required
              placeholder=" "
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="peer w-full bg-transparent border-2 border-foreground/10 px-4 py-4 text-foreground focus:outline-none focus:border-black transition-colors"
            />
            <label className="absolute left-4 top-4 text-foreground/40 text-sm uppercase tracking-widest transition-all duration-300 pointer-events-none peer-focus:-translate-y-7 peer-focus:text-xs peer-focus:text-black peer-focus:bg-background peer-focus:px-2 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-black peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-2">
              Email Address
            </label>
          </div>

          <div className="group relative">
            <textarea
              required
              rows={5}
              placeholder=" "
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="peer w-full bg-transparent border-2 border-foreground/10 px-4 py-4 text-foreground focus:outline-none focus:border-black transition-colors resize-none"
            />
            <label className="absolute left-4 top-4 text-foreground/40 text-sm uppercase tracking-widest transition-all duration-300 pointer-events-none peer-focus:-translate-y-7 peer-focus:text-xs peer-focus:text-black peer-focus:bg-background peer-focus:px-2 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-black peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-2">
              Message
            </label>
          </div>

          <button
            type="submit"
            className="w-full group relative flex items-center justify-center gap-3 px-8 py-4 bg-black text-white font-mono uppercase tracking-widest overflow-hidden transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] hover:-translate-y-1 active:translate-y-0 active:shadow-none"
          >
            <span className="relative z-10 font-bold">Send via WhatsApp</span>
            <MessageCircle className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-green-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </form>
      </div>
    </SectionBlock>
  );
};

export default ContactSection;
