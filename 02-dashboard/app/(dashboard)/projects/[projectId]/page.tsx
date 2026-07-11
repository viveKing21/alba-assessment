import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetails } from "@/components/projects/project-details";
import { getProject, getProjectTasks } from "@/lib/data/projects";

export const metadata: Metadata = { title: "Project details" };

export default async function ProjectDetailsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  const tasks = await getProjectTasks(project.id);
  return <ProjectDetails project={project} tasks={tasks} />;
}
