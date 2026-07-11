import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";
import { redirectIfAuthenticated } from "@/lib/data/auth";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <>
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600">Welcome back</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Sign in to your workspace</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Continue managing your projects and staying on top of the details.</p>
      </div>
      <AuthForm mode="login" />
    </>
  );
}
