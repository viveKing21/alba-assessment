export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2"><div className="h-4 w-20 rounded bg-slate-200" /><div className="h-8 w-80 max-w-full rounded bg-slate-200" /><div className="h-4 w-96 max-w-full rounded bg-slate-100" /></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="h-6 w-36 rounded bg-slate-200" /><div className="mt-5 grid gap-4 md:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div className="h-52 rounded-xl bg-slate-100" key={index} />)}</div></div>
    </div>
  );
}
