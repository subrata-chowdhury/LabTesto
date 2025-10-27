'use client';
import { useEffect, useRef, useState, RefObject } from "react";

type UseIsVisibleOptions = {
    threshold?: number | number[];
    root?: Element | null;
    rootMargin?: string;
    /**
     * if true, the observer will stop observing after the element becomes visible once
     */
    once?: boolean;
};

/**
 * Hook to detect visibility of an element using IntersectionObserver.
 * Returns a ref to attach to the element and a boolean isVisible flag.
 *
 * Usage:
 * const [ref, isVisible] = useIsVisible({ threshold: 0.5, once: true });
 */
export default function useIsVisible<T extends Element = Element>(
    options: UseIsVisibleOptions = {}
): [RefObject<T | null>, boolean] {
    const { threshold = 0.5, root = null, rootMargin = "0px", once = false } = options;
    const ref = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") {
            // Fallback: treat as visible in environments without IntersectionObserver
            setIsVisible(true);
            return;
        }

        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry) return;

                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) {
                        observer.disconnect();
                    }
                } else if (!once) {
                    // only toggle off if not using "once" behavior
                    setIsVisible(false);
                }
            },
            { threshold, root, rootMargin }
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, [threshold, root, rootMargin, once]);

    return [ref, isVisible];
}