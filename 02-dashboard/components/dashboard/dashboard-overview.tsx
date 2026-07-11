import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDotDashed, FolderKanban, ListTodo } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCompletion, getProjectMetrics } from "@/lib/project-utils";
import type { ProjectWithTasks, Task } from "@/lib/supabase/database.types";

export function DashboardOverview({ projects, tasks }: { projects: ProjectWithTasks[]; tasks: Task[] }) {
  const metrics = getProjectMetrics(projects);
  const inProgress = tasks.filter((task) => task.status === "in_progress").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Workspace overview</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Progress, without the noise.</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">A real-time view of the projects and tasks you own.</p>
        </div>
        <Link href="/projects"><Button variant="outline">View all projects<ArrowRight aria-hidden="true" /></Button></Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Workspace metrics">
        <MetricCard label="Projects" value={metrics.projectCount} detail="Active project spaces" icon={FolderKanban} tone="blue" />
        <MetricCard label="Total tasks" value={metrics.taskCount} detail="Across all projects" icon={ListTodo} tone="slate" />
        <MetricCard label="In progress" value={inProgress} detail="Currently being moved" icon={CircleDotDashed} tone="amber" />
        <MetricCard label="Completion" value={`${metrics.completion}%`} detail={`${metrics.completedTaskCount} tasks completed`} icon={CheckCircle2} tone="emerald" />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
          <div><h2 className="text-base font-semibold text-slate-950">Project pulse</h2><p className="mt-1 text-sm text-slate-500">Completion is calculated directly from your tasks.</p></div>
          <Link className="text-sm font-medium text-blue-600 hover:text-blue-700" href="/projects">Manage</Link>
        </div>
        {projects.length ? (
          <div className="divide-y divide-slate-100">
            {projects.slice(0, 5).map((project) => {
              const completion = getCompletion(project.tasks);
              return (
                <Link className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50 sm:px-6" href={`/projects/${project.id}`} key={project.id}>
                  <span className="size-3 rounded-full ring-4 ring-slate-50" style={{ backgroundColor: project.color }} aria-hidden="true" />
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-800 group-hover:text-blue-700">{project.name}</p><p className="mt-1 text-xs text-slate-500">{project.tasks.length} tasks</p></div>
                  <div className="hidden w-36 sm:block"><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width: `${completion}%`, backgroundColor: project.color }} /></div></div>
                  <span className="w-10 text-right text-sm font-semibold text-slate-700">{completion}%</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-16 text-center"><p className="text-sm font-medium text-slate-700">No projects yet</p><p className="mt-1 text-sm text-slate-500">Create a project to start building visible momentum.</p><Link className="mt-4 inline-block" href="/projects"><Button size="sm">Create a project</Button></Link></div>
        )}
      </section>
    </div>
  );
}

function MetricCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string | number; detail: string; icon: typeof FolderKanban; tone: "blue" | "slate" | "amber" | "emerald" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    slate: "bg-slate-100 text-slate-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><p className="text-sm font-medium text-slate-500">{label}</p><span className={`grid size-9 place-items-center rounded-xl ${tones[tone]}`}><Icon className="size-4" aria-hidden="true" /></span></div><p className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></article>;
}
