"use client";

import { useState } from "react";
import { CalendarDays, CheckSquare2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PriorityBadge, StatusBadge } from "@/components/shared/status-badge";
import { formatDueDate } from "@/lib/project-utils";
import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/lib/supabase/database.types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { TaskDialog } from "./task-dialog";

export function TaskTable({ projectId, tasks }: { projectId: string; tasks: Task[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [deletingTask, setDeletingTask] = useState<Task | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);
  const debouncedQuery = useDebouncedValue(query);
  const normalizedQuery = debouncedQuery.trim().toLowerCase();
  const filteredTasks = tasks.filter((task) => [task.title, task.description].some((value) => value.toLowerCase().includes(normalizedQuery)));

  function refresh() {
    router.refresh();
  }

  async function deleteTask() {
    if (!deletingTask) return;
    setIsDeleting(true);
    const { error } = await createClient().from("tasks").delete().eq("id", deletingTask.id);
    setIsDeleting(false);

    if (error) {
      toast.error("We could not delete this task. Please try again.");
      return;
    }

    toast.success("Task deleted.");
    setDeletingTask(undefined);
    refresh();
  }

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950">Tasks</h2>
            <p className="mt-1 text-sm text-slate-500">Break the work down, then make progress visible.</p>
          </div>
          <Button onClick={() => setCreateOpen(true)}><Plus aria-hidden="true" />New task</Button>
        </div>
        {tasks.length ? (
          <>
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="relative max-w-sm">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks..." aria-label="Search tasks" />
              </div>
            </div>
            {filteredTasks.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-[720px] w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-medium tracking-wide text-slate-500 uppercase">
                    <tr>
                      <th className="px-5 py-3">Task</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3">Due date</th>
                      <th className="w-20 px-5 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTasks.map((task) => (
                      <tr className="group hover:bg-slate-50/70" key={task.id}>
                        <td className="max-w-sm px-5 py-4">
                          <p className="font-medium text-slate-800">{task.title}</p>
                          {task.description ? <p className="mt-1 truncate text-xs text-slate-500">{task.description}</p> : null}
                        </td>
                        <td className="px-4 py-4"><StatusBadge status={task.status} /></td>
                        <td className="px-4 py-4"><PriorityBadge priority={task.priority} /></td>
                        <td className="px-4 py-4 text-slate-500"><span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5 text-slate-400" aria-hidden="true" />{formatDueDate(task.due_date)}</span></td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                            <Button size="icon-xs" variant="ghost" aria-label={`Edit ${task.title}`} onClick={() => setEditingTask(task)}><Pencil aria-hidden="true" /></Button>
                            <Button size="icon-xs" variant="ghost" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" aria-label={`Delete ${task.title}`} onClick={() => setDeletingTask(task)}><Trash2 aria-hidden="true" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex min-h-52 flex-col items-center justify-center px-5 text-center">
                <Search className="size-5 text-slate-400" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-slate-700">No tasks match that search.</p>
                <Button className="mt-3" variant="ghost" size="sm" onClick={() => setQuery("")}>Clear search</Button>
              </div>
            )}
          </>
        ) : (
          <div className="p-5"><EmptyState icon={CheckSquare2} title="Make the first move" description="Tasks give your project a visible path forward. Add one to get started." actionLabel="Create task" onAction={() => setCreateOpen(true)} /></div>
        )}
      </section>

      <TaskDialog projectId={projectId} open={createOpen} onOpenChange={setCreateOpen} onSuccess={refresh} />
      <TaskDialog projectId={projectId} open={Boolean(editingTask)} onOpenChange={(open) => !open && setEditingTask(undefined)} task={editingTask} onSuccess={refresh} />
      <ConfirmDeleteDialog open={Boolean(deletingTask)} onOpenChange={(open) => !open && setDeletingTask(undefined)} title="Delete this task?" description="This action cannot be undone." onConfirm={deleteTask} isDeleting={isDeleting} />
    </>
  );
}
