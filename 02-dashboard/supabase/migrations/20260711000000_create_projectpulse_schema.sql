-- ProjectPulse core schema. Apply with the Supabase CLI or SQL editor.
create extension if not exists "pgcrypto";

create type public.task_status as enum ('todo', 'in_progress', 'completed');
create type public.task_priority as enum ('low', 'medium', 'high');

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 120),
  description text not null default '' check (char_length(description) <= 1000),
  color text not null default '#2563EB' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 160),
  description text not null default '' check (char_length(description) <= 2000),
  status public.task_status not null default 'todo',
  priority public.task_priority not null default 'medium',
  due_date date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index projects_user_id_created_at_idx on public.projects (user_id, created_at desc);
create index tasks_project_id_created_at_idx on public.tasks (project_id, created_at desc);
create index tasks_project_id_status_idx on public.tasks (project_id, status);
create index tasks_created_at_idx on public.tasks (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.tasks enable row level security;

create policy "Users can view their own projects"
on public.projects for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own projects"
on public.projects for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own projects"
on public.projects for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own projects"
on public.projects for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can view tasks in their own projects"
on public.tasks for select
to authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = tasks.project_id
      and projects.user_id = (select auth.uid())
  )
);

create policy "Users can create tasks in their own projects"
on public.tasks for insert
to authenticated
with check (
  exists (
    select 1 from public.projects
    where projects.id = tasks.project_id
      and projects.user_id = (select auth.uid())
  )
);

create policy "Users can update tasks in their own projects"
on public.tasks for update
to authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = tasks.project_id
      and projects.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.projects
    where projects.id = tasks.project_id
      and projects.user_id = (select auth.uid())
  )
);

create policy "Users can delete tasks in their own projects"
on public.tasks for delete
to authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = tasks.project_id
      and projects.user_id = (select auth.uid())
  )
);

-- Full row payloads make delete/update broadcasts useful to subscribed clients.
alter table public.projects replica identity full;
alter table public.tasks replica identity full;
alter publication supabase_realtime add table public.projects, public.tasks;
