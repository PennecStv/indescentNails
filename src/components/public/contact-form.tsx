"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { contactSchema, type ContactInput } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactInput) {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Une erreur est survenue, réessayez plus tard.");
      return;
    }
    setSubmitted(true);
    reset();
    toast.success("Message envoyé. Merci !");
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-cherry-leaf/30 bg-cherry-leaf/5 p-8 text-center">
        <div className="font-serif text-xl text-cherry-leaf mb-2">
          Message bien reçu 🌸
        </div>
        <p className="text-sm text-foreground/70">
          Je reviens vers vous au plus vite. Pensez à vérifier vos spams si la
          réponse tarde.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="contact-name">Nom</Label>
        <Input
          id="contact-name"
          {...register("name")}
          aria-invalid={!!errors.name}
          className="mt-1.5"
        />
        {errors.name && (
          <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="contact-email">E-mail</Label>
        <Input
          id="contact-email"
          type="email"
          {...register("email")}
          aria-invalid={!!errors.email}
          className="mt-1.5"
        />
        {errors.email && (
          <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          rows={5}
          {...register("message")}
          aria-invalid={!!errors.message}
          className="mt-1.5"
        />
        {errors.message && (
          <p className="text-xs text-destructive mt-1">
            {errors.message.message}
          </p>
        )}
      </div>
      <Button type="submit" variant="cta" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Envoi…" : "Envoyer le message"}
      </Button>
    </form>
  );
}
