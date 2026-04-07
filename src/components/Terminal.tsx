import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Terminal as TerminalIcon,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  playTerminalOpen,
  playTerminalClose,
  playKeyTick,
  playSuccess,
  playError,
  playClick,
} from '@/hooks/useSoundEffects';
import { useIsMobile } from '@/hooks/use-mobile';
import { PROFILE, SOCIAL_LINKS, getSocialLink } from '@/data/constants';

interface CommandOutput {
  id: number;
  type: 'command' | 'response' | 'error';
  content: React.ReactNode;
}

const Terminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [terminalTheme, setTerminalTheme] = useState('text-white/90');
  const [input, setInput] = useState('');
  const [gameMode, setGameMode] = useState(false);
  const [targetNumber, setTargetNumber] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [commandLog, setCommandLog] = useState<string[]>([]);
  const [commandLogIndex, setCommandLogIndex] = useState(-1);
  const isMobile = useIsMobile();
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      id: 0,
      type: 'response',
      content: (
        <div className="mb-2">
          <p>Welcome to Vara's Portfolio Terminal v1.0.0</p>
          <p>
            I am a conversational AI. Type{' '}
            <span className="text-green-400">help</span> for commands, or just
            chat with me!
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
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
          const next = !prev;
          if (next) playTerminalOpen();
          else playTerminalClose();
          return next;
        });
      }
      if (e.key === 'Escape' && isOpen) {
        playTerminalClose();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const github = getSocialLink('github');
  const linkedin = getSocialLink('linkedin');

  const getCommandResponse = useCallback(
    (cmd: string): React.ReactNode | null => {
      switch (cmd) {
        case 'help':
          return (
            <div className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-1">
              <span className="text-green-400">ls</span>{' '}
              <span>List available files</span>
              <span className="text-green-400">cat [file]</span>{' '}
              <span>Read a file</span>
              <span className="text-green-400">about</span>{' '}
              <span>Learn about me</span>
              <span className="text-green-400">skills</span>{' '}
              <span>View technical skills</span>
              <span className="text-green-400">projects</span>{' '}
              <span>List recent projects</span>
              <span className="text-green-400">contact</span>{' '}
              <span>How to reach me</span>
              <span className="text-green-400">theme [t]</span>{' '}
              <span>Change theme (green, amber, white)</span>
              <span className="text-green-400">play</span>{' '}
              <span>Play a minigame</span>
              <span className="text-green-400">clear</span>{' '}
              <span>Clear the terminal</span>
              <span className="text-green-400">exit</span>{' '}
              <span>Close terminal</span>
            </div>
          );
        case 'ls':
          return (
            <div className="grid grid-cols-2 gap-2 text-blue-400">
              <span>README.md</span>
              <span>experience.txt</span>
              <span>education.txt</span>
              <span>roadmap.sh</span>
            </div>
          );
        case 'cat readme.md':
          return "Vara's Portfolio v1.0.0. Built with React, TypeScript, and a reckless amount of neobrutalism.";
        case 'cat experience.txt':
          return 'Freelance Developer @ AOTMS. Built scalable transport systems and loved every second of it.';
        case 'cat education.txt':
          return 'Currently exploring the depths of CSE, specializing in Blockchain and AI.';
        case 'cat roadmap.sh':
          return 'Next up: Master Aptos Move, scale AI Voice Editor, and keep vibe coding.';
        case 'about':
          return `I'm ${PROFILE.name}, a passionate developer specializing in Flutter, React, and Blockchain technologies. I love building modern, high-performance applications.`;
        case 'skills':
          return (
            <div>
              <p className="mb-1 text-yellow-400">CORE STACK:</p>
              <p>• Flutter / Dart</p>
              <p>• React / TypeScript</p>
              <p>• Firebase / Node.js</p>
              <p>• Blockchain (Aptos/Move)</p>
            </div>
          );
        case 'projects':
          return (
            <div className="flex flex-col gap-1">
              <p className="mb-1 text-purple-400">RECENT WORK:</p>
              <a href="#projects" className="text-blue-400 hover:underline">
                1. Lakshmi Fashion Designers (LATEST)
              </a>
              <a href="#projects" className="text-blue-400 hover:underline">
                2. AI Voice Editor
              </a>
              <a href="#projects" className="text-blue-400 hover:underline">
                3. SafeTrip Pro (Safety App)
              </a>
              <a href="#projects" className="text-blue-400 hover:underline">
                4. AOTMS (Freelance)
              </a>
            </div>
          );
        case 'contact':
          return (
            <div>
              <p className="text-red-400 mb-1">REACH OUT:</p>
              <p>
                Email:{' '}
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="text-white hover:underline"
                >
                  {PROFILE.email}
                </a>
              </p>
              <p>
                LinkedIn:{' '}
                <a
                  href={linkedin.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline"
                >
                  LinkedIn Profile
                </a>
              </p>
              <p>
                GitHub:{' '}
                <a
                  href={github.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline"
                >
                  {github.href.replace('https://', '')}
                </a>
              </p>
            </div>
          );
        default:
          return null;
      }
    },
    [github, linkedin],
  );

  const processQuery = useCallback(
    (input: string): React.ReactNode | null => {
      const lower = input.toLowerCase();

      // Greeting
      if (lower.match(/^(hi|hello|hey|greetings)/)) {
        return "Hello! I'm Vara's virtual assistant. How can I help you today?";
      }

      // About
      if (lower.match(/(who|about|author|creator|developer)/)) {
        return getCommandResponse('about');
      }

      // Skills
      if (lower.match(/(skill|stack|tech|language|framework)/)) {
        return getCommandResponse('skills');
      }

      // Projects
      if (lower.match(/(project|work|app|site|portfolio)/)) {
        return getCommandResponse('projects');
      }

      // Contact
      if (lower.match(/(contact|email|reach|hire|github|linkedin)/)) {
        return getCommandResponse('contact');
      }

      return null;
    },
    [getCommandResponse],
  );

  const handleCommand = useCallback(
    (cmd: string) => {
      const trimmedCmd = cmd.trim();
      if (!trimmedCmd) return;

      // Add to command log for arrow-key history
      setCommandLog((prev) => [...prev, trimmedCmd]);
      setCommandLogIndex(-1);

      const newHistory: CommandOutput[] = [
        ...history,
        {
          id: Date.now(),
          type: 'command',
          content: `${gameMode ? 'game@portfolio:~$' : 'guest@portfolio:~$'} ${cmd}`,
        },
      ];

      if (gameMode) {
        const num = parseInt(trimmedCmd);
        if (
          trimmedCmd.toLowerCase() === 'exit' ||
          trimmedCmd.toLowerCase() === 'quit'
        ) {
          setGameMode(false);
          newHistory.push({
            id: Date.now() + 1,
            type: 'response',
            content: (
              <span className="text-yellow-400">Exited game mode.</span>
            ),
          });
          playTerminalClose();
        } else if (isNaN(num)) {
          newHistory.push({
            id: Date.now() + 1,
            type: 'error',
            content: (
              <span className="text-red-400">
                Please enter a valid number, or type 'exit' to quit.
              </span>
            ),
          });
          playError();
        } else {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          if (num === targetNumber) {
            setGameMode(false);
            newHistory.push({
              id: Date.now() + 1,
              type: 'response',
              content: (
                <span className="text-green-400">
                  🎉 Correct! You guessed the number {targetNumber} in{' '}
                  {newAttempts} attempts!
                </span>
              ),
            });
            playSuccess();
          } else if (num < targetNumber) {
            newHistory.push({
              id: Date.now() + 1,
              type: 'response',
              content: (
                <span className="text-blue-400">
                  Too low! Try a higher number.
                </span>
              ),
            });
            playKeyTick();
          } else {
            newHistory.push({
              id: Date.now() + 1,
              type: 'response',
              content: (
                <span className="text-blue-400">
                  Too high! Try a lower number.
                </span>
              ),
            });
            playKeyTick();
          }
        }
        setHistory(newHistory);
        return;
      }

      const [cmdName, ...args] = trimmedCmd.toLowerCase().split(' ');

      if (cmdName === 'clear') {
        playClick();
        setHistory([]);
        return;
      }

      if (cmdName === 'play') {
        const generatedNumber = Math.floor(Math.random() * 100) + 1;
        setTargetNumber(generatedNumber);
        setAttempts(0);
        setGameMode(true);
        newHistory.push({
          id: Date.now() + 1,
          type: 'response',
          content: (
            <div className="text-yellow-400">
              <p>
                🎮 <b>Number Guessing Game Started!</b> 🎮
              </p>
              <p>I have picked a number between 1 and 100.</p>
              <p>Enter your guess below, or type 'exit' to quit.</p>
            </div>
          ),
        });
        playSuccess();
        setHistory(newHistory);
        return;
      }

      if (cmdName === 'exit') {
        playTerminalClose();
        setIsOpen(false);
        return;
      }

      if (cmdName === 'theme') {
        const t = args[0];
        if (t === 'green') {
          setTerminalTheme('text-green-400');
          playSuccess();
        } else if (t === 'amber' || t === 'yellow') {
          setTerminalTheme('text-amber-400');
          playSuccess();
        } else if (t === 'white') {
          setTerminalTheme('text-white/90');
          playSuccess();
        } else {
          playError();
        }
        return;
      }

      // Try exact command match
      let response = getCommandResponse(trimmedCmd.toLowerCase());

      // If no exact match, try natural language processing
      if (!response) {
        response = processQuery(trimmedCmd);
      }

      // Default fallback
      if (!response) {
        playError();
        response = (
          <span className="text-red-400">
            Command not understood. Try asking "who are you?", "show skills", or
            type 'help'.
          </span>
        );
      } else {
        playSuccess();
      }

      newHistory.push({
        id: Date.now() + 1,
        type: 'response',
        content: response,
      });

      setHistory(newHistory);
    },
    [
      history,
      gameMode,
      attempts,
      targetNumber,
      getCommandResponse,
      processQuery,
    ],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput('');
  };

  /** Arrow-key command history navigation */
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandLog.length === 0) return;
      const nextIndex =
        commandLogIndex === -1
          ? commandLog.length - 1
          : Math.max(0, commandLogIndex - 1);
      setCommandLogIndex(nextIndex);
      setInput(commandLog[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandLogIndex === -1) return;
      const nextIndex = commandLogIndex + 1;
      if (nextIndex >= commandLog.length) {
        setCommandLogIndex(-1);
        setInput('');
      } else {
        setCommandLogIndex(nextIndex);
        setInput(commandLog[nextIndex]);
      }
    }
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentTouch = e.targetTouches[0].clientY;
    const diff = currentTouch - touchStart;

    // Swipe down to close (threshold 100px)
    if (diff > 100) {
      playTerminalClose();
      setIsOpen(false);
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 group">
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] rounded-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {isMobile ? 'Terminal' : 'Ctrl + K'}
        </div>
        <button
          onClick={() => {
            playTerminalOpen();
            setIsOpen(true);
          }}
          className="p-3 bg-white border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all duration-300 active:scale-95 rounded-none"
          aria-label="Open Terminal"
        >
          <TerminalIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-lg p-4 animate-in fade-in duration-500"
      onClick={() => setIsOpen(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`bg-[#0c0c0c] border border-white/30 shadow-[0_45px_100px_-20px_rgba(0,0,0,0.8),0_12px_24px_-12px_rgba(255,255,255,0.2),12px_12px_0px_0px_rgba(255,255,255,0.05)] w-full transition-all duration-700 flex flex-col font-mono text-sm md:text-base selection:bg-white/20 active:border-white/40 rounded-none overflow-hidden ${
          isMaximized ? 'h-[95vh] w-[95vw]' : 'max-w-2xl h-[600px]'
        }`}
        style={{
          transform: isMaximized 
            ? 'none' 
            : 'perspective(1500px) rotateX(1.5deg) rotateY(-1.5deg) scale(1.01)',
          transformStyle: 'preserve-3d',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-50 z-0" />
        {/* Drag indicator for mobile */}
        <div className="md:hidden w-12 h-1.5 bg-white/20 rounded-none mx-auto mt-2" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-none bg-red-500 hover:bg-red-600 cursor-pointer active:scale-90 transition-transform"
              onClick={() => {
                playTerminalClose();
                setIsOpen(false);
              }}
              role="button"
              aria-label="Close terminal"
            />
            <div
              className="w-3 h-3 rounded-none bg-yellow-500 hover:bg-yellow-600 cursor-pointer active:scale-90 transition-transform"
              onClick={() => setIsMaximized(!isMaximized)}
              role="button"
              aria-label="Toggle maximize"
            />
            <div
              className="w-3 h-3 rounded-none bg-green-500 hover:bg-green-600 cursor-pointer"
              role="button"
              aria-label="Minimize"
            />
            <span className="ml-2 text-white/60 text-xs">
              guest@vara-portfolio:~
            </span>
          </div>
          <div className="flex items-center gap-3 text-white/40">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="hover:text-white"
              aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
            >
              {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button
              onClick={() => {
                playTerminalClose();
                setIsOpen(false);
              }}
              className="hover:text-white"
              aria-label="Close terminal"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* content */}
        <div
          className={`flex-1 overflow-y-auto p-4 selection:bg-white/20 terminal-scrollbar ${terminalTheme}`}
          ref={scrollRef}
          onClick={handleTerminalClick}
        >
          {history.map((entry) => (
            <div key={entry.id} className="mb-2 break-words">
              {entry.content}
            </div>
          ))}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="text-green-400 shrink-0">
              {gameMode ? 'game@portfolio:~$' : 'guest@portfolio:~$'}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                playKeyTick();
              }}
              onKeyDown={handleInputKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 p-0"
              autoFocus
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal input"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
