"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Mail, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { profileSchema, type ProfileValues } from "@/lib/validations/profile";

type ProfileFormProps = {
  email: string;
  fullName: string;
};

export function ProfileForm({ email, fullName }: ProfileFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: fullName, email },
  });

  async function onSubmit(values: ProfileValues) {
    const emailChanged = values.email !== email;
    const { error } = await createClient().auth.updateUser({
      email: emailChanged ? values.email : undefined,
      data: { full_name: values.full_name },
    });

    if (error) {
      setError("root", { message: error.message });
      return;
    }

    toast.success(
      emailChanged
        ? "Profile saved. Confirm the email-change link sent to your new address."
        : "Profile updated.",
    );
    router.refresh();
  }

  return (
    <form className="rounded-2xl border border-slate-200 bg-white shadow-sm" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <h2 className="text-base font-semibold text-slate-950">Personal details</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">Your name appears in the workspace navigation. Email changes require confirmation.</p>
      </div>
      <div className="space-y-5 px-5 py-6 sm:px-6">
        <div className="space-y-2">
          <Label htmlFor="full-name"><UserRound className="size-3.5" aria-hidden="true" />Display name</Label>
          <Input id="full-name" placeholder="Your name" autoComplete="name" aria-invalid={Boolean(errors.full_name)} {...register("full_name")} />
          {errors.full_name ? <p className="text-xs text-destructive">{errors.full_name.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-email"><Mail className="size-3.5" aria-hidden="true" />Email address</Label>
          <Input id="profile-email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register("email")} />
          <p className="text-xs leading-5 text-slate-500">Changing your email sends a confirmation link according to your Supabase Auth settings.</p>
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
        </div>
        {errors.root ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{errors.root.message}</p> : null}
      </div>
      <div className="flex justify-end border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : null}
          Save changes
        </Button>
      </div>
    </form>
  );
}
