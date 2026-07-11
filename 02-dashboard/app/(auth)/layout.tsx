import Link from "next/link";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative grid min-h-screen overflow-hidden bg-slate-50 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <Link className="mb-12 inline-flex items-center gap-2 font-semibold tracking-tight text-slate-950" href="/login">
            <span className="grid size-8 place-items-center rounded-lg bg-blue-600 font-bold text-white shadow-lg shadow-blue-200">P</span>
            ProjectPulse
          </Link>
          {children}
        </div>
      </section>
      <aside className="relative hidden overflow-hidden bg-slate-950 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-24 -right-20 size-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 size-96 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-medium text-blue-300">Focused work, visible momentum</p>
          <h1 className="mt-5 max-w-md text-4xl font-semibold tracking-tight text-white">Move your work forward with clarity.</h1>
          <p className="mt-5 max-w-sm text-base leading-7 text-slate-300">ProjectPulse brings projects, tasks, and meaningful progress into one calm workspace.</p>
        </div>
        <div className="relative max-w-sm rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-1" aria-hidden="true">
            <span className="size-2 rounded-full bg-blue-300" />
            <span className="size-2 rounded-full bg-slate-600" />
            <span className="size-2 rounded-full bg-slate-600" />
          </div>
          <p className="mt-5 text-sm font-medium text-white">Keep the signal, lose the noise.</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Designed for teams that value a thoughtful, readable view of the work.</p>
        </div>
      </aside>
    </main>
  );
}
