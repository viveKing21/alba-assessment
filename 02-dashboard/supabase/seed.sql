-- Create this account first in Supabase Auth (or register through the app), then run this script.
-- Email: demo@projectpulse.app
do $$
declare
  demo_user_id uuid;
begin
  select id into demo_user_id from auth.users where email = 'demo@projectpulse.app';

  if demo_user_id is null then
    raise exception 'Create demo@projectpulse.app in Supabase Auth before loading seed data.';
  end if;

  insert into public.projects (id, user_id, name, description, color, created_at)
  values
    ('10000000-0000-4000-8000-000000000001', demo_user_id, 'Platform refresh', 'A focused release plan for the ProjectPulse web experience.', '#2563EB', now() - interval '18 days'),
    ('10000000-0000-4000-8000-000000000002', demo_user_id, 'Mobile foundations', 'Establish the navigation, design tokens, and shared app primitives.', '#0F766E', now() - interval '12 days'),
    ('10000000-0000-4000-8000-000000000003', demo_user_id, 'Developer experience', 'Remove friction from local setup and release workflows.', '#7C3AED', now() - interval '7 days')
  on conflict (id) do update set
    user_id = excluded.user_id,
    name = excluded.name,
    description = excluded.description,
    color = excluded.color;

  insert into public.tasks (id, project_id, title, description, status, priority, due_date, created_at)
  values
    ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Audit the onboarding path', 'Document friction points and proposed improvements.', 'completed', 'high', current_date - 2, now() - interval '17 days'),
    ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Ship workspace navigation', 'Implement the responsive dashboard shell.', 'in_progress', 'high', current_date + 3, now() - interval '14 days'),
    ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'Write release notes', 'Summarize customer-facing changes.', 'todo', 'medium', current_date + 8, now() - interval '3 days'),
    ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'Define navigation states', 'Map mobile and tablet behavior for the primary navigation.', 'completed', 'medium', current_date - 1, now() - interval '10 days'),
    ('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000002', 'Implement token layer', 'Bring shared colors and type decisions into one source.', 'in_progress', 'high', current_date + 5, now() - interval '8 days'),
    ('20000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000003', 'Add local setup checklist', 'Make first-time setup discoverable in under five minutes.', 'todo', 'low', null, now() - interval '4 days')
  on conflict (id) do update set
    project_id = excluded.project_id,
    title = excluded.title,
    description = excluded.description,
    status = excluded.status,
    priority = excluded.priority,
    due_date = excluded.due_date;
end;
$$;
