"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost-leaf" | "white";
type Size = "default" | "lg";

interface FillButtonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  iconRight?: React.ReactNode;
  uppercase?: boolean;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
}

const VARIANT_CLASS: Record<
  Variant,
  { base: string; fill: string; hoverText: string }
> = {
  primary: {
    // Fond cherry-bloom → wipe en cherry-leaf (passe rose → vert)
    base: "bg-cherry-bloom text-white border border-cherry-bloom",
    fill: "bg-cherry-leaf",
    hoverText: "group-hover:text-white",
  },
  outline: {
    // Texte cherry-leaf au repos, wipe en cherry-leaf → texte passe en blanc
    base: "bg-transparent text-cherry-leaf border border-cherry-leaf/60",
    fill: "bg-cherry-leaf",
    hoverText: "group-hover:text-white",
  },
  "ghost-leaf": {
    // Fond cherry-leaf → wipe en cherry-bloom (vert → rose), texte reste blanc
    base: "bg-cherry-leaf text-white border border-cherry-leaf",
    fill: "bg-cherry-bloom",
    hoverText: "group-hover:text-white",
  },
  white: {
    // Bouton blanc → wipe cherry-leaf, texte cherry-leaf passe en blanc
    base: "bg-white text-cherry-leaf border border-white",
    fill: "bg-cherry-leaf",
    hoverText: "group-hover:text-white",
  },
};

const SIZE_CLASS: Record<Size, string> = {
  default: "px-7 py-3 text-xs",
  lg: "px-9 py-4 text-sm",
};

/**
 * Bouton avec wipe hover (un fond se remplit gauche → droite, le texte
 * change de couleur). Polymorphique : <Link> si `href`, <button> sinon.
 */
export function FillButton({
  variant = "primary",
  size = "default",
  className,
  children,
  iconRight,
  uppercase = true,
  href,
  external,
  onClick,
  type = "button",
  disabled,
  ariaLabel,
}: FillButtonProps) {
  const v = VARIANT_CLASS[variant];
  const s = SIZE_CLASS[size];

  const baseClass = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-[0.18em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cherry-bloom disabled:opacity-60 disabled:pointer-events-none",
    uppercase && "uppercase",
    v.base,
    s,
    className
  );

  const inner = (
    <>
      <span
        aria-hidden
        className={cn(
          "fill-wipe absolute inset-0 -translate-x-full group-hover:translate-x-0",
          v.fill
        )}
      />
      <span
        className={cn(
          "relative z-10 inline-flex items-center gap-2 transition-colors duration-150",
          v.hoverText
        )}
      >
        {children}
        {iconRight && (
          <span className="inline-flex transition-transform duration-500 group-hover:translate-x-1">
            {iconRight}
          </span>
        )}
      </span>
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClass}
          onClick={onClick}
          aria-label={ariaLabel}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={baseClass} onClick={onClick} aria-label={ariaLabel}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={baseClass}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {inner}
    </button>
  );
}
