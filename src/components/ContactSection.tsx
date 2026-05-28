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
} from 'lucide-react';
import { PROFILE, SOCIAL_LINKS } from '@/data/constants';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  instagram: InstagramIcon,
  blog: BookOpen,
};

const contactSocials = SOCIAL_LINKS.filter((l) => l.id !== 'email');

// Zod schema for form validation
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactSection = () => {
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
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

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
        colors: ['#000000', '#2563eb', '#16a34a', '#d97706', '#db2777'],
      });
      setIsSubmitted(true);
      toast.success('Your message has been received!');
    } catch (err: any) {
      playError();
      setSubmitError(
        err.message ||
          'Something went wrong. Please check your network connection.',
      );
      toast.error(err.message || 'Failed to submit form');
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
        <div className="space-y-8 md:space-y-10">
          <p className="text-foreground/80 leading-relaxed font-light text-lg">
            I'm always interested in hearing about new projects and
            opportunities. Whether you have a question or just want to say hi,
            feel free to drop a message.
          </p>

          <div className="space-y-6">
            <div className="group flex items-center gap-4 p-4 border border-foreground/10 bg-white/50 hover:border-black transition-colors duration-300 rounded-none">
              <div className="p-3 bg-black text-white self-start rounded-none">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">
                  Email
                </p>
                <p className="font-mono text-sm break-all">{PROFILE.email}</p>
              </div>
              <button
                onClick={copyEmail}
                className="p-2 hover:bg-black/5 rounded-none transition-colors relative"
                title="Copy email"
                aria-label={copied ? 'Email copied' : 'Copy email address'}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-foreground/40" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 border border-foreground/10 bg-white/50 hover:border-black transition-colors duration-300 rounded-none">
              <div className="p-3 bg-black text-white self-start rounded-none">
                <LucideGlobe2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">
                  Current Status
                </p>
                <p className="font-mono text-sm">AVAILABLE_FOR_PROJECTS</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">
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
                    className="p-3 border border-foreground/20 hover:bg-black hover:text-white transition-all duration-300 hover:-translate-y-1 active:scale-95 touch-manipulation rounded-none"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Form or Success State */}
        <div className="w-full">
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center space-y-6 animate-fade-in min-h-[400px] rounded-none">
              <div className="p-4 bg-green-50 border-2 border-green-600 rounded-none text-green-600">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h3 className="font-mono text-2xl font-black uppercase tracking-wider text-black">
                Message Received!
              </h3>
              <p className="text-sm font-light text-foreground/80 leading-relaxed max-w-sm">
                Thank you for reaching out, <strong>{getValues('name')}</strong>
                . Your message has been successfully routed. I'll get back to
                you as soon as possible.
              </p>

              {isDemoMode && (
                <div className="p-4 bg-amber-50 border border-amber-500 font-mono text-[10px] text-amber-800 text-left space-y-1 max-w-sm rounded-none">
                  <p className="font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
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
                className="px-6 py-3 border-2 border-black bg-black text-white font-mono uppercase text-xs tracking-widest font-bold hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 active:scale-95 rounded-none"
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
                <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-500 text-red-700 font-mono text-xs rounded-none">
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
                  className={`peer w-full bg-transparent border-2 ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-foreground/10 focus:border-black'
                  } px-4 py-4 text-foreground focus:outline-none transition-colors rounded-none`}
                />
                <label
                  htmlFor="contact-name"
                  className={`absolute left-4 top-4 text-sm uppercase tracking-widest transition-all duration-300 pointer-events-none peer-focus:-translate-y-7 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-2 ${
                    errors.name
                      ? 'text-red-500 peer-focus:text-red-500'
                      : 'text-foreground/40 peer-focus:text-black'
                  }`}
                >
                  Your Name
                </label>
                {errors.name && (
                  <p className="mt-1.5 font-mono text-xs text-red-500 font-bold flex items-center gap-1 animate-shake">
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
                  className={`peer w-full bg-transparent border-2 ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-foreground/10 focus:border-black'
                  } px-4 py-4 text-foreground focus:outline-none transition-colors rounded-none`}
                />
                <label
                  htmlFor="contact-email"
                  className={`absolute left-4 top-4 text-sm uppercase tracking-widest transition-all duration-300 pointer-events-none peer-focus:-translate-y-7 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-2 ${
                    errors.email
                      ? 'text-red-500 peer-focus:text-red-500'
                      : 'text-foreground/40 peer-focus:text-black'
                  }`}
                >
                  Email Address
                </label>
                {errors.email && (
                  <p className="mt-1.5 font-mono text-xs text-red-500 font-bold flex items-center gap-1 animate-shake">
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
                  {...register('message')}
                  className={`peer w-full bg-transparent border-2 ${
                    errors.message
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-foreground/10 focus:border-black'
                  } px-4 py-4 text-foreground focus:outline-none transition-colors resize-none rounded-none`}
                />
                <label
                  htmlFor="contact-message"
                  className={`absolute left-4 top-4 text-sm uppercase tracking-widest transition-all duration-300 pointer-events-none peer-focus:-translate-y-7 peer-focus:text-xs peer-focus:bg-background peer-focus:px-2 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-2 ${
                    errors.message
                      ? 'text-red-500 peer-focus:text-red-500'
                      : 'text-foreground/40 peer-focus:text-black'
                  }`}
                >
                  Message
                </label>
                {errors.message && (
                  <p className="mt-1.5 font-mono text-xs text-red-500 font-bold flex items-center gap-1 animate-shake">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div>
                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || rateLimited}
                  onClick={playClick}
                  className="w-full group relative flex items-center justify-center gap-3 px-8 py-4 bg-black text-white font-mono uppercase tracking-widest overflow-hidden transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] hover:-translate-y-1 active:scale-95 active:shadow-none disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none rounded-none"
                >
                  {isSubmitting ? (
                    <>
                      <span className="relative z-10 font-bold">
                        Sending...
                      </span>
                      <Loader2 className="w-4 h-4 relative z-10 animate-spin" />
                    </>
                  ) : rateLimited ? (
                    <>
                      <span className="relative z-10 font-bold">
                        Wait {cooldownSeconds}s
                      </span>
                      <Loader2 className="w-4 h-4 relative z-10 animate-spin" />
                    </>
                  ) : (
                    <>
                      <span className="relative z-10 font-bold">
                        Send Message
                      </span>
                      <Send className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                  <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </SectionBlock>
  );
};

export default ContactSection;
