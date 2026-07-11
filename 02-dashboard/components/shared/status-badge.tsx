import type { TaskPriority, TaskStatus } from "@/lib/supabase/database.types";
import { priorityMeta, statusMeta } from "@/lib/project-utils";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: TaskStatus }) {
  const meta = statusMeta[status];
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1", meta.className)}>
      {meta.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const meta = priorityMeta[priority];
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1", meta.className)}>
      {meta.label}
    </span>
  );
}
