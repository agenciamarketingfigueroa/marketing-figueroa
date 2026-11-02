-- Apply in a dedicated Supabase project. No changes to the static pilot.
create table public.organizations (
  id uuid primary key default gen_random_uuid(), name text not null,
  timezone text not null default 'America/Sao_Paulo', created_at timestamptz not null default now()
);
create table public.organization_members (
  organization_id uuid not null references public.organizations(id),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','viewer')),
  primary key (organization_id,user_id)
);
create function public.can_read_org(org uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(auth.jwt()->>'aal','') = 'aal2' and exists (
    select 1 from public.organization_members m where m.organization_id = org and m.user_id = auth.uid()
  );
$$;
revoke all on function public.can_read_org(uuid) from public;
grant execute on function public.can_read_org(uuid) to authenticated;

create table public.ad_accounts (
  organization_id uuid not null references public.organizations(id), id text not null,
  name text not null, currency text not null check (currency ~ '^[A-Z]{3}$'),
  timezone text not null default 'America/Sao_Paulo', primary key (organization_id,id)
);
create table public.campaigns (
  organization_id uuid not null, account_id text not null, id text not null, name text not null,
  status text not null default 'UNKNOWN', daily_budget bigint, lifetime_budget bigint,
  primary key (organization_id,account_id,id),
  foreign key (organization_id,account_id) references public.ad_accounts(organization_id,id)
);
create table public.adsets (
  organization_id uuid not null, account_id text not null, campaign_id text not null, id text not null,
  name text not null, status text not null default 'UNKNOWN', daily_budget bigint, lifetime_budget bigint,
  primary key (organization_id,account_id,id), unique (organization_id,account_id,campaign_id,id),
  foreign key (organization_id,account_id,campaign_id) references public.campaigns(organization_id,account_id,id)
);
create table public.ads (
  organization_id uuid not null, account_id text not null, campaign_id text not null, adset_id text not null,
  id text not null, name text not null, status text not null default 'UNKNOWN',
  primary key (organization_id,account_id,id), unique (organization_id,account_id,campaign_id,adset_id,id),
  foreign key (organization_id,account_id,campaign_id,adset_id) references public.adsets(organization_id,account_id,campaign_id,id)
);
create table public.ad_insights (
  organization_id uuid not null, account_id text not null, ad_id text not null, date date not null,
  currency text not null check (currency ~ '^[A-Z]{3}$'), spend bigint not null check(spend >= 0),
  impressions bigint not null check(impressions >= 0), clicks bigint, views bigint, checkouts numeric,
  purchases numeric, purchase_value bigint, reach bigint,
  primary key (organization_id,account_id,ad_id,date),
  foreign key (organization_id,account_id,ad_id) references public.ads(organization_id,account_id,id)
);
create index insights_period on public.ad_insights(organization_id,date,currency);
create table public.hotmart_accounts (
  organization_id uuid not null references public.organizations(id), id text not null, name text not null,
  primary key(organization_id,id)
);
create table public.products (
  organization_id uuid not null, account_id text not null, id text not null, name text not null,
  primary key(organization_id,account_id,id),
  foreign key(organization_id,account_id) references public.hotmart_accounts(organization_id,id)
);
create table public.offers (
  organization_id uuid not null, account_id text not null, product_id text not null, code text not null,
  primary key(organization_id,account_id,product_id,code),
  foreign key(organization_id,account_id,product_id) references public.products(organization_id,account_id,id)
);
create table public.hotmart_orders (
  organization_id uuid not null, account_id text not null, transaction text not null,
  product_id text not null, offer text, status text not null check(status in (
    'APPROVED','COMPLETE','CANCELLED','REFUNDED','CHARGEBACK','PARTIALLY_REFUNDED','WAITING_PAYMENT',
    'PRINTED_BILLET','EXPIRED','OVERDUE','PROTESTED','BLOCKED','NO_FUNDS','PRE_ORDER',
    'PROCESSING_TRANSACTION','STARTED','UNDER_ANALISYS','DISPUTE')),
  purchased_at timestamptz not null, approved_at timestamptz, currency text not null check(currency ~ '^[A-Z]{3}$'),
  gross bigint not null check(gross >= 0), net bigint, payment text not null, source jsonb not null default '{}',
  parent_transaction text, is_bump boolean not null default false, is_funnel boolean not null default false,
  provider_updated_at timestamptz not null, last_webhook_at timestamptz, reconciled_at timestamptz, updated_at timestamptz not null default now(),
  primary key(organization_id,account_id,transaction),
  foreign key(organization_id,account_id,product_id) references public.products(organization_id,account_id,id),
  foreign key(organization_id,account_id,product_id,offer) references public.offers(organization_id,account_id,product_id,code)
);
create index orders_period on public.hotmart_orders(organization_id,approved_at,purchased_at,currency);
-- Reserved for itemization; financial reports always sum the order, never order + items.
create table public.hotmart_order_items (
  organization_id uuid not null, account_id text not null, transaction text not null, item_id text not null,
  product_id text not null, amount bigint not null, currency text not null,
  primary key(organization_id,account_id,transaction,item_id),
  foreign key(organization_id,account_id,transaction) references public.hotmart_orders(organization_id,account_id,transaction),
  foreign key(organization_id,account_id,product_id) references public.products(organization_id,account_id,id)
);
create table public.webhook_events (
  organization_id uuid not null, account_id text not null, id text not null, event text not null,
  digest text not null, occurred_at timestamptz not null, received_at timestamptz not null default now(),
  result text not null check(result in ('processed','ignored_stale','ignored_type')),
  primary key(organization_id,account_id,id),
  foreign key(organization_id,account_id) references public.hotmart_accounts(organization_id,id)
);
create table public.attribution_mapping (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null,
  hotmart_account_id text not null, product_id text not null, offer text,
  source_key text not null check(source_key in ('src','sck','xcod','utm_source','utm_medium','utm_campaign','utm_content','utm_term')),
  source_value text not null, account_id text not null, campaign_id text not null, adset_id text not null, ad_id text not null,
  foreign key(organization_id,hotmart_account_id,product_id) references public.products(organization_id,account_id,id),
  foreign key(organization_id,hotmart_account_id,product_id,offer) references public.offers(organization_id,account_id,product_id,code),
  foreign key(organization_id,account_id,campaign_id,adset_id,ad_id) references public.ads(organization_id,account_id,campaign_id,adset_id,id),
  unique nulls not distinct(organization_id,hotmart_account_id,product_id,offer,source_key,source_value)
);
create table public.sync_jobs (
  organization_id uuid not null references public.organizations(id), provider text not null check(provider in ('meta','hotmart')),
  account_id text not null, status text not null default 'pending' check(status in ('pending','running','success','error')),
  lease_id uuid, lease_until timestamptz, last_success timestamptz, last_error text,
  cursor jsonb not null default '{}', primary key(organization_id,provider,account_id)
);
create table public.sync_logs (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id),
  provider text not null, account_id text not null, result text not null, code text,
  created_at timestamptz not null default now()
);
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id),
  action text not null, actor uuid, created_at timestamptz not null default now()
);
create table public.request_limits (key text primary key, window_start timestamptz not null, hits integer not null);

