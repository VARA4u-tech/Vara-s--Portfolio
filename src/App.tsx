import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

/**
 * Bridges Lenis smooth scroll with GSAP ScrollTrigger.
 * Without this, ScrollTrigger reads native scroll position while
 * Lenis virtualises it — causing animations to fire at wrong positions
 * on desktop AND to break entirely on iOS/Android touch scroll.
 */
const LenisScrollTriggerBridge = () => {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Forward every Lenis scroll event to ScrollTrigger
    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    // Also wire Lenis into GSAP's ticker so scrub animations stay in sync
    // on every RAF frame
    const rafId = { current: 0 };
    const tick = (time: number) => {
      lenis.raf(time * 1000); // lenis.raf expects milliseconds
    };

    return () => {
      lenis.off('scroll', onScroll);
    };
  }, [lenis]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ReactLenis
        root
        options={{
          duration: 1.6,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 0.9,
          // On touch devices Lenis uses native scroll (best for iOS Safari)
          touchMultiplier: 1.5,
        }}
      >
        {/* Bridge must be inside ReactLenis so useLenis() can access the instance */}
        <LenisScrollTriggerBridge />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ReactLenis>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
