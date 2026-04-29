"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { ImageOff } from "lucide-react";

interface BookingPhotoProps {
  filename: string;
  label: string;
}

export function BookingPhoto({ filename, label }: BookingPhotoProps) {
  const [error, setError] = useState(false);
  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wider text-foreground/55">
        {label}
      </div>
      <div className="relative aspect-square rounded-lg border border-border/60 bg-cream overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/40">
            <ImageOff className="h-8 w-8 mb-1" />
            <span className="text-xs">Photo introuvable</span>
          </div>
        ) : (
          <img
            src={`/api/uploads/${filename}`}
            alt={label}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setError(true)}
          />
        )}
      </div>
    </div>
  );
}
