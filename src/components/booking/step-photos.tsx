"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, X } from "lucide-react";

import { ALLOWED_PHOTO_MIME, MAX_PHOTO_BYTES } from "@/lib/validation";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type PhotoFiles = { inspiration: File; current: File };

export function StepPhotos({
  value,
  onChange,
}: {
  value: PhotoFiles | null;
  onChange: (v: PhotoFiles | null) => void;
}) {
  const [inspiration, setInspiration] = useState<File | null>(
    value?.inspiration ?? null
  );
  const [current, setCurrent] = useState<File | null>(value?.current ?? null);

  useEffect(() => {
    if (inspiration && current) {
      onChange({ inspiration, current });
    } else {
      onChange(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspiration, current]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl text-cherry-leaf">
          Photos de référence
        </h3>
        <p className="text-sm text-foreground/65 mt-1">
          Ces deux photos m&apos;aident à préparer le rendez-vous. Formats
          acceptés : JPG, PNG, WebP. 5 Mo maximum.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <PhotoSlot
          label="Modèle souhaité (inspiration)"
          hint="Une photo qui illustre le rendu que vous souhaitez."
          file={inspiration}
          onChange={setInspiration}
        />
        <PhotoSlot
          label="État actuel de vos ongles"
          hint="Une photo récente de vos ongles, avant le rendez-vous."
          file={current}
          onChange={setCurrent}
        />
      </div>
    </div>
  );
}

function PhotoSlot({
  label,
  hint,
  file,
  onChange,
}: {
  label: string;
  hint: string;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function pick(f: File) {
    if (!ALLOWED_PHOTO_MIME.includes(f.type as (typeof ALLOWED_PHOTO_MIME)[number])) {
      setError("Format non supporté (JPG, PNG, WebP).");
      return;
    }
    if (f.size > MAX_PHOTO_BYTES) {
      setError("Photo trop volumineuse (5 Mo max).");
      return;
    }
    setError(null);
    onChange(f);
  }

  function clear() {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      <p className="text-xs text-foreground/55 mb-2">{hint}</p>
      <div
        className={cn(
          "relative aspect-square rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors",
          file ? "border-cherry-leaf/40" : "border-border bg-rose-gold/30"
        )}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={label}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={clear}
              className="absolute top-2 right-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-foreground hover:bg-white"
              aria-label="Retirer la photo"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <label className="flex flex-col items-center gap-2 cursor-pointer text-foreground/55 hover:text-cherry-bloom transition-colors py-8 px-4 text-center">
            <Upload className="h-8 w-8" />
            <span className="text-sm">Cliquez pour choisir une photo</span>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) pick(f);
              }}
            />
          </label>
        )}
      </div>
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}
