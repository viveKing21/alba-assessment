"use client";

import { Activity, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getTaskStatusDistribution, getTasksCreatedSeries } from "@/lib/analytics";
import type { Task } from "@/lib/supabase/database.types";

const chartColors = {
  todo: "#94A3B8",
  in_progress: "#2563EB",
  completed: "#10B981",
};

export function AnalyticsCharts({ tasks }: { tasks: Task[] }) {
  const statusData = getTaskStatusDistribution(tasks);
  const createdData = getTasksCreatedSeries(tasks);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-700"><PieChartIcon className="size-4 text-blue-600" aria-hidden="true" />Task status distribution</p>
            <p className="mt-1 text-sm text-slate-500">Where work currently sits across your workspace.</p>
          </div>
          <span className="rounded-lg bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500">{tasks.length} tasks</span>
        </div>
        {tasks.length ? (
          <div className="mt-5 h-72" role="img" aria-label="Pie chart showing task status distribution">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="label" cx="50%" cy="46%" innerRadius={64} outerRadius={92} paddingAngle={3} stroke="none">
                  {statusData.map((item) => <Cell key={item.status} fill={chartColors[item.status]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)" }} />
                <Legend verticalAlign="bottom" iconType="circle" formatter={(value) => <span className="text-xs text-slate-600">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : <ChartEmpty icon={PieChartIcon} message="Create tasks to see their status distribution." />}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-700"><Activity className="size-4 text-blue-600" aria-hidden="true" />Tasks created over time</p>
            <p className="mt-1 text-sm text-slate-500">New tasks across the last two weeks.</p>
          </div>
          <span className="rounded-lg bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500">14 days</span>
        </div>
        {tasks.length ? (
          <div className="mt-5 h-72" role="img" aria-label="Line chart showing tasks created over the past 14 days">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={createdData} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)" }} labelStyle={{ color: "#475569" }} />
                <Line type="monotone" dataKey="count" name="Tasks" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3, fill: "#2563EB", strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : <ChartEmpty icon={BarChart3} message="Create tasks to start measuring your delivery pace." />}
      </section>
    </div>
  );
}

function ChartEmpty({ icon: Icon, message }: { icon: typeof PieChartIcon; message: string }) {
  return (
    <div className="mt-5 flex h-72 flex-col items-center justify-center rounded-xl bg-slate-50 px-6 text-center">
      <Icon className="size-5 text-slate-400" aria-hidden="true" />
      <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">{message}</p>
    </div>
  );
}
