"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { authSchema, type AuthValues } from "@/lib/validations/auth";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isLogin = mode === "login";
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AuthValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: AuthValues) {
    const supabase = createClient();

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error) {
        setError("root", { message: "Invalid email or password. Please try again." });
        return;
      }

      toast.success("Welcome back to ProjectPulse.");
      router.replace("/dashboard");
      router.refresh();
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      ...values,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });

    if (error) {
      setError("root", { message: error.message });
      return;
    }

    if (data.session) {
      toast.success("Your workspace is ready.");
      router.replace("/dashboard");
      router.refresh();
      return;
    }

    toast.success("Check your inbox to confirm your email address.");
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email ? (
          <p id="email-error" className="text-xs text-destructive">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          placeholder="At least 8 characters"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password ? (
          <p id="password-error" className="text-xs text-destructive">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {errors.root ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
          {errors.root.message}
        </p>
      ) : null}

      <Button className="h-10 w-full" size="lg" disabled={isSubmitting} type="submit">
        {isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : null}
        {isLogin ? "Sign in" : "Create workspace"}
        {!isSubmitting ? <ArrowRight aria-hidden="true" /> : null}
      </Button>

      <p className="text-center text-sm text-slate-500">
        {isLogin ? "New to ProjectPulse?" : "Already have an account?"}{" "}
        <Link className="font-medium text-blue-600 hover:text-blue-700 hover:underline" href={isLogin ? "/register" : "/login"}>
          {isLogin ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
