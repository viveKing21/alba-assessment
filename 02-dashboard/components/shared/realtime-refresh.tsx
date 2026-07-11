"use client";

import { useEffect, useEffectEvent } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export function RealtimeRefresh({ channelName }: { channelName: string }) {
  const router = useRouter();
  const refresh = useEffectEvent(() => router.refresh());

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`projectpulse:${channelName}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, refresh)
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [channelName]);

  return null;
}
