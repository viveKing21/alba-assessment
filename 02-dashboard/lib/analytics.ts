import { format, parseISO, startOfDay, subDays } from "date-fns";

import type { Task, TaskStatus } from "@/lib/supabase/database.types";
import { statusMeta } from "@/lib/project-utils";

const statusOrder: TaskStatus[] = ["todo", "in_progress", "completed"];

export function getTaskStatusDistribution(tasks: Task[]) {
  return statusOrder.map((status) => ({
    status,
    label: statusMeta[status].label,
    value: tasks.filter((task) => task.status === status).length,
  }));
}

export function getTasksCreatedSeries(tasks: Task[], days = 14) {
  const counts = new Map<string, number>();
  const start = startOfDay(subDays(new Date(), days - 1));

  for (let index = 0; index < days; index += 1) {
    const date = subDays(start, -index);
    counts.set(format(date, "yyyy-MM-dd"), 0);
  }

  for (const task of tasks) {
    const key = format(parseISO(task.created_at), "yyyy-MM-dd");
    if (counts.has(key)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return Array.from(counts, ([date, count]) => ({
    date,
    label: format(parseISO(date), "MMM d"),
    count,
  }));
}
