import type { Metadata } from "next";

import { ProfileForm } from "@/components/profile/profile-form";
import { getAuthenticatedUser } from "@/lib/data/auth";

export const metadata: Metadata = { title: "Profile settings" };

export default async function ProfilePage() {
  const user = await getAuthenticatedUser();
  const fullName = typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : "";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="text-sm font-medium text-blue-600">Account</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Profile settings</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">Manage the personal details connected to your ProjectPulse account.</p>
      </header>
      <ProfileForm email={user.email ?? ""} fullName={fullName} />
    </div>
  );
}
