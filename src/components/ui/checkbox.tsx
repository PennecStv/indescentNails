"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => (
    <label className="inline-flex items-start gap-2 cursor-pointer">
      <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center mt-0.5">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            "peer absolute inset-0 h-full w-full appearance-none rounded border border-input bg-white shadow-sm checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className
          )}
          {...props}
        />
        <Check className="pointer-events-none h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100" />
      </span>
      {label && <span className="text-sm text-foreground/80 leading-tight">{label}</span>}
    </label>
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
