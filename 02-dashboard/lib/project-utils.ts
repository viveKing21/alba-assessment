import { format, isPast, isToday, parseISO } from "date-fns";

import type {
  ProjectWithTasks,
  Task,
  TaskPriority,
  TaskStatus,
} from "@/lib/supabase/database.types";

export const projectColors = [
  "#2563EB",
  "#0F766E",
  "#7C3AED",
  "#B45309",
  "#BE123C",
  "#0369A1",
];

export const statusMeta: Record<TaskStatus, { label: string; className: string }> = {
  todo: {
    label: "Todo",
    className: "bg-slate-100 text-slate-700 ring-slate-200",
  },
  in_progress: {
    label: "In progress",
    className: "bg-blue-50 text-blue-700 ring-blue-100",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
};

export const priorityMeta: Record<TaskPriority, { label: string; className: string }> = {
  low: {
    label: "Low",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  high: {
    label: "High",
    className: "bg-rose-50 text-rose-700 ring-rose-100",
  },
};

export function getCompletion(tasks: Pick<Task, "status">[]) {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((task) => task.status === "completed").length / tasks.length) * 100);
}

export function getProjectMetrics(projects: ProjectWithTasks[]) {
  const tasks = projects.flatMap((project) => project.tasks);
  return {
    projectCount: projects.length,
    taskCount: tasks.length,
    completedTaskCount: tasks.filter((task) => task.status === "completed").length,
    completion: getCompletion(tasks),
  };
}

export function formatDate(date: string) {
  return format(parseISO(date), "MMM d, yyyy");
}

export function formatDueDate(date: string | null) {
  if (!date) return "No due date";
  const parsed = parseISO(date);
  if (isToday(parsed)) return "Due today";
  if (isPast(parsed)) return `Overdue ${format(parsed, "MMM d")}`;
  return format(parsed, "MMM d");
}
