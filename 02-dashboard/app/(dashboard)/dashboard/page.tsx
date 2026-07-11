import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { getAllTasks, getProjectSummaries } from "@/lib/data/projects";

export default async function DashboardPage() {
  const [projects, tasks] = await Promise.all([getProjectSummaries(), getAllTasks()]);
  return <DashboardOverview projects={projects} tasks={tasks} />;
}
