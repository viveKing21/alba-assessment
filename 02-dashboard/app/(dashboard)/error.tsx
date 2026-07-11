"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Keep diagnostics in the browser console without exposing internals in the UI.
    console.error("Dashboard request failed");
  }, []);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm">
      <div className="grid size-11 place-items-center rounded-xl bg-rose-50 text-rose-600"><AlertCircle className="size-5" aria-hidden="true" /></div>
      <h1 className="mt-4 text-lg font-semibold text-slate-900">We could not load this workspace</h1>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Check your Supabase connection, then try the request again.</p>
      <Button className="mt-5" onClick={reset}><RefreshCw aria-hidden="true" />Try again</Button>
    </div>
  );
}
