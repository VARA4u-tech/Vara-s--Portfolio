import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, ExternalLink, Loader2 } from 'lucide-react';
import { playClick, playPop } from '@/hooks/useSoundEffects';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl?: string;
  downloadName?: string;
}

const ResumeModal = ({
  isOpen,
  onClose,
  resumeUrl = '/resume.pdf',
  downloadName = 'Durga_Vara_Prasad_Resume.pdf',
}: ResumeModalProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setIsLoaded(false);
      setHasError(false);
      // Focus close button for accessibility
      setTimeout(() => closeButtonRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        playPop();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      playPop();
      onClose();
    }
  };

  const handleIframeLoad = () => {
    setIsLoaded(true);
  };

  const handleIframeError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="Resume Preview"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal Panel */}
          <motion.div
            className="relative w-full max-w-4xl h-[90vh] flex flex-col bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-none"
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            {/* ── Top Bar ── */}
            <div className="flex items-center justify-between px-5 py-3 border-b-4 border-black bg-black text-white shrink-0">
              {/* Left: title */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 border border-red-700" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600" />
                  <span className="w-3 h-3 rounded-full bg-green-500 border border-green-700" />
                </div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/80 hidden sm:block">
                  resume.pdf
                </span>
                <FileText className="w-4 h-4 text-white/60 sm:hidden" />
              </div>

              {/* Center: label */}
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 absolute left-1/2 -translate-x-1/2 hidden md:block">
                Durga Vara Prasad — Resume Preview
              </span>

              {/* Right: actions */}
              <div className="flex items-center gap-2">
                {/* Open in new tab */}
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClick}
                  title="Open in new tab"
                  aria-label="Open resume in new tab"
                  className="p-2 border border-white/20 hover:bg-white/10 transition-colors rounded-none"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Download */}
                <a
                  href={resumeUrl}
                  download={downloadName}
                  onClick={playClick}
                  title="Download resume"
                  aria-label="Download resume"
                  className="flex items-center gap-2 px-4 py-1.5 border-2 border-white bg-white text-black font-mono text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-200 rounded-none"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </a>

                {/* Close */}
                <button
                  ref={closeButtonRef}
                  onClick={() => {
                    playPop();
                    onClose();
                  }}
                  title="Close preview (Esc)"
                  aria-label="Close resume preview"
                  className="p-2 border border-white/20 hover:bg-red-600 hover:border-red-600 transition-colors rounded-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── PDF Viewer ── */}
            <div className="relative flex-1 min-h-0 bg-zinc-100">
              {/* Loading spinner */}
              {!isLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-100 z-10 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-black/40" />
                  <p className="font-mono text-xs uppercase tracking-widest text-black/40">
                    Loading resume...
                  </p>
                </div>
              )}

              {/* Error fallback */}
              {hasError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center">
                  <div className="p-4 border-2 border-black bg-yellow-50">
                    <FileText className="w-12 h-12 text-black/40" />
                  </div>
                  <div>
                    <p className="font-mono font-black uppercase tracking-wider text-sm mb-2">
                      Preview Unavailable
                    </p>
                    <p className="text-xs text-black/50 font-light leading-relaxed">
                      Your browser couldn't embed the PDF.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClick}
                      className="flex items-center gap-2 px-5 py-2.5 border-2 border-black bg-white font-mono text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] rounded-none"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open PDF
                    </a>
                    <a
                      href={resumeUrl}
                      download={downloadName}
                      onClick={playClick}
                      className="flex items-center gap-2 px-5 py-2.5 border-2 border-black bg-black text-white font-mono text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] rounded-none"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  </div>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  src={`${resumeUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                  title="Resume PDF Preview"
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                />
              )}
            </div>

            {/* ── Bottom Bar ── */}
            <div className="flex items-center justify-between px-5 py-2.5 border-t-2 border-black/10 bg-zinc-50 shrink-0">
              <p className="font-mono text-[10px] text-black/40 uppercase tracking-widest">
                Press <kbd className="px-1.5 py-0.5 border border-black/20 bg-white font-mono text-[9px] rounded-none">ESC</kbd> to close
              </p>
              <p className="font-mono text-[10px] text-black/40 uppercase tracking-widest hidden sm:block">
                scroll to read · pinch to zoom
              </p>
              <a
                href={resumeUrl}
                download={downloadName}
                onClick={playClick}
                className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-black hover:text-black/60 transition-colors"
              >
                <Download className="w-3 h-3" />
                Save a Copy
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render into document body via portal to escape stacking contexts
  return createPortal(modalContent, document.body);
};

export default ResumeModal;
