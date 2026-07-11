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
import { projectColors } from "@/lib/project-utils";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/supabase/database.types";
import { projectSchema, type ProjectValues } from "@/lib/validations/project";

type ProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
  onSuccess: () => void;
};

const blankValues: ProjectValues = {
  name: "",
  description: "",
  color: projectColors[0],
};

export function ProjectDialog({ open, onOpenChange, project, onSuccess }: ProjectDialogProps) {
  const editing = Boolean(project);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: blankValues,
  });
  useEffect(() => {
    if (open) {
      const values = project
        ? { name: project.name, description: project.description, color: project.color }
        : blankValues;
      reset(values);
    }
  }, [open, project, reset]);

  async function onSubmit(values: ProjectValues) {
    const supabase = createClient();

    if (project) {
      const { error } = await supabase.from("projects").update(values).eq("id", project.id);
      if (error) {
        setError("root", { message: "We could not update this project. Please try again." });
        return;
      }
      toast.success("Project updated.");
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("root", { message: "Your session expired. Please sign in again." });
        return;
      }

      const { error } = await supabase.from("projects").insert({ ...values, user_id: user.id });
      if (error) {
        setError("root", { message: "We could not create this project. Please try again." });
        return;
      }
      toast.success("Project created.");
    }

    onOpenChange(false);
    onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0" showCloseButton={!isSubmitting}>
        <DialogHeader className="px-5 pt-5 pr-12">
          <DialogTitle>{editing ? "Edit project" : "New project"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update the essentials for this project." : "Start with a clear name and a little context for your future self."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4 px-5 pb-5">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input id="project-name" placeholder="e.g. Product launch" aria-invalid={Boolean(errors.name)} {...register("name")} />
              {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">Description <span className="font-normal text-slate-400">(optional)</span></Label>
              <Textarea id="project-description" placeholder="What outcome are you driving toward?" rows={3} aria-invalid={Boolean(errors.description)} {...register("description")} />
              {errors.description ? <p className="text-xs text-destructive">{errors.description.message}</p> : null}
            </div>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-slate-700">Project color</legend>
              <div className="flex flex-wrap gap-2">
                {projectColors.map((option) => (
                  <label className="cursor-pointer" key={option}>
                    <input className="peer sr-only" type="radio" value={option} aria-label={`Choose ${option} as the project color`} {...register("color")} />
                    <span className="grid size-7 place-items-center rounded-full ring-offset-2 transition-transform after:size-1.5 after:rounded-full after:bg-white after:opacity-0 hover:scale-110 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-checked:ring-2 peer-checked:ring-blue-500 peer-checked:after:opacity-100" style={{ backgroundColor: option }} />
                  </label>
                ))}
              </div>
            </fieldset>
            {errors.root ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{errors.root.message}</p> : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : null}
              {editing ? "Save changes" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
