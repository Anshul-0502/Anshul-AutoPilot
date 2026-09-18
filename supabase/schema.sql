-- AutoPilot schema. Apply once to a dedicated Supabase project.
-- Auth owns passwords/sessions. Module-specific JSONB retains existing nested UI shapes.
begin;
create schema if not exists autopilot_private;
revoke all on schema autopilot_private from public, anon, authenticated;
create or replace function autopilot_private.touch_record() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  if NEW.user_id <> OLD.user_id or NEW.id <> OLD.id then
    raise exception 'Record ownership and identity are immutable';
  end if;
  NEW.created_at := OLD.created_at;
  NEW.updated_at := now();
  NEW.version := OLD.version + 1;
  return NEW;
end;
$$;
revoke all on function autopilot_private.touch_record() from public, anon, authenticated;

create table public.ap_alert_register (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_alert_register_owner_created on public.ap_alert_register(user_id, created_at desc, id);
alter table public.ap_alert_register enable row level security;
revoke all on public.ap_alert_register from anon, authenticated;
grant select, insert, update, delete on public.ap_alert_register to authenticated;
create policy owner_select on public.ap_alert_register for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_alert_register for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_alert_register for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_alert_register for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_alert_register for each row execute function autopilot_private.touch_record();

create table public.ap_chat_message (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_chat_message_owner_created on public.ap_chat_message(user_id, created_at desc, id);
alter table public.ap_chat_message enable row level security;
revoke all on public.ap_chat_message from anon, authenticated;
grant select, insert, update, delete on public.ap_chat_message to authenticated;
create policy owner_select on public.ap_chat_message for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_chat_message for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_chat_message for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_chat_message for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_chat_message for each row execute function autopilot_private.touch_record();

create table public.ap_code_snippet (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_code_snippet_owner_created on public.ap_code_snippet(user_id, created_at desc, id);
alter table public.ap_code_snippet enable row level security;
revoke all on public.ap_code_snippet from anon, authenticated;
grant select, insert, update, delete on public.ap_code_snippet to authenticated;
create policy owner_select on public.ap_code_snippet for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_code_snippet for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_code_snippet for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_code_snippet for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_code_snippet for each row execute function autopilot_private.touch_record();

create table public.ap_coding_language (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_coding_language_owner_created on public.ap_coding_language(user_id, created_at desc, id);
alter table public.ap_coding_language enable row level security;
revoke all on public.ap_coding_language from anon, authenticated;
grant select, insert, update, delete on public.ap_coding_language to authenticated;
create policy owner_select on public.ap_coding_language for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_coding_language for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_coding_language for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_coding_language for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_coding_language for each row execute function autopilot_private.touch_record();

create table public.ap_coding_note (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_coding_note_owner_created on public.ap_coding_note(user_id, created_at desc, id);
alter table public.ap_coding_note enable row level security;
revoke all on public.ap_coding_note from anon, authenticated;
grant select, insert, update, delete on public.ap_coding_note to authenticated;
create policy owner_select on public.ap_coding_note for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_coding_note for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_coding_note for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_coding_note for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_coding_note for each row execute function autopilot_private.touch_record();

create table public.ap_coding_resource (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_coding_resource_owner_created on public.ap_coding_resource(user_id, created_at desc, id);
alter table public.ap_coding_resource enable row level security;
revoke all on public.ap_coding_resource from anon, authenticated;
grant select, insert, update, delete on public.ap_coding_resource to authenticated;
create policy owner_select on public.ap_coding_resource for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_coding_resource for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_coding_resource for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_coding_resource for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_coding_resource for each row execute function autopilot_private.touch_record();

create table public.ap_coding_session (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_coding_session_owner_created on public.ap_coding_session(user_id, created_at desc, id);
alter table public.ap_coding_session enable row level security;
revoke all on public.ap_coding_session from anon, authenticated;
grant select, insert, update, delete on public.ap_coding_session to authenticated;
create policy owner_select on public.ap_coding_session for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_coding_session for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_coding_session for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_coding_session for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_coding_session for each row execute function autopilot_private.touch_record();

create table public.ap_dsa_problem (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_dsa_problem_owner_created on public.ap_dsa_problem(user_id, created_at desc, id);
alter table public.ap_dsa_problem enable row level security;
revoke all on public.ap_dsa_problem from anon, authenticated;
grant select, insert, update, delete on public.ap_dsa_problem to authenticated;
create policy owner_select on public.ap_dsa_problem for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_dsa_problem for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_dsa_problem for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_dsa_problem for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_dsa_problem for each row execute function autopilot_private.touch_record();

create table public.ap_data_migration (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_data_migration_owner_created on public.ap_data_migration(user_id, created_at desc, id);
alter table public.ap_data_migration enable row level security;
revoke all on public.ap_data_migration from anon, authenticated;
grant select, insert, update, delete on public.ap_data_migration to authenticated;
create policy owner_select on public.ap_data_migration for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_data_migration for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_data_migration for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_data_migration for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_data_migration for each row execute function autopilot_private.touch_record();
create unique index ap_data_migration_one_per_user on public.ap_data_migration(user_id);

create table public.ap_focus_session (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_focus_session_owner_created on public.ap_focus_session(user_id, created_at desc, id);
alter table public.ap_focus_session enable row level security;
revoke all on public.ap_focus_session from anon, authenticated;
grant select, insert, update, delete on public.ap_focus_session to authenticated;
create policy owner_select on public.ap_focus_session for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_focus_session for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_focus_session for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_focus_session for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_focus_session for each row execute function autopilot_private.touch_record();

create table public.ap_goal (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_goal_owner_created on public.ap_goal(user_id, created_at desc, id);
alter table public.ap_goal enable row level security;
revoke all on public.ap_goal from anon, authenticated;
grant select, insert, update, delete on public.ap_goal to authenticated;
create policy owner_select on public.ap_goal for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_goal for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_goal for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_goal for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_goal for each row execute function autopilot_private.touch_record();

create table public.ap_habit (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_habit_owner_created on public.ap_habit(user_id, created_at desc, id);
alter table public.ap_habit enable row level security;
revoke all on public.ap_habit from anon, authenticated;
grant select, insert, update, delete on public.ap_habit to authenticated;
create policy owner_select on public.ap_habit for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_habit for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_habit for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_habit for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_habit for each row execute function autopilot_private.touch_record();

create table public.ap_health_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_health_profile_owner_created on public.ap_health_profile(user_id, created_at desc, id);
alter table public.ap_health_profile enable row level security;
revoke all on public.ap_health_profile from anon, authenticated;
grant select, insert, update, delete on public.ap_health_profile to authenticated;
create policy owner_select on public.ap_health_profile for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_health_profile for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_health_profile for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_health_profile for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_health_profile for each row execute function autopilot_private.touch_record();
create unique index ap_health_profile_one_per_user on public.ap_health_profile(user_id);

create table public.ap_interview_topic (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_interview_topic_owner_created on public.ap_interview_topic(user_id, created_at desc, id);
alter table public.ap_interview_topic enable row level security;
revoke all on public.ap_interview_topic from anon, authenticated;
grant select, insert, update, delete on public.ap_interview_topic to authenticated;
create policy owner_select on public.ap_interview_topic for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_interview_topic for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_interview_topic for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_interview_topic for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_interview_topic for each row execute function autopilot_private.touch_record();

create table public.ap_meditation_session (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_meditation_session_owner_created on public.ap_meditation_session(user_id, created_at desc, id);
alter table public.ap_meditation_session enable row level security;
revoke all on public.ap_meditation_session from anon, authenticated;
grant select, insert, update, delete on public.ap_meditation_session to authenticated;
create policy owner_select on public.ap_meditation_session for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_meditation_session for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_meditation_session for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_meditation_session for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_meditation_session for each row execute function autopilot_private.touch_record();

create table public.ap_notification (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_notification_owner_created on public.ap_notification(user_id, created_at desc, id);
alter table public.ap_notification enable row level security;
revoke all on public.ap_notification from anon, authenticated;
grant select, insert, update, delete on public.ap_notification to authenticated;
create policy owner_select on public.ap_notification for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_notification for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_notification for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_notification for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_notification for each row execute function autopilot_private.touch_record();

create table public.ap_notification_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_notification_queue_owner_created on public.ap_notification_queue(user_id, created_at desc, id);
alter table public.ap_notification_queue enable row level security;
revoke all on public.ap_notification_queue from anon, authenticated;
grant select, insert, update, delete on public.ap_notification_queue to authenticated;
create policy owner_select on public.ap_notification_queue for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_notification_queue for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_notification_queue for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_notification_queue for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_notification_queue for each row execute function autopilot_private.touch_record();

create table public.ap_planner_event (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_planner_event_owner_created on public.ap_planner_event(user_id, created_at desc, id);
alter table public.ap_planner_event enable row level security;
revoke all on public.ap_planner_event from anon, authenticated;
grant select, insert, update, delete on public.ap_planner_event to authenticated;
create policy owner_select on public.ap_planner_event for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_planner_event for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_planner_event for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_planner_event for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_planner_event for each row execute function autopilot_private.touch_record();

create table public.ap_project (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_project_owner_created on public.ap_project(user_id, created_at desc, id);
alter table public.ap_project enable row level security;
revoke all on public.ap_project from anon, authenticated;
grant select, insert, update, delete on public.ap_project to authenticated;
create policy owner_select on public.ap_project for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_project for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_project for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_project for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_project for each row execute function autopilot_private.touch_record();

create table public.ap_skill_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_skill_profile_owner_created on public.ap_skill_profile(user_id, created_at desc, id);
alter table public.ap_skill_profile enable row level security;
revoke all on public.ap_skill_profile from anon, authenticated;
grant select, insert, update, delete on public.ap_skill_profile to authenticated;
create policy owner_select on public.ap_skill_profile for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_skill_profile for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_skill_profile for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_skill_profile for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_skill_profile for each row execute function autopilot_private.touch_record();
create unique index ap_skill_profile_one_per_user on public.ap_skill_profile(user_id);

create table public.ap_sleep_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_sleep_log_owner_created on public.ap_sleep_log(user_id, created_at desc, id);
alter table public.ap_sleep_log enable row level security;
revoke all on public.ap_sleep_log from anon, authenticated;
grant select, insert, update, delete on public.ap_sleep_log to authenticated;
create policy owner_select on public.ap_sleep_log for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_sleep_log for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_sleep_log for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_sleep_log for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_sleep_log for each row execute function autopilot_private.touch_record();
create unique index ap_sleep_log_one_per_day on public.ap_sleep_log(user_id, (payload->>'date'));

create table public.ap_study_course (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_study_course_owner_created on public.ap_study_course(user_id, created_at desc, id);
alter table public.ap_study_course enable row level security;
revoke all on public.ap_study_course from anon, authenticated;
grant select, insert, update, delete on public.ap_study_course to authenticated;
create policy owner_select on public.ap_study_course for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_study_course for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_study_course for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_study_course for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_study_course for each row execute function autopilot_private.touch_record();

create table public.ap_study_note (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_study_note_owner_created on public.ap_study_note(user_id, created_at desc, id);
alter table public.ap_study_note enable row level security;
revoke all on public.ap_study_note from anon, authenticated;
grant select, insert, update, delete on public.ap_study_note to authenticated;
create policy owner_select on public.ap_study_note for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_study_note for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_study_note for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_study_note for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_study_note for each row execute function autopilot_private.touch_record();

create table public.ap_study_pdf (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_study_pdf_owner_created on public.ap_study_pdf(user_id, created_at desc, id);
alter table public.ap_study_pdf enable row level security;
revoke all on public.ap_study_pdf from anon, authenticated;
grant select, insert, update, delete on public.ap_study_pdf to authenticated;
create policy owner_select on public.ap_study_pdf for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_study_pdf for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_study_pdf for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_study_pdf for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_study_pdf for each row execute function autopilot_private.touch_record();

create table public.ap_study_resource (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_study_resource_owner_created on public.ap_study_resource(user_id, created_at desc, id);
alter table public.ap_study_resource enable row level security;
revoke all on public.ap_study_resource from anon, authenticated;
grant select, insert, update, delete on public.ap_study_resource to authenticated;
create policy owner_select on public.ap_study_resource for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_study_resource for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_study_resource for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_study_resource for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_study_resource for each row execute function autopilot_private.touch_record();

create table public.ap_study_revision (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_study_revision_owner_created on public.ap_study_revision(user_id, created_at desc, id);
alter table public.ap_study_revision enable row level security;
revoke all on public.ap_study_revision from anon, authenticated;
grant select, insert, update, delete on public.ap_study_revision to authenticated;
create policy owner_select on public.ap_study_revision for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_study_revision for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_study_revision for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_study_revision for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_study_revision for each row execute function autopilot_private.touch_record();

create table public.ap_study_session (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_study_session_owner_created on public.ap_study_session(user_id, created_at desc, id);
alter table public.ap_study_session enable row level security;
revoke all on public.ap_study_session from anon, authenticated;
grant select, insert, update, delete on public.ap_study_session to authenticated;
create policy owner_select on public.ap_study_session for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_study_session for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_study_session for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_study_session for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_study_session for each row execute function autopilot_private.touch_record();

create table public.ap_study_subject (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_study_subject_owner_created on public.ap_study_subject(user_id, created_at desc, id);
alter table public.ap_study_subject enable row level security;
revoke all on public.ap_study_subject from anon, authenticated;
grant select, insert, update, delete on public.ap_study_subject to authenticated;
create policy owner_select on public.ap_study_subject for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_study_subject for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_study_subject for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_study_subject for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_study_subject for each row execute function autopilot_private.touch_record();

create table public.ap_task (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_task_owner_created on public.ap_task(user_id, created_at desc, id);
alter table public.ap_task enable row level security;
revoke all on public.ap_task from anon, authenticated;
grant select, insert, update, delete on public.ap_task to authenticated;
create policy owner_select on public.ap_task for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_task for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_task for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_task for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_task for each row execute function autopilot_private.touch_record();

create table public.ap_user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_user_preferences_owner_created on public.ap_user_preferences(user_id, created_at desc, id);
alter table public.ap_user_preferences enable row level security;
revoke all on public.ap_user_preferences from anon, authenticated;
grant select, insert, update, delete on public.ap_user_preferences to authenticated;
create policy owner_select on public.ap_user_preferences for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_user_preferences for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_user_preferences for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_user_preferences for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_user_preferences for each row execute function autopilot_private.touch_record();
create unique index ap_user_preferences_one_per_user on public.ap_user_preferences(user_id);

create table public.ap_user_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_user_profile_owner_created on public.ap_user_profile(user_id, created_at desc, id);
alter table public.ap_user_profile enable row level security;
revoke all on public.ap_user_profile from anon, authenticated;
grant select, insert, update, delete on public.ap_user_profile to authenticated;
create policy owner_select on public.ap_user_profile for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_user_profile for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_user_profile for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_user_profile for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_user_profile for each row execute function autopilot_private.touch_record();
create unique index ap_user_profile_one_per_user on public.ap_user_profile(user_id);

create table public.ap_water_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_water_log_owner_created on public.ap_water_log(user_id, created_at desc, id);
alter table public.ap_water_log enable row level security;
revoke all on public.ap_water_log from anon, authenticated;
grant select, insert, update, delete on public.ap_water_log to authenticated;
create policy owner_select on public.ap_water_log for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_water_log for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_water_log for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_water_log for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_water_log for each row execute function autopilot_private.touch_record();
create unique index ap_water_log_one_per_day on public.ap_water_log(user_id, (payload->>'date'));

create table public.ap_workout (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  version bigint not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ap_workout_owner_created on public.ap_workout(user_id, created_at desc, id);
alter table public.ap_workout enable row level security;
revoke all on public.ap_workout from anon, authenticated;
grant select, insert, update, delete on public.ap_workout to authenticated;
create policy owner_select on public.ap_workout for select to authenticated using ((select auth.uid()) = user_id);
create policy owner_insert on public.ap_workout for insert to authenticated with check ((select auth.uid()) = user_id);
create policy owner_update on public.ap_workout for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy owner_delete on public.ap_workout for delete to authenticated using ((select auth.uid()) = user_id);
create trigger touch_record before update on public.ap_workout for each row execute function autopilot_private.touch_record();

-- Queue processing remains idempotent across page refresh and worker retries.
create index ap_notification_queue_due on public.ap_notification_queue ((payload->>'status'), (payload->>'scheduledFor'));
commit;
