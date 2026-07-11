"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  ChevronDown,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  Plus,
  UserRoundPen,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

type DashboardShellProps = {
  children: React.ReactNode;
  email: string;
  fullName: string;
};

export function DashboardShell({ children, email, fullName }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = (fullName || email).slice(0, 2).toUpperCase();

  async function signOut() {
    const { error } = await createClient().auth.signOut();
    if (error) {
      toast.error("We could not sign you out. Try again.");
      return;
    }

    toast.success("Signed out successfully.");
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {mobileOpen ? (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-950/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white px-3 py-4 transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
        )}
      >
        <div className="flex h-9 items-center justify-between px-2">
          <Link className="flex items-center gap-2 font-semibold tracking-tight text-slate-950" href="/dashboard">
            <span className="grid size-7 place-items-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm shadow-blue-200">P</span>
            ProjectPulse
          </Link>
          <Button className="lg:hidden" size="icon-sm" variant="ghost" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
            <X aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-8 px-2 text-[11px] font-medium tracking-[0.12em] text-slate-400 uppercase">Workspace</div>
        <nav className="mt-2 space-y-1" aria-label="Primary navigation">
          {navigation.map((item) => {
            const active = pathname === item.href || (item.href === "/projects" && pathname.startsWith("/projects/"));
            const Icon = item.icon;
            return (
              <Link
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                )}
                href={item.href}
                key={item.href}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-700">Organize the work that matters.</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Projects, tasks, and momentum in one focused workspace.</p>
          <Link className="mt-3 inline-flex text-xs font-medium text-blue-600 hover:text-blue-700" href="/projects">
            View projects <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-[#F7F8FA]/90 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <Button className="lg:hidden" size="icon-sm" variant="outline" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
              <Menu aria-hidden="true" />
            </Button>
            <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
              <PanelLeftClose className="size-4 text-slate-400" aria-hidden="true" />
              <span>My workspace</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/projects">
              <Button className="hidden sm:inline-flex" size="sm">
                <Plus aria-hidden="true" />
                New project
              </Button>
              <Button className="sm:hidden" size="icon-sm" aria-label="Create a project">
                <Plus aria-hidden="true" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button className="h-8 gap-2 px-1.5" variant="ghost" />}>
                <Avatar size="sm">
                  <AvatarFallback className="bg-slate-200 font-medium text-slate-700">{initials}</AvatarFallback>
                </Avatar>
                <ChevronDown className="hidden size-3.5 text-slate-400 sm:block" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-1.5 py-1">
                  <p className="text-sm font-medium text-slate-900">Account</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{fullName || email}</p>
                  {fullName ? <p className="mt-0.5 truncate text-xs text-slate-400">{email}</p> : null}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <UserRoundPen aria-hidden="true" />
                  Profile settings
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={signOut}>
                  <LogOut aria-hidden="true" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-7 lg:px-9">{children}</main>
      </div>
    </div>
  );
}
