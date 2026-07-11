import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";
import { redirectIfAuthenticated } from "@/lib/data/auth";

export const metadata: Metadata = { title: "Create an account" };

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return (
    <>
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600">Start simply</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Create your workspace</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">A focused home for the work, progress, and priorities that matter.</p>
      </div>
      <AuthForm mode="register" />
    </>
  );
}
