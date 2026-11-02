-- Opcional: executar após configurar e validar a integração Instagram.
-- Requer Vault, pg_cron e pg_net conforme schedule.sql.
do $$ begin
  if not exists(select 1 from vault.decrypted_secrets where name='analytics_base_url' and decrypted_secret ~ '^https://[^/]+$')
    or not exists(select 1 from vault.decrypted_secrets where name='analytics_cron_secret' and length(decrypted_secret)>=32)
  then raise exception 'Configure analytics_base_url and analytics_cron_secret in Vault first'; end if;
end $$;
select cron.schedule('figueroa-instagram-hourly','17 * * * *',$job$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name='analytics_base_url') || '/api/cron/sync?provider=instagram',
    headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name='analytics_cron_secret')),
    body := '{}'::jsonb, timeout_milliseconds := 180000
  );
$job$);
