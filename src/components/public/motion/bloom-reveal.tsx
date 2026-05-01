"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import { CherryBlossom } from "./cherry-blossom";

interface BloomRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Position de la fleur signature : 'left' | 'right' | 'top' */
  bloomPosition?: "left" | "right" | "top" | "none";
  bloomSize?: number;
  delay?: number;
  /** y offset pour le contenu */
  y?: number;
}

const easeOutExpo = [0.19, 1, 0.22, 1] as const;

/**
 * Combine une apparition au scroll + une fleur signature qui pousse
 * en marge ou au-dessus du contenu.
 */
export function BloomReveal({
  children,
  className,
  bloomPosition = "left",
  bloomSize = 80,
  delay = 0,
  y = 28,
}: BloomRevealProps) {
  const reduced = useReducedMotion();

  const contentVariants: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? 0.4 : 0.9,
        delay: reduced ? delay : delay + 0.3,
        ease: easeOutExpo,
      },
    },
  };

  if (bloomPosition === "none") {
    return (
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={contentVariants}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {bloomPosition === "left" && (
        <span
          className="pointer-events-none absolute -left-2 -top-2 hidden md:block"
          style={{ transform: `translate(-100%, 0)` }}
          aria-hidden
        >
          <CherryBlossom
            size={bloomSize}
            trigger="inView"
            delay={delay}
            withStem={false}
          />
        </span>
      )}
      {bloomPosition === "right" && (
        <span
          className="pointer-events-none absolute -right-2 -top-2 hidden md:block"
          style={{ transform: `translate(100%, 0)` }}
          aria-hidden
        >
          <CherryBlossom
            size={bloomSize}
            trigger="inView"
            delay={delay}
            withStem={false}
          />
        </span>
      )}
      {bloomPosition === "top" && (
        <span
          className="pointer-events-none absolute left-0 -top-4 -translate-y-full hidden md:block"
          aria-hidden
        >
          <CherryBlossom
            size={bloomSize}
            trigger="inView"
            delay={delay}
            withStem={false}
          />
        </span>
      )}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={contentVariants}
      >
        {children}
      </motion.div>
    </div>
  );
}
