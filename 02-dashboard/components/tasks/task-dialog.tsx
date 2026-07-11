"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/lib/supabase/database.types";
import { taskSchema, type TaskValues } from "@/lib/validations/task";

type TaskDialogProps = {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSuccess: () => void;
};

const blankValues: TaskValues = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  due_date: null,
};

export function TaskDialog({ projectId, open, onOpenChange, task, onSuccess }: TaskDialogProps) {
  const editing = Boolean(task);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TaskValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: blankValues,
  });

  useEffect(() => {
    if (open) {
      reset(
        task
          ? {
              title: task.title,
              description: task.description,
              status: task.status,
              priority: task.priority,
              due_date: task.due_date,
            }
          : blankValues,
      );
    }
  }, [open, reset, task]);

  async function onSubmit(values: TaskValues) {
    const supabase = createClient();
    const payload = { ...values, project_id: projectId };

    if (task) {
      const { error } = await supabase.from("tasks").update(payload).eq("id", task.id);
      if (error) {
        setError("root", { message: "We could not update this task. Please try again." });
        return;
      }
      toast.success("Task updated.");
    } else {
      const { error } = await supabase.from("tasks").insert(payload);
      if (error) {
        setError("root", { message: "We could not create this task. Please try again." });
        return;
      }
      toast.success("Task created.");
    }

    onOpenChange(false);
    onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0" showCloseButton={!isSubmitting}>
        <DialogHeader className="px-5 pt-5 pr-12">
          <DialogTitle>{editing ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>{editing ? "Refine the details and keep the work moving." : "Give this piece of work a clear, actionable shape."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4 px-5 pb-5">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task title</Label>
              <Input id="task-title" placeholder="e.g. Prepare stakeholder review" aria-invalid={Boolean(errors.title)} {...register("title")} />
              {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-description">Description <span className="font-normal text-slate-400">(optional)</span></Label>
              <Textarea id="task-description" rows={3} placeholder="Add the context that makes this task easy to pick up." aria-invalid={Boolean(errors.description)} {...register("description")} />
              {errors.description ? <p className="text-xs text-destructive">{errors.description.message}</p> : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="task-status">Status</Label>
                <select id="task-status" className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" {...register("status")}>
                  <option value="todo">Todo</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-priority">Priority</Label>
                <select id="task-priority" className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" {...register("priority")}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-due-date">Due date</Label>
                <Input id="task-due-date" type="date" {...register("due_date", { setValueAs: (value) => value || null })} />
              </div>
            </div>
            {errors.due_date ? <p className="text-xs text-destructive">{errors.due_date.message}</p> : null}
            {errors.root ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{errors.root.message}</p> : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : null}
              {editing ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
