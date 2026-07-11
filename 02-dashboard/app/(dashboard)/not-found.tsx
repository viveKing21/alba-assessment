import Link from "next/link";
import { FolderX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm">
      <div className="grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-600"><FolderX className="size-5" aria-hidden="true" /></div>
      <h1 className="mt-4 text-lg font-semibold text-slate-900">Project not found</h1>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">It may have been deleted, or you may not have access to it.</p>
      <Link className="mt-5" href="/projects"><Button>Back to projects</Button></Link>
    </div>
  );
}
