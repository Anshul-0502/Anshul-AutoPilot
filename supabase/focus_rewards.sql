-- Atomic focus-session insert and rewards; RLS is enforced for the caller.
begin;
create or replace function public.ap_complete_focus(p_type text,p_duration numeric,p_date text,p_request_id uuid)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare
  who uuid := auth.uid();
  s public.ap_focus_session;
  xp integer;
  coins integer;
  profile public.ap_skill_profile;
  total_xp numeric;
begin
  if who is null then raise insufficient_privilege; end if;
  if p_type not in ('Pomodoro','Short Break','Long Break','Deep Work','Mindfulness','Meditation') or p_duration<=0 or p_duration>1440 then
    raise exception 'Invalid focus session' using errcode='22023';
  end if;
  xp:=case when p_type='Pomodoro' then 50 else 30 end;
  coins:=case when p_type='Pomodoro' then 10 else 5 end;
  -- Same request id is reused by transport retries. Insert and reward share this transaction.
  insert into public.ap_focus_session(id,user_id,payload)
  values(p_request_id,who,jsonb_build_object('type',p_type,'duration',p_duration,'date',p_date,'rewardProcessed',true,'xpAwarded',xp,'coinsAwarded',coins))
  on conflict(id) do nothing returning * into s;
  if s.id is null then
    select * into s from public.ap_focus_session where id=p_request_id and user_id=who;
    if s.id is null then raise insufficient_privilege; end if;
    xp:=0; coins:=0;
  else
    select * into profile from public.ap_skill_profile where user_id=who for update;
    if profile.id is null then raise exception 'Skill profile must exist'; end if;
    total_xp:=coalesce((profile.payload->>'xp')::numeric,0)+xp;
    update public.ap_skill_profile set payload=payload || jsonb_build_object(
      'xp',total_xp,'coins',coalesce((payload->>'coins')::numeric,0)+coins,
      'level',case when total_xp>=4000 then 6 when total_xp>=2000 then 5 when total_xp>=1000 then 4 when total_xp>=500 then 3 when total_xp>=200 then 2 else 1 end
    ) where id=profile.id;
  end if;
  return jsonb_build_object('session',s.payload || jsonb_build_object('id',s.id,'_id',s.id,'userId',s.user_id,'createdAt',s.created_at,'updatedAt',s.updated_at),'xpEarned',xp,'coinsEarned',coins);
end;
$$;
revoke all on function public.ap_complete_focus(text,numeric,text,uuid) from public,anon;
grant execute on function public.ap_complete_focus(text,numeric,text,uuid) to authenticated;
commit;
