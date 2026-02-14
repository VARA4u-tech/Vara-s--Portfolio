import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Terminal as TerminalIcon,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface CommandOutput {
  id: number;
  type: "command" | "response" | "error";
  content: React.ReactNode;
}

const Terminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      id: 0,
      type: "response",
      content: (
        <div className="mb-2">
          <p>Welcome to Vara's Portfolio Terminal v1.0.0</p>
          <p>
            Type <span className="text-green-400">help</span> to see available
            commands.
          </p>
        </div>
      ),
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Focus input when clicking anywhere in the terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Scroll to bottom on new history
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isOpen]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    // Add command to history
    const newHistory: CommandOutput[] = [
      ...history,
      {
        id: Date.now(),
        type: "command",
        content: `guest@portfolio:~$ ${cmd}`,
      },
    ];

    let response: React.ReactNode = "";

    switch (trimmedCmd) {
      case "help":
        response = (
          <div className="grid grid-cols-[100px_1fr] gap-2">
            <span className="text-green-400">about</span>{" "}
            <span>Learn about me</span>
            <span className="text-green-400">skills</span>{" "}
            <span>View technical skills</span>
            <span className="text-green-400">projects</span>{" "}
            <span>List recent projects</span>
            <span className="text-green-400">contact</span>{" "}
            <span>How to reach me</span>
            <span className="text-green-400">clear</span>{" "}
            <span>Clear the terminal</span>
            <span className="text-green-400">exit</span>{" "}
            <span>Close terminal</span>
          </div>
        );
        break;
      case "about":
        response =
          "I'm Pappuri Durga Vara Prasad, a passionate developer specializing in Flutter, React, and Blockchain technologies. I build modern, high-performance applications.";
        break;
      case "skills":
        response = (
          <div>
            <p className="mb-1">CORE STACK:</p>
            <p>• Flutter / Dart</p>
            <p>• React / TypeScript</p>
            <p>• Firebase / Node.js</p>
            <p>• Blockchain (Aptos/Move)</p>
          </div>
        );
        break;
      case "projects":
        response = (
          <div className="flex flex-col gap-1">
            <a href="#projects" className="text-blue-400 hover:underline">
              1. EduPredict (AI Analytics)
            </a>
            <a href="#projects" className="text-blue-400 hover:underline">
              2. AOTMS (Transport Mgmt)
            </a>
            <a href="#projects" className="text-blue-400 hover:underline">
              3. Vara's Portfolio
            </a>
          </div>
        );
        break;
      case "contact":
        response = (
          <div>
            <p>
              Email:{" "}
              <a
                href="mailto:varaprasad@example.com"
                className="text-blue-400 hover:underline"
              >
                varaprasad@example.com
              </a>
            </p>
            <p>
              LinkedIn:{" "}
              <a
                href="https://linkedin.com/in/varaprasad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                linkedin.com/in/varaprasad
              </a>
            </p>
            <p>
              GitHub:{" "}
              <a
                href="https://github.com/VARA4u-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                github.com/VARA4u-tech
              </a>
            </p>
          </div>
        );
        break;
      case "clear":
        setHistory([]);
        return;
      case "exit":
        setIsOpen(false);
        return;
      case "":
        response = "";
        break;
      default:
        response = (
          <span className="text-red-400">
            Command not found: {trimmedCmd}. Type 'help' for available commands.
          </span>
        );
    }

    if (response) {
      newHistory.push({
        id: Date.now() + 1,
        type: "response",
        content: response,
      });
    }

    setHistory(newHistory);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-20 z-50 p-3 bg-background border border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        aria-label="Open Terminal"
      >
        <TerminalIcon className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className={`bg-[#0c0c0c] border border-white/20 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] w-full transition-all duration-300 flex flex-col font-mono text-sm md:text-base ${
          isMaximized ? "h-[95vh] w-[95vw]" : "max-w-2xl h-[600px]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
            <div
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer"
              onClick={() => setIsMaximized(!isMaximized)}
            />
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer" />
            <span className="ml-2 text-white/60 text-xs">
              guest@vara-portfolio:~
            </span>
          </div>
          <div className="flex items-center gap-3 text-white/40">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="hover:text-white"
            >
              {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* content */}
        <div
          className="flex-1 overflow-y-auto p-4 text-white/90 selection:bg-white/20"
          ref={scrollRef}
          onClick={handleTerminalClick}
        >
          {history.map((entry) => (
            <div key={entry.id} className="mb-2 break-words">
              {entry.content}
            </div>
          ))}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="text-green-400 shrink-0">guest@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 p-0"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
