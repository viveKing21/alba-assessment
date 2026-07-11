import type { Metadata } from "next";

import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import { getAllTasks } from "@/lib/data/projects";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const tasks = await getAllTasks();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-blue-600">Analytics</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">See the shape of your work.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Live charts translate your task records into useful signals about focus and pace.</p>
      </header>
      <AnalyticsCharts tasks={tasks} />
    </div>
  );
}
