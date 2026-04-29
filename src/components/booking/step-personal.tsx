"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { personalInfoSchema } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type PersonalInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export function StepPersonal({
  value,
  onChange,
}: {
  value: PersonalInfo | null;
  onChange: (v: PersonalInfo | null) => void;
}) {
  const {
    register,
    watch,
    formState: { errors, isValid },
    trigger,
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    mode: "onChange",
    defaultValues: value ?? { firstName: "", lastName: "", phone: "", email: "" },
  });

  const watched = watch();

  useEffect(() => {
    trigger();
  }, [trigger]);

  useEffect(() => {
    if (isValid) onChange(watched);
    else onChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    watched.firstName,
    watched.lastName,
    watched.phone,
    watched.email,
    isValid,
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl text-cherry-leaf">Vos informations</h3>
        <p className="text-sm text-foreground/65 mt-1">
          Coordonnées pour vous recontacter et confirmer le rendez-vous.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" {...register("firstName")} className="mt-1.5" />
          {errors.firstName && (
            <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" {...register("lastName")} className="mt-1.5" />
          {errors.lastName && (
            <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="06 12 34 56 78"
            {...register("phone")}
            className="mt-1.5"
          />
          {errors.phone && (
            <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" {...register("email")} className="mt-1.5" />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
