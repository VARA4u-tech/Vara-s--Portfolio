/**
 * src/hooks/useGSAP.ts
 *
 * React-safe GSAP hook.
 * Wraps gsap.context() so all animations created inside are
 * automatically killed when the component unmounts — preventing memory leaks.
 *
 * Usage:
 *   const containerRef = useRef<HTMLElement>(null);
 *   useGSAPContext(() => {
 *     gsap.from('.my-el', { opacity: 0, y: 30 });
 *   }, containerRef);
 */
import {
  useEffect,
  useLayoutEffect,
  useRef,
  DependencyList,
  RefObject,
} from 'react';
import { gsap } from '@/lib/gsap';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * @param callback  - Function that creates GSAP animations. Return a cleanup fn if needed.
 * @param scope     - Ref to the container element (scopes selector queries)
 * @param deps      - Dependency array (like useEffect)
 */
export function useGSAPContext(
  callback: (context: gsap.Context) => void | (() => void),
  scope?: RefObject<Element | null>,
  deps: DependencyList = [],
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      callbackRef.current(self);
    }, scope?.current ?? document.body);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
