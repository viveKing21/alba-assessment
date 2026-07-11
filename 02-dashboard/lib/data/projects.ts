import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Project, ProjectWithTasks, Task } from "@/lib/supabase/database.types";

function throwQueryError(error: Error | null) {
  if (error) {
    throw new Error(error.message);
  }
}

export async function getProjectSummaries(): Promise<ProjectWithTasks[]> {
  const supabase = await createClient();
  const [{ data: projects, error: projectsError }, { data: tasks, error: tasksError }] =
    await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("tasks").select("id, project_id, status"),
    ]);

  throwQueryError(projectsError);
  throwQueryError(tasksError);

  const tasksByProject = new Map<string, Pick<Task, "id" | "status">[]>();
  for (const task of tasks ?? []) {
    const projectTasks = tasksByProject.get(task.project_id) ?? [];
    projectTasks.push(task);
    tasksByProject.set(task.project_id, projectTasks);
  }

  return (projects ?? []).map((project) => ({
    ...project,
    tasks: tasksByProject.get(project.id) ?? [],
  }));
}

export async function getAllTasks(): Promise<Task[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: true });

  throwQueryError(error);
  return data ?? [];
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  throwQueryError(error);
  return data;
}

export async function getProjectTasks(projectId: string): Promise<Task[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  throwQueryError(error);
  return data ?? [];
}
