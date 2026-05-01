"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
  amount?: number;
  duration?: number;
  once?: boolean;
}

const easeOutExpo = [0.19, 1, 0.22, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 24,
  amount = 0.3,
  duration = 0.8,
  once = true,
  ...props
}: RevealProps) {
  const reduced = useReducedMotion();
  const variants: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.4 : duration, delay, ease: easeOutExpo },
    },
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps extends HTMLMotionProps<"div"> {
  staggerChildren?: number;
  delayChildren?: number;
  amount?: number;
  once?: boolean;
}

export function Stagger({
  children,
  staggerChildren = 0.08,
  delayChildren = 0,
  amount = 0.3,
  once = true,
  ...props
}: StaggerProps) {
  const reduced = useReducedMotion();
  const variants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : staggerChildren,
        delayChildren: reduced ? 0 : delayChildren,
      },
    },
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  y = 20,
  ...props
}: HTMLMotionProps<"div"> & { y?: number }) {
  const reduced = useReducedMotion();
  const variants: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.4 : 0.7, ease: easeOutExpo },
    },
  };
  return (
    <motion.div variants={variants} {...props}>
      {children}
    </motion.div>
  );
}

/**
 * Mot-par-mot reveal — découpe la chaîne et anime chaque mot séparément.
 */
export function WordsReveal({
  text,
  className,
  delay = 0,
  staggerChildren = 0.07,
}: {
  text: string;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(/(\s+)/);

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : staggerChildren,
        delayChildren: delay,
      },
    },
  };
  const child: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: "0.5em" },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.4 : 0.9, ease: easeOutExpo },
    },
  };

  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="show"
      variants={container}
      style={{ display: "inline-block" }}
    >
      {words.map((w, i) =>
        w.match(/^\s+$/) ? (
          <span key={i}> </span>
        ) : (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "top",
            }}
          >
            <motion.span
              variants={child}
              style={{ display: "inline-block" }}
            >
              {w}
            </motion.span>
          </span>
        )
      )}
    </motion.span>
  );
}
