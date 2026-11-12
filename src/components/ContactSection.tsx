import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import {
  playPop,
  playSuccess,
  playClick,
  playError,
} from '@/hooks/useSoundEffects';
import SectionBlock from './SectionBlock';
import { ScrollReveal } from './ui/ScrollReveal';
import {
  Mail,
  Copy,
  Check,
  Github,
  Linkedin,
  InstagramIcon,
  BookOpen,
  Send,
  LucideGlobe2,
  AlertTriangle,
  Loader2,
  CheckCircle,
  Twitter,
} from 'lucide-react';
import { PROFILE, SOCIAL_LINKS } from '@/data/constants';
import { useHalloween, useComic } from '@/context/ThemeContext';
import JackOLantern from './halloween/JackOLantern';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  instagram: InstagramIcon,
  blog: BookOpen,
  x: Twitter,
};

const contactSocials = SOCIAL_LINKS.filter((l) => l.id !== 'email');

// Zod schema for form validation
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters.' })
    .max(1000, { message: 'Message cannot exceed 1000 characters.' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactSection = () => {
  const { isHalloween } = useHalloween();
  const { isComic } = useComic();
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const RATE_LIMIT_MS = 60_000; // 60 seconds between submissions
  const RATE_LIMIT_KEY = 'contact_last_submit';

  const formspreeId = (
    (import.meta.env.VITE_FORMSPREE_ID as string) ||
    PROFILE.formspreeId ||
    ''
  ).trim();
  const cleanId = formspreeId.replace('https://formspree.io/f/', '');
  const isDemoMode =
    !cleanId ||
    cleanId === 'YOUR_FORMSPREE_ID' ||
    cleanId.toLowerCase() === 'placeholder' ||
    cleanId.toLowerCase() === 'demo';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    watch,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const messageValue = watch('message') || '';
  const messageLength = messageValue.length;
  const MAX_MESSAGE_LENGTH = 1000;

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitError(null);

    // ── Security: Honeypot check ──
    // If the hidden field is filled, it's a bot — silently abort
    if (honeypot) {
      await new Promise((r) => setTimeout(r, 1500));
      setIsSubmitted(true); // fake success so bots think they succeeded
      return;
    }

    // ── Security: Rate limiting ──
    const lastSubmit = parseInt(
      localStorage.getItem(RATE_LIMIT_KEY) || '0',
      10,
    );
    const now = Date.now();
    const elapsed = now - lastSubmit;
    if (elapsed < RATE_LIMIT_MS) {
      const remaining = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
      setRateLimited(true);
      setCooldownSeconds(remaining);
      const countdown = setInterval(() => {
        setCooldownSeconds((s) => {
          if (s <= 1) {
            clearInterval(countdown);
            setRateLimited(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      toast.error(`Please wait ${remaining}s before sending another message.`);
      return;
    }

    localStorage.setItem(RATE_LIMIT_KEY, String(now));

    try {
      if (isDemoMode) {
        // Simulate network latency in demo mode
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Form submitted successfully (Demo Mode):', data);
      } else {
        const targetUrl = formspreeId.startsWith('http')
          ? formspreeId
          : `https://formspree.io/f/${formspreeId}`;

        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(
            'Could not register submission with Formspree. Try again later.',
          );
        }
      }

      // Success sequence
      playSuccess();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: isHalloween
          ? ['#FF7518', '#0B0B0B', '#301934', '#FFA000', '#F5F5F5']
          : ['#000000', '#2563eb', '#16a34a', '#d97706', '#db2777'],
      });
      setIsSubmitted(true);
      toast.success('Your message has been received!');
    } catch (err) {
      playError();
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please check your network connection.';
      setSubmitError(message);
      toast.error(message);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(PROFILE.email);
    playPop();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SectionBlock id="contact" title="Get in touch">
      <div className="grid md:grid-cols-2 gap-8 md:gap-20">
        {/* Left Column: Contact Info */}
        <ScrollReveal animation="fade-in" className="space-y-8 md:space-y-10">
          <p
            className={`leading-relaxed text-lg ${
              isComic
                ? 'text-[#D9D9D9] font-normal'
                : 'text-foreground/80 font-light'
            }`}
          >
            I'm always interested in hearing about new projects and
            opportunities. Whether you have a question or just want to say hi,
            feel free to drop a message.
          </p>

          <div className="space-y-6">
            <div
              className={`group flex items-center gap-4 p-4 transition-all duration-300 rounded-none ${
                isComic
                  ? 'comic-panel-white'
                  : isHalloween
                    ? 'border border-black/20 bg-white/80 hover:border-[#FF7518] hover:shadow-[4px_4px_0px_0px_#FF7518]'
                    : 'border border-foreground/10 bg-white/50 hover:border-black'
              }`}
            >
              <div
                className={`p-3 self-start rounded-none ${
                  isComic
                    ? 'bg-[#171717] text-[#D9B45B] border border-[#171717]'
                    : isHalloween
                      ? 'bg-black text-[#FF7518]'
                      : 'bg-black text-white'
                }`}
              >
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs uppercase tracking-widest mb-1 ${
                    isComic ? 'text-[#888888]' : 'text-foreground/50'
                  }`}
                >
                  Email
                </p>
                <p
                  className={`font-mono text-sm break-all font-bold ${
                    isComic ? 'text-[#171717]' : ''
                  }`}
                >
                  {PROFILE.email}
                </p>
              </div>
              <button
                onClick={copyEmail}
                className="p-2 hover:bg-black/5 rounded-none transition-colors relative"
                title="Copy email"
                aria-label={copied ? 'Email copied' : 'Copy email address'}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-[#171717]" />
                ) : (
                  <Copy
                    className={`w-4 h-4 ${
                      isComic ? 'text-[#888888]' : 'text-foreground/40'
                    }`}
                  />
                )}
              </button>
            </div>

            <div
              className={`flex items-center gap-4 p-4 transition-all duration-300 rounded-none ${
                isComic
                  ? 'comic-panel-concrete'
                  : isHalloween
                    ? 'border border-black/20 bg-white/80 hover:border-[#FF7518] hover:shadow-[4px_4px_0px_0px_#FF7518]'
                    : 'border border-foreground/10 bg-white/50 hover:border-black'
              }`}
            >
              <div
                className={`p-3 self-start rounded-none ${
                  isComic
                    ? 'bg-[#171717] text-[#D9B45B] border border-[#171717]'
                    : isHalloween
                      ? 'bg-black text-[#FF7518]'
                      : 'bg-black text-white'
                }`}
              >
                <LucideGlobe2 className="w-5 h-5" />
              </div>
              <div>
                <p
                  className={`text-xs uppercase tracking-widest mb-1 ${
                    isComic ? 'text-[#171717]/70' : 'text-foreground/50'
                  }`}
                >
                  Current Status
                </p>
                <p
                  className={`font-mono text-sm flex items-center gap-2 font-bold ${
                    isComic ? 'text-[#171717]' : ''
                  }`}
                >
                  AVAILABLE_FOR_PROJECTS
                  {isHalloween && <span>🎃</span>}
                  {isComic && (
                    <span className="inline-block w-2 h-2 bg-[#B58B32] border border-[#171717]" />
                  )}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p
              className={`text-xs uppercase tracking-widest mb-4 ${
                isComic ? 'text-[#888888]' : 'text-foreground/50'
              }`}
            >
              Connect
            </p>
            <div className="flex gap-4">
              {contactSocials.map((link) => {
                const Icon = ICON_MAP[link.id];
                if (!Icon) return null;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playClick}
                    aria-label={link.label}
                    className={`p-3 border transition-all duration-200 hover:-translate-y-0.5 active:scale-95 touch-manipulation rounded-none ${
                      isComic
                        ? 'border-2 border-[#D9D9D9] bg-[#171717] text-[#FFFFFF] shadow-[3px_3px_0px_#888888] hover:bg-[#D9B45B] hover:text-[#171717] hover:border-[#171717] hover:shadow-[4px_4px_0px_#B58B32]'
                        : isHalloween
                          ? 'border-black/25 bg-white text-black hover:bg-black hover:text-[#FF7518] hover:border-[#FF7518] hover:shadow-[3px_3px_0px_0px_#FF7518]'
                          : 'border-foreground/20 hover:bg-black hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Right Column: Form or Success State */}
        <ScrollReveal animation="fade-up" delay={0.2} className="w-full">
          {isSubmitted ? (
            <div
              className={`flex flex-col items-center justify-center p-8 border-2 text-center space-y-6 animate-fade-in min-h-[400px] rounded-none ${
                isComic
                  ? 'comic-panel-white'
                  : 'border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <div
                className={`p-4 border-2 rounded-none ${
                  isComic
                    ? 'bg-[#D9B45B] border-[#171717] text-[#171717]'
                    : 'bg-black border-black text-white animate-pulse'
                }`}
              >
                <CheckCircle className="w-12 h-12" />
              </div>
              <h3 className="font-mono text-2xl font-black uppercase tracking-wider text-[#171717]">
                Message Received!
              </h3>
              <p className="text-sm font-normal text-[#171717]/80 leading-relaxed max-w-sm">
                Thank you for reaching out, <strong>{getValues('name')}</strong>
                . Your message has been successfully routed. I'll get back to
                you as soon as possible.
              </p>

              {isDemoMode && (
                <div
                  className={`p-4 border font-mono text-[10px] text-left space-y-1 max-w-sm rounded-none ${
                    isComic
                      ? 'bg-[#D9D9D9] border-[#171717] text-[#171717]'
                      : 'bg-amber-50 border-amber-500 text-amber-800'
                  }`}
                >
                  <p className="font-bold uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Developer Notice:
                  </p>
                  <p>
                    This form is in demo mode because a custom Formspree ID is
                    not configured.
                  </p>
                  <p className="underline">
                    Please set `VITE_FORMSPREE_ID` in your `.env` file (which is
                    ignored by Git) to receive real submissions.
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  playClick();
                  setIsSubmitted(false);
                  reset();
                }}
                className={`px-6 py-3 border-2 font-mono uppercase text-xs tracking-widest font-bold transition-all duration-200 active:scale-95 rounded-none ${
                  isComic
                    ? 'border-[#171717] bg-[#171717] text-[#FFFFFF] hover:bg-[#D9B45B] hover:text-[#171717] shadow-[4px_4px_0px_#B58B32]'
                    : 'border-black bg-black text-white hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit, () => playError())}
              className="space-y-6"
              noValidate
            >
              {/* ── Security: Honeypot field — hidden from real users, bots fill it ── */}
              <div
                aria-hidden="true"
                className="absolute -z-50 opacity-0 h-0 overflow-hidden"
                tabIndex={-1}
              >
                <input
                  type="text"
                  name="_gotcha"
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                />
              </div>
              {submitError && (
                <div
                  className={`flex items-start gap-3 p-4 border-2 font-mono text-xs rounded-none ${
                    isComic
                      ? 'bg-[#D9D9D9] border-[#B58B32] text-[#171717]'
                      : 'bg-red-50 border-red-500 text-red-700'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase">Submission Failed</p>
                    <p>{submitError}</p>
                  </div>
                </div>
              )}

              {/* Name Input */}
              <div className="group relative">
                <input
                  id="contact-name"
                  type="text"
                  placeholder=" "
                  {...register('name')}
                  className={`peer w-full border-2 px-4 py-4 focus:outline-none transition-all duration-200 rounded-none ${
                    isComic
                      ? `bg-[#171717] text-[#FFFFFF] ${
                          errors.name
                            ? 'border-[#D9B45B]'
                            : 'border-[#888888] focus:border-[#D9B45B] focus:shadow-[4px_4px_0px_#B58B32]'
                        }`
                      : `bg-transparent text-foreground ${
                          errors.name
                            ? 'border-red-500 focus:border-red-500'
                            : isHalloween
                              ? 'border-foreground/15 focus:border-[#FF7518]'
                              : 'border-foreground/10 focus:border-black'
                        }`
                  }`}
                />
                <label
                  htmlFor="contact-name"
                  className={`absolute left-4 top-4 text-sm uppercase tracking-widest transition-all duration-300 pointer-events-none peer-focus:-translate-y-7 peer-focus:text-xs peer-focus:px-2 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:px-2 ${
                    isComic
                      ? `peer-focus:bg-[#171717] peer-[:not(:placeholder-shown)]:bg-[#171717] ${
                          errors.name
                            ? 'text-[#D9B45B]'
                            : 'text-[#888888] peer-focus:text-[#D9B45B]'
                        }`
                      : `peer-focus:bg-background peer-[:not(:placeholder-shown)]:bg-background ${
                          errors.name
                            ? 'text-red-500 peer-focus:text-red-500'
                            : isHalloween
                              ? 'text-foreground/45 peer-focus:text-[#FF7518]'
                              : 'text-foreground/40 peer-focus:text-black'
                        }`
                  }`}
                >
                  Your Name
                </label>
                {errors.name && (
                  <p
                    className={`mt-1.5 font-mono text-xs font-bold flex items-center gap-1 animate-shake ${
                      isComic ? 'text-[#D9B45B]' : 'text-red-500'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div className="group relative">
                <input
                  id="contact-email"
                  type="email"
                  placeholder=" "
                  {...register('email')}
                  className={`peer w-full border-2 px-4 py-4 focus:outline-none transition-all duration-200 rounded-none ${
                    isComic
                      ? `bg-[#171717] text-[#FFFFFF] ${
                          errors.email
                            ? 'border-[#D9B45B]'
                            : 'border-[#888888] focus:border-[#D9B45B] focus:shadow-[4px_4px_0px_#B58B32]'
                        }`
                      : `bg-transparent text-foreground ${
                          errors.email
                            ? 'border-red-500 focus:border-red-500'
                            : isHalloween
                              ? 'border-foreground/15 focus:border-[#FF7518]'
                              : 'border-foreground/10 focus:border-black'
                        }`
                  }`}
                />
                <label
                  htmlFor="contact-email"
                  className={`absolute left-4 top-4 text-sm uppercase tracking-widest transition-all duration-300 pointer-events-none peer-focus:-translate-y-7 peer-focus:text-xs peer-focus:px-2 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:px-2 ${
                    isComic
                      ? `peer-focus:bg-[#171717] peer-[:not(:placeholder-shown)]:bg-[#171717] ${
                          errors.email
                            ? 'text-[#D9B45B]'
                            : 'text-[#888888] peer-focus:text-[#D9B45B]'
                        }`
                      : `peer-focus:bg-background peer-[:not(:placeholder-shown)]:bg-background ${
                          errors.email
                            ? 'text-red-500 peer-focus:text-red-500'
                            : isHalloween
                              ? 'text-foreground/45 peer-focus:text-[#FF7518]'
                              : 'text-foreground/40 peer-focus:text-black'
                        }`
                  }`}
                >
                  Email Address
                </label>
                {errors.email && (
                  <p
                    className={`mt-1.5 font-mono text-xs font-bold flex items-center gap-1 animate-shake ${
                      isComic ? 'text-[#D9B45B]' : 'text-red-500'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Message Input */}
              <div className="group relative">
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder=" "
                  maxLength={MAX_MESSAGE_LENGTH}
                  {...register('message')}
                  className={`peer w-full border-2 px-4 py-4 focus:outline-none transition-all duration-200 resize-none rounded-none ${
                    isComic
                      ? `bg-[#171717] text-[#FFFFFF] ${
                          errors.message
                            ? 'border-[#D9B45B]'
                            : 'border-[#888888] focus:border-[#D9B45B] focus:shadow-[4px_4px_0px_#B58B32]'
                        }`
                      : `bg-transparent text-foreground ${
                          errors.message
                            ? 'border-red-500 focus:border-red-500'
                            : isHalloween
                              ? 'border-foreground/15 focus:border-[#FF7518]'
                              : 'border-foreground/10 focus:border-black'
                        }`
                  }`}
                />
                <label
                  htmlFor="contact-message"
                  className={`absolute left-4 top-4 text-sm uppercase tracking-widest transition-all duration-300 pointer-events-none peer-focus:-translate-y-7 peer-focus:text-xs peer-focus:px-2 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:px-2 ${
                    isComic
                      ? `peer-focus:bg-[#171717] peer-[:not(:placeholder-shown)]:bg-[#171717] ${
                          errors.message
                            ? 'text-[#D9B45B]'
                            : 'text-[#888888] peer-focus:text-[#D9B45B]'
                        }`
                      : `peer-focus:bg-background peer-[:not(:placeholder-shown)]:bg-background ${
                          errors.message
                            ? 'text-red-500 peer-focus:text-red-500'
                            : isHalloween
                              ? 'text-foreground/45 peer-focus:text-[#FF7518]'
                              : 'text-foreground/40 peer-focus:text-black'
                        }`
                  }`}
                >
                  Message
                </label>
                <div className="flex justify-between items-center mt-1.5 min-h-[20px]">
                  <div className="flex-1">
                    {errors.message && (
                      <p
                        className={`font-mono text-xs font-bold flex items-center gap-1 animate-shake ${
                          isComic ? 'text-[#D9B45B]' : 'text-red-500'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                  <div
                    className={`font-mono text-xs ${
                      messageLength >= MAX_MESSAGE_LENGTH
                        ? isComic
                          ? 'text-[#D9B45B] font-bold'
                          : 'text-red-500 font-bold'
                        : isComic
                          ? 'text-[#888888]'
                          : 'text-foreground/40'
                    }`}
                  >
                    {messageLength} / {MAX_MESSAGE_LENGTH}
                  </div>
                </div>
              </div>

              <div>
                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || rateLimited}
                  onClick={playClick}
                  className={`w-full group relative flex items-center justify-center gap-3 px-8 py-4 font-mono uppercase tracking-widest overflow-hidden transition-all duration-200 rounded-none ${
                    isComic
                      ? 'bg-[#D9B45B] text-[#171717] border-2 border-[#FFFFFF] font-black shadow-[5px_5px_0px_#B58B32] hover:bg-[#B58B32] hover:shadow-[6px_6px_0px_#FFFFFF] hover:-translate-y-0.5'
                      : isHalloween
                        ? 'bg-black text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0px_0px_#FF7518] hover:-translate-y-1'
                        : 'bg-black text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] hover:-translate-y-1'
                  } active:scale-95 active:shadow-none disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className={`relative z-10 font-bold transition-colors duration-300 ${
                          isComic ? '' : 'group-hover:text-black'
                        }`}
                      >
                        {isComic ? 'TRANSMITTING...' : 'Sending...'}
                      </span>
                      <Loader2
                        className={`w-4 h-4 relative z-10 animate-spin transition-colors duration-300 ${
                          isComic ? '' : 'group-hover:text-black'
                        }`}
                      />
                    </>
                  ) : rateLimited ? (
                    <>
                      <span
                        className={`relative z-10 font-bold transition-colors duration-300 ${
                          isComic ? '' : 'group-hover:text-black'
                        }`}
                      >
                        Wait {cooldownSeconds}s
                      </span>
                      <Loader2
                        className={`w-4 h-4 relative z-10 animate-spin transition-colors duration-300 ${
                          isComic ? '' : 'group-hover:text-black'
                        }`}
                      />
                    </>
                  ) : (
                    <>
                      <span
                        className={`relative z-10 font-black tracking-wider transition-colors duration-300 ${
                          isComic ? '' : 'group-hover:text-black'
                        }`}
                      >
                        {isComic ? 'Transmit Message' : 'Send Message'}
                      </span>
                      <Send
                        className={`w-4 h-4 relative z-10 group-hover:translate-x-1 transition-all duration-300 ${
                          isComic ? '' : 'group-hover:text-black'
                        }`}
                      />
                    </>
                  )}
                  {!isComic && (
                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  )}
                </button>
              </div>
            </form>
          )}
        </ScrollReveal>
      </div>
    </SectionBlock>
  );
};

export default ContactSection;
