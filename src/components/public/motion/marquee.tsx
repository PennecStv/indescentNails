"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  separator?: React.ReactNode;
  className?: string;
  reverse?: boolean;
}

export function Marquee({
  items,
  separator,
  className,
  reverse = false,
}: MarqueeProps) {
  const sep = separator ?? (
    <span aria-hidden className="mx-8 text-cherry-bloom/60">
      ✦
    </span>
  );

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden select-none",
        className
      )}
      aria-hidden="true"
    >
      <div
        className="marquee-track flex shrink-0 whitespace-nowrap"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {[0, 1].map((groupIdx) => (
          <div key={groupIdx} className="flex shrink-0 items-center pr-8">
            {items.map((item, i) => (
              <span key={`${groupIdx}-${i}`} className="flex items-center">
                <span>{item}</span>
                {sep}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
