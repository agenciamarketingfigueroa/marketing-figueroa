-- Run ONLY after deploy validation, in the dedicated Supabase project.
-- First enable pg_cron, pg_net and Vault in Supabase Integrations.
-- Create Vault secrets using the Supabase UI (never commit values):
-- analytics_base_url = HTTPS origin of the Vercel application (without trailing slash)
-- analytics_cron_secret = same random 32+ character value as server CRON_SECRET
do $$ begin
  if not exists(select 1 from vault.decrypted_secrets where name='analytics_base_url' and decrypted_secret ~ '^https://[^/]+$')
    or not exists(select 1 from vault.decrypted_secrets where name='analytics_cron_secret' and length(decrypted_secret)>=32)
  then raise exception 'Configure analytics_base_url and analytics_cron_secret in Vault first'; end if;
end $$;

select cron.schedule('figueroa-meta-5m','*/5 * * * *',$job$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name='analytics_base_url') || '/api/cron/sync?provider=meta',
    headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='analytics_cron_secret')),
    body := '{}'::jsonb, timeout_milliseconds := 180000
  );
$job$);
select cron.schedule('figueroa-hotmart-5m','2-59/5 * * * *',$job$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name='analytics_base_url') || '/api/cron/sync?provider=hotmart',
    headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='analytics_cron_secret')),
    body := '{}'::jsonb, timeout_milliseconds := 180000
  );
$job$);
-- Retention applies to operational metadata only. Keep financial records and idempotency keys.
select cron.schedule('figueroa-log-retention','30 4 * * *',$job$
  delete from public.sync_logs where created_at < now()-interval '90 days';
  delete from public.request_limits where window_start < now()-interval '1 day';
$job$);
