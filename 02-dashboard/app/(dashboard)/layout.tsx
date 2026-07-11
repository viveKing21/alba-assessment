import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RealtimeRefresh } from "@/components/shared/realtime-refresh";
import { getAuthenticatedUser } from "@/lib/data/auth";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getAuthenticatedUser();
  const fullName = typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : "";

  return (
    <DashboardShell email={user.email ?? "Account"} fullName={fullName}>
      <RealtimeRefresh channelName={user.id} />
      {children}
    </DashboardShell>
  );
}
