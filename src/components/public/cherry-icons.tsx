import { cn } from "@/lib/utils";

type IconProps = React.SVGProps<SVGSVGElement>;

export function CherryFlowerIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      aria-hidden="true"
      {...props}
    >
      <path d="M16 5c-1.6 2.5-2 4.4-1.2 5.6.6.9 1.7 1 1.7 1s.4-2.4-.5-6.6Z" fill="currentColor" />
      <path d="M22.6 9.4c-2.7.6-4.4 1.6-4.7 3-.2 1.1.5 2 .5 2s2.1-1.3 4.2-5Z" fill="currentColor" />
      <path d="M24 18.8c-1.7-2.3-3.4-3.4-4.7-2.9-1 .4-1.4 1.5-1.4 1.5s2.5.4 6.1 1.4Z" fill="currentColor" />
      <path d="M16 27c1.6-2.5 2-4.4 1.2-5.6-.6-.9-1.7-1-1.7-1s-.4 2.4.5 6.6Z" fill="currentColor" />
      <path d="M9.4 22.6c2.7-.6 4.4-1.6 4.7-3 .2-1.1-.5-2-.5-2s-2.1 1.3-4.2 5Z" fill="currentColor" />
      <path d="M8 13.2c1.7 2.3 3.4 3.4 4.7 2.9 1-.4 1.4-1.5 1.4-1.5s-2.5-.4-6.1-1.4Z" fill="currentColor" />
      <circle cx="16" cy="16" r="2.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export function CherryBranchDecoration({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      className={cn(className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M30 170 Q 100 130, 160 110 T 320 60"
        stroke="#7A9E7E"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M120 120 Q 130 105, 145 102"
        stroke="#7A9E7E"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M240 80 Q 255 65, 270 62"
        stroke="#7A9E7E"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Fleurs */}
      <g fill="#C4A5A7" opacity="0.85">
        <circle cx="60" cy="160" r="6" />
        <circle cx="68" cy="155" r="5" />
        <circle cx="55" cy="153" r="5" />
        <circle cx="63" cy="150" r="5" />
      </g>
      <g fill="#C4A5A7" opacity="0.7">
        <circle cx="180" cy="105" r="5" />
        <circle cx="186" cy="102" r="4" />
        <circle cx="176" cy="100" r="4" />
      </g>
      <g fill="#EDE0E1">
        <circle cx="280" cy="70" r="6" />
        <circle cx="286" cy="65" r="5" />
        <circle cx="274" cy="64" r="5" />
        <circle cx="280" cy="60" r="5" />
      </g>
    </svg>
  );
}

export function LeafIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      aria-hidden="true"
      {...props}
    >
      <path d="M5 19c8-1 14-7 14-15-8 1-14 7-14 15Z" fill="currentColor" opacity="0.15" />
      <path d="M5 19c8-1 14-7 14-15-8 1-14 7-14 15Z" />
      <path d="M5 19c4-4 9-9 14-15" />
    </svg>
  );
}
