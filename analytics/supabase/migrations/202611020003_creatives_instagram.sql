alter table public.sync_jobs drop constraint sync_jobs_provider_check;
alter table public.sync_jobs add constraint sync_jobs_provider_check check(provider in ('meta','hotmart','instagram'));

create table public.ad_creatives (
  organization_id uuid not null,account_id text not null,ad_id text not null,
  creative_id text not null,name text not null,image_url text,video_id text,kind text not null default 'UNKNOWN',
  updated_at timestamptz not null default now(),primary key(organization_id,account_id,ad_id),
  foreign key(organization_id,account_id,ad_id) references public.ads(organization_id,account_id,id)
);
create table public.instagram_accounts (
  organization_id uuid not null references public.organizations(id),id text not null,username text not null,
  primary key(organization_id,id)
);
create table public.instagram_snapshots (
  organization_id uuid not null,account_id text not null,date date not null,followers bigint not null check(followers>=0),observed_at timestamptz not null,
  primary key(organization_id,account_id,date),foreign key(organization_id,account_id) references public.instagram_accounts(organization_id,id)
);
do $$ declare t text; begin
  foreach t in array array['ad_creatives','instagram_accounts','instagram_snapshots'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('create policy org_read on public.%I for select to authenticated using(public.can_read_org(organization_id))',t);
    execute format('revoke all on public.%I from public,anon,authenticated',t);
    execute format('grant select on public.%I to authenticated',t);
    execute format('grant all on public.%I to service_role',t);
  end loop;
end $$;

create function public.commit_instagram_snapshot(p_org uuid,p_account text,p_lease uuid,p_snapshot jsonb) returns void
language plpgsql security definer set search_path='' as $$
begin
  perform 1 from public.sync_jobs where organization_id=p_org and provider='instagram' and account_id=p_account
    and lease_id=p_lease and lease_until>now() for update;
  if not found then raise exception 'LEASE_EXPIRED';end if;
  if p_snapshot->>'accountId' is distinct from p_account or (p_snapshot->>'date')::date is distinct from ((p_snapshot->>'observedAt')::timestamptz at time zone 'America/Sao_Paulo')::date then raise exception 'INVALID_SCOPE';end if;
  insert into public.instagram_accounts values(p_org,p_account,p_snapshot->>'username') on conflict(organization_id,id) do update set username=excluded.username;
  insert into public.instagram_snapshots values(p_org,p_account,(p_snapshot->>'date')::date,(p_snapshot->>'followers')::bigint,(p_snapshot->>'observedAt')::timestamptz)
    on conflict(organization_id,account_id,date) do update set followers=excluded.followers,observed_at=excluded.observed_at
    where instagram_snapshots.observed_at<excluded.observed_at;
end $$;
revoke all on function public.commit_instagram_snapshot(uuid,text,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.commit_instagram_snapshot(uuid,text,uuid,jsonb) to service_role;

-- Metadata is committed through a separate fenced RPC after the insight transaction.
create function public.commit_ad_creatives(p_org uuid,p_account text,p_lease uuid,p_rows jsonb) returns void
language plpgsql security definer set search_path='' as $$
declare r jsonb;
begin
  perform 1 from public.sync_jobs where organization_id=p_org and provider='meta' and account_id=p_account
    and lease_id=p_lease and lease_until>now() for update;
  if not found then raise exception 'LEASE_EXPIRED';end if;
  for r in select * from jsonb_array_elements(p_rows) loop
    if r->>'accountId' is distinct from p_account then raise exception 'INVALID_SCOPE';end if;
    if r->>'creativeId' is not null then
      insert into public.ad_creatives(organization_id,account_id,ad_id,creative_id,name,image_url,video_id,kind)
      values(p_org,p_account,r->>'adId',r->>'creativeId',r->>'ad',r->>'creativeImage',r->>'creativeVideo',coalesce(r->>'creativeKind','UNKNOWN'))
      on conflict(organization_id,account_id,ad_id) do update set creative_id=excluded.creative_id,name=excluded.name,
        image_url=excluded.image_url,video_id=excluded.video_id,kind=excluded.kind,updated_at=now();
    else
      delete from public.ad_creatives where organization_id=p_org and account_id=p_account and ad_id=r->>'adId';
    end if;
  end loop;
end $$;
revoke all on function public.commit_ad_creatives(uuid,text,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.commit_ad_creatives(uuid,text,uuid,jsonb) to service_role;
do $$ begin
  if exists(select 1 from pg_publication where pubname='supabase_realtime') then
    alter publication supabase_realtime add table public.instagram_snapshots,public.ad_creatives;
  end if;
end $$;
