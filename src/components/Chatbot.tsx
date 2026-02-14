import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  from: "user" | "bot";
  text: string;
}

const FAQ: Record<string, string> = {
  hello: "Hey there! I'm Prasad's portfolio assistant. Ask me about his skills, projects, or experience!",
  hi: "Hello! Feel free to ask me about Prasad's work, education, or how to get in touch.",
  skills: "Prasad is skilled in Flutter, Firebase, React, Aptos, Move, Git, and more. Check the Technical Skills section for the full list!",
  experience: "Prasad has experience in software development. Scroll to the Experience section for details!",
  education: "You can find Prasad's educational background in the Education section above.",
  projects: "Prasad has built several projects including mobile apps and blockchain tools. Check out the Projects section!",
  contact: "You can reach out via the Contact section at the bottom, or email directly.",
  resume: "Prasad's resume highlights are spread across the Education, Experience, and Skills sections of this portfolio.",
};

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, val] of Object.entries(FAQ)) {
    if (lower.includes(key)) return val;
  }
  return "I'm a simple portfolio bot — try asking about skills, projects, experience, education, or contact info!";
}

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hi! I'm Prasad's portfolio assistant. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { from: "user", text: input.trim() };
    const botMsg: Message = { from: "bot", text: getBotReply(input.trim()) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-50 p-3 border border-foreground/20 bg-background/80 backdrop-blur-sm text-foreground/60 hover:text-foreground transition-colors duration-300"
        aria-label="Toggle chatbot"
      >
        {open ? <X className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 left-6 z-50 w-80 max-h-[420px] border border-foreground/20 bg-background flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-foreground/10">
            <span className="text-xs uppercase tracking-[0.2em] text-foreground/60">Portfolio Assistant</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[280px]">
            {messages.map((msg, i) => (
              <div key={i} className={`text-sm ${msg.from === "bot" ? "text-foreground/70" : "text-foreground font-medium"}`}>
                <span className="text-xs text-foreground/30 mr-1">{msg.from === "bot" ? "Bot:" : "You:"}</span>
                {msg.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="border-t border-foreground/10 p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask something..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/30 outline-none"
            />
            <button onClick={send} className="text-foreground/40 hover:text-foreground transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
