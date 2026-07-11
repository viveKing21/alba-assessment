"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, ListTodo, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getCompletion } from "@/lib/project-utils";
import type { Project, Task } from "@/lib/supabase/database.types";

import { ProjectDialog } from "./project-dialog";
import { TaskTable } from "@/components/tasks/task-table";

export function ProjectDetails({ project, tasks }: { project: Project; tasks: Task[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const completion = getCompletion(tasks);
  const completedCount = tasks.filter((task) => task.status === "completed").length;

  return (
    <div className="space-y-6">
      <Link className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900" href="/projects">
        <ArrowLeft className="size-4" aria-hidden="true" />All projects
      </Link>
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: project.color }} />
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="size-3 rounded-full ring-4 ring-slate-50" style={{ backgroundColor: project.color }} aria-hidden="true" />
              <p className="text-sm font-medium text-slate-500">Project</p>
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{project.name}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">{project.description || "No description has been added to this project yet."}</p>
          </div>
          <Button variant="outline" onClick={() => setEditing(true)}><Pencil aria-hidden="true" />Edit project</Button>
        </div>
        <div className="mt-7 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
          <div><p className="text-xs font-medium tracking-wide text-slate-400 uppercase">Progress</p><p className="mt-1 text-xl font-semibold text-slate-900">{completion}%</p></div>
          <div><p className="text-xs font-medium tracking-wide text-slate-400 uppercase">Tasks</p><p className="mt-1 inline-flex items-center gap-2 text-xl font-semibold text-slate-900"><ListTodo className="size-4 text-blue-600" aria-hidden="true" />{tasks.length}</p></div>
          <div><p className="text-xs font-medium tracking-wide text-slate-400 uppercase">Complete</p><p className="mt-1 inline-flex items-center gap-2 text-xl font-semibold text-slate-900"><CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />{completedCount}</p></div>
        </div>
      </section>
      <TaskTable projectId={project.id} tasks={tasks} />
      <ProjectDialog open={editing} onOpenChange={setEditing} project={project} onSuccess={() => router.refresh()} />
    </div>
  );
}