-- Every table is deny-by-default. Application readers get no write policies.
alter table public.organizations enable row level security;
create policy org_read on public.organizations for select to authenticated using(public.can_read_org(id));
alter table public.organization_members enable row level security;
create policy membership_self on public.organization_members for select to authenticated using(user_id = auth.uid());
do $$ declare t text; begin
  foreach t in array array['ad_accounts','campaigns','adsets','ads','ad_insights','hotmart_accounts','products','offers',
    'hotmart_orders','hotmart_order_items','webhook_events','attribution_mapping','sync_jobs','sync_logs','audit_logs'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('create policy org_read on public.%I for select to authenticated using(public.can_read_org(organization_id))',t);
  end loop;
end $$;
alter table public.request_limits enable row level security;
revoke all on all tables in schema public from anon, authenticated;
grant select on public.organizations,public.organization_members,public.ad_accounts,public.campaigns,public.adsets,public.ads,
  public.ad_insights,public.hotmart_accounts,public.products,public.offers,public.hotmart_orders,public.hotmart_order_items,
  public.webhook_events,public.attribution_mapping,public.sync_jobs,public.sync_logs,public.audit_logs to authenticated;
grant all on all tables in schema public to service_role;

-- Atomic lease prevents overlapping runs; fencing token required on writes and completion.
create function public.claim_sync(p_org uuid,p_provider text,p_account text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare token uuid := gen_random_uuid(); claimed uuid;
begin
  insert into public.sync_jobs(organization_id,provider,account_id) values(p_org,p_provider,p_account) on conflict do nothing;
  update public.sync_jobs set lease_id=token,lease_until=now()+interval '4 minutes',status='running'
  where organization_id=p_org and provider=p_provider and account_id=p_account
    and (lease_until is null or lease_until<now()) returning lease_id into claimed;
  return claimed;
end $$;
create function public.finish_sync(p_org uuid,p_provider text,p_account text,p_lease uuid,p_code text,p_cursor jsonb default null) returns void
language plpgsql security definer set search_path = '' as $$
begin
  update public.sync_jobs set status=case when p_code is null then 'success' else 'error' end,
    last_success=case when p_code is null then now() else last_success end,last_error=p_code,
    cursor=coalesce(p_cursor,cursor),lease_until=null,lease_id=null
  where organization_id=p_org and provider=p_provider and account_id=p_account and lease_id=p_lease and lease_until>now();
  if not found then raise exception 'LEASE_EXPIRED'; end if;
  insert into public.sync_logs(organization_id,provider,account_id,result,code)
    values(p_org,p_provider,p_account,case when p_code is null then 'success' else 'error' end,p_code);
end $$;
create function public.take_request(p_key text,p_limit integer) returns boolean
language plpgsql security definer set search_path = '' as $$
declare count_hits integer;
begin
  insert into public.request_limits(key,window_start,hits) values(p_key,date_trunc('minute',now()),1)
  on conflict(key) do update set hits=case when request_limits.window_start<date_trunc('minute',now()) then 1 else request_limits.hits+1 end,
    window_start=date_trunc('minute',now()) returning hits into count_hits;
  return count_hits<=p_limit;
end $$;

-- No raw webhook bodies or buyer PII are persisted. Validated financial projection only.
create function public.apply_hotmart_event(p_org uuid,p_account text,p_event jsonb) returns text
language plpgsql security definer set search_path = '' as $$
declare o jsonb := p_event->'order'; prior public.hotmart_orders; existing_digest text;
  event_time timestamptz := (p_event->>'occurredAt')::timestamptz; outcome text := 'processed';
begin
  if p_event->>'event'='RECONCILIATION' then
    perform 1 from public.sync_jobs where organization_id=p_org and provider='hotmart' and account_id=p_account
      and lease_id=(p_event->>'lease')::uuid and lease_until>now() for update;
    if not found then raise exception 'LEASE_EXPIRED'; end if;
  end if;
  perform pg_advisory_xact_lock(hashtext(p_org::text||p_account),hashtext(coalesce(o->>'transaction',p_event->>'id')));
  select digest into existing_digest from public.webhook_events where organization_id=p_org and account_id=p_account and id=p_event->>'id';
  if found then
    if existing_digest<>p_event->>'digest' then raise exception 'EVENT_ID_CONFLICT'; end if;
    return 'duplicate';
  end if;
  if o is null or o='null'::jsonb then outcome := 'ignored_type';
  else
    select * into prior from public.hotmart_orders where organization_id=p_org and account_id=p_account and transaction=o->>'transaction' for update;
    -- Poll snapshots cannot overwrite a webhook received after the poll began.
    -- Webhook ordering uses provider time, never arrival time.
    if found and (
      (p_event->>'event'<>'RECONCILIATION' and event_time<=prior.provider_updated_at) or
      (p_event->>'event'='RECONCILIATION' and (prior.reconciled_at>=event_time or prior.last_webhook_at>=(p_event->>'observedAt')::timestamptz)) or
      -- A lagging API snapshot must never reopen a refunded/charged-back transaction.
      (prior.status in ('REFUNDED','CHARGEBACK','PARTIALLY_REFUNDED') and o->>'status' in ('APPROVED','COMPLETE','WAITING_PAYMENT','PRINTED_BILLET')) or
      (p_event->>'event'='RECONCILIATION' and prior.status='COMPLETE' and o->>'status'='APPROVED')
    ) then
      outcome := 'ignored_stale';
    else
      insert into public.products(organization_id,account_id,id,name) values(p_org,p_account,o->>'productId',o->>'product')
        on conflict(organization_id,account_id,id) do update set name=excluded.name;
      if o->>'offer' is not null then
        insert into public.offers values(p_org,p_account,o->>'productId',o->>'offer') on conflict do nothing;
      end if;
      insert into public.hotmart_orders(organization_id,account_id,transaction,product_id,offer,status,purchased_at,approved_at,currency,gross,net,payment,source,parent_transaction,is_bump,is_funnel,provider_updated_at,last_webhook_at,reconciled_at)
      values(p_org,p_account,o->>'transaction',o->>'productId',o->>'offer',o->>'status',(o->>'purchasedAt')::timestamptz,
        (o->>'approvedAt')::timestamptz,o->>'currency',(o->>'gross')::bigint,(o->>'net')::bigint,o->>'payment',o->'source',
        o->>'parentTransaction',(o->>'isBump')::boolean,(o->>'isFunnel')::boolean,
        case when p_event->>'event'='RECONCILIATION' then '1970-01-01T00:00:00Z'::timestamptz else event_time end,
        case when p_event->>'event'<>'RECONCILIATION' then now() else null end,
        case when p_event->>'event'='RECONCILIATION' then event_time else null end)
      on conflict(organization_id,account_id,transaction) do update set product_id=excluded.product_id,offer=coalesce(excluded.offer,hotmart_orders.offer),
        status=excluded.status,purchased_at=excluded.purchased_at,approved_at=coalesce(excluded.approved_at,hotmart_orders.approved_at),
        currency=excluded.currency,gross=excluded.gross,net=excluded.net,payment=excluded.payment,
        source=hotmart_orders.source||excluded.source,
        parent_transaction=coalesce(excluded.parent_transaction,hotmart_orders.parent_transaction),
        is_bump=excluded.is_bump or hotmart_orders.is_bump,is_funnel=excluded.is_funnel or hotmart_orders.is_funnel,
        provider_updated_at=greatest(excluded.provider_updated_at,hotmart_orders.provider_updated_at),
        last_webhook_at=coalesce(excluded.last_webhook_at,hotmart_orders.last_webhook_at),
        reconciled_at=coalesce(excluded.reconciled_at,hotmart_orders.reconciled_at),updated_at=now();
    end if;
  end if;
  insert into public.webhook_events(organization_id,account_id,id,event,digest,occurred_at,result)
    values(p_org,p_account,p_event->>'id',p_event->>'event',p_event->>'digest',event_time,outcome);
  return outcome;
end $$;

create function public.commit_meta_snapshot(p_org uuid,p_account text,p_lease uuid,p_start date,p_end date,p_rows jsonb) returns void
language plpgsql security definer set search_path = '' as $$
declare r jsonb;
begin
  perform 1 from public.sync_jobs where organization_id=p_org and provider='meta' and account_id=p_account
    and lease_id=p_lease and lease_until>now() for update;
  if not found then raise exception 'LEASE_EXPIRED'; end if;
  if p_start>p_end or jsonb_typeof(p_rows)<>'array' then raise exception 'INVALID_SNAPSHOT'; end if;
  for r in select * from jsonb_array_elements(p_rows) loop
    if (r->>'date')::date not between p_start and p_end or r->>'accountId'<>p_account then raise exception 'INVALID_SCOPE'; end if;
    insert into public.campaigns(organization_id,account_id,id,name,status,daily_budget,lifetime_budget)
      values(p_org,p_account,r->>'campaignId',r->>'campaign',coalesce(r->>'campaignStatus','UNKNOWN'),(r->>'campaignDailyBudget')::bigint,(r->>'campaignLifetimeBudget')::bigint)
      on conflict(organization_id,account_id,id) do update set name=excluded.name,status=excluded.status,daily_budget=excluded.daily_budget,lifetime_budget=excluded.lifetime_budget;
    insert into public.adsets(organization_id,account_id,campaign_id,id,name,status,daily_budget,lifetime_budget)
      values(p_org,p_account,r->>'campaignId',r->>'adsetId',r->>'adset',coalesce(r->>'adsetStatus','UNKNOWN'),(r->>'adsetDailyBudget')::bigint,(r->>'adsetLifetimeBudget')::bigint)
      on conflict(organization_id,account_id,id) do update set name=excluded.name,status=excluded.status,daily_budget=excluded.daily_budget,lifetime_budget=excluded.lifetime_budget;
    insert into public.ads values(p_org,p_account,r->>'campaignId',r->>'adsetId',r->>'adId',r->>'ad',r->>'status')
      on conflict(organization_id,account_id,id) do update set name=excluded.name,status=excluded.status;
  end loop;
  delete from public.ad_insights where organization_id=p_org and account_id=p_account and date between p_start and p_end;
  insert into public.ad_insights select p_org,p_account,element.value->>'adId',(element.value->>'date')::date,element.value->>'currency',
    (element.value->>'spend')::bigint,(element.value->>'impressions')::bigint,(element.value->>'clicks')::bigint,(element.value->>'views')::bigint,
    (element.value->>'checkouts')::numeric,(element.value->>'purchases')::numeric,(element.value->>'purchaseValue')::bigint,(element.value->>'reach')::bigint
    from jsonb_array_elements(p_rows) as element(value);
end $$;

revoke all on function public.claim_sync(uuid,text,text),public.finish_sync(uuid,text,text,uuid,text,jsonb),
  public.take_request(text,integer),public.apply_hotmart_event(uuid,text,jsonb),
  public.commit_meta_snapshot(uuid,text,uuid,date,date,jsonb) from public,anon,authenticated;
grant execute on function public.claim_sync(uuid,text,text),public.finish_sync(uuid,text,text,uuid,text,jsonb),
  public.take_request(text,integer),public.apply_hotmart_event(uuid,text,jsonb),
  public.commit_meta_snapshot(uuid,text,uuid,date,date,jsonb) to service_role;
