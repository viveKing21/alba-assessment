"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, CheckCircle2, FolderKanban, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { getCompletion, formatDate } from "@/lib/project-utils";
import { createClient } from "@/lib/supabase/client";
import type { Project, ProjectWithTasks } from "@/lib/supabase/database.types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { ProjectDialog } from "./project-dialog";

export function ProjectList({ projects }: { projects: ProjectWithTasks[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [deletingProject, setDeletingProject] = useState<Project | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);
  const debouncedQuery = useDebouncedValue(query);
  const normalizedQuery = debouncedQuery.trim().toLowerCase();
  const filteredProjects = projects.filter((project) =>
    [project.name, project.description].some((value) => value.toLowerCase().includes(normalizedQuery)),
  );

  function refresh() {
    router.refresh();
  }

  async function deleteProject() {
    if (!deletingProject) return;
    setIsDeleting(true);
    const { error } = await createClient().from("projects").delete().eq("id", deletingProject.id);
    setIsDeleting(false);

    if (error) {
      toast.error("We could not delete this project. Please try again.");
      return;
    }

    toast.success("Project deleted.");
    setDeletingProject(undefined);
    refresh();
  }

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950">All projects</h2>
            <p className="mt-1 text-sm text-slate-500">A clear view of every outcome you are moving forward.</p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus aria-hidden="true" />
            New project
          </Button>
        </div>
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects..." aria-label="Search projects" />
          </div>
        </div>
        {filteredProjects.length ? (
          <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onEdit={() => setEditingProject(project)} onDelete={() => setDeletingProject(project)} />
            ))}
          </div>
        ) : (
          <div className="p-5">
            {projects.length ? (
              <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-5 text-center">
                <Search className="size-5 text-slate-400" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-slate-700">No projects match that search.</p>
                <Button className="mt-3" variant="ghost" size="sm" onClick={() => setQuery("")}>Clear search</Button>
              </div>
            ) : (
              <EmptyState icon={FolderKanban} title="Your workspace is ready" description="Create your first project, then break it into thoughtful, trackable tasks." actionLabel="Create project" onAction={() => setCreateOpen(true)} />
            )}
          </div>
        )}
      </section>

      <ProjectDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={refresh} />
      <ProjectDialog open={Boolean(editingProject)} onOpenChange={(open) => !open && setEditingProject(undefined)} project={editingProject} onSuccess={refresh} />
      <ConfirmDeleteDialog
        open={Boolean(deletingProject)}
        onOpenChange={(open) => !open && setDeletingProject(undefined)}
        title="Delete this project?"
        description="All tasks inside this project will also be deleted. This action cannot be undone."
        onConfirm={deleteProject}
        isDeleting={isDeleting}
      />
    </>
  );
}

function ProjectCard({ project, onEdit, onDelete }: { project: ProjectWithTasks; onEdit: () => void; onDelete: () => void }) {
  const completion = getCompletion(project.tasks);
  const completedCount = project.tasks.filter((task) => task.status === "completed").length;

  return (
    <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50">
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: project.color }} />
      <div className="flex items-start justify-between gap-4">
        <span className="mt-0.5 size-3 shrink-0 rounded-full ring-4 ring-slate-50" style={{ backgroundColor: project.color }} aria-hidden="true" />
        <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <Button size="icon-xs" variant="ghost" aria-label={`Edit ${project.name}`} onClick={onEdit}><Pencil aria-hidden="true" /></Button>
          <Button size="icon-xs" variant="ghost" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" aria-label={`Delete ${project.name}`} onClick={onDelete}><Trash2 aria-hidden="true" /></Button>
        </div>
      </div>
      <Link className="mt-4 block rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500" href={`/projects/${project.id}`}>
        <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-blue-700">{project.name}</h3>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{project.description || "No description yet."}</p>
      </Link>
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600">Progress</span>
          <span className="font-semibold text-slate-800">{completion}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${completion}%`, backgroundColor: project.color }} />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-600" aria-hidden="true" />{completedCount}/{project.tasks.length} complete</span>
        <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" aria-hidden="true" />{formatDate(project.created_at)}</span>
      </div>
    </article>
  );
}
