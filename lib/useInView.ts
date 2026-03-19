"use client";
import { useEffect, useState, RefObject } from "react";

interface Options {
  threshold?: number;
  once?: boolean;
}

export function useInView(
  ref: RefObject<Element>,
  { threshold = 0, once = true }: Options = {}
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, once]);

  return inView;
}
