import type { Metadata } from "next";

import { ProjectList } from "@/components/projects/project-list";
import { getProjectSummaries } from "@/lib/data/projects";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getProjectSummaries();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-blue-600">Projects</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Build momentum, one project at a time.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Keep the outcomes that matter organized and let task progress tell the real story.</p>
      </header>
      <ProjectList projects={projects} />
    </div>
  );
}
