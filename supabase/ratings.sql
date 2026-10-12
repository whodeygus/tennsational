-- TENNsational local ratings — run once in Supabase: SQL Editor → New query → Run.
-- Safe to re-run.
--
-- Security model: visitors never touch the ratings table directly. The table
-- has RLS on and no policies, and anon/authenticated have no privileges on it.
-- The site only calls the three functions below, which validate input,
-- rate-limit by IP, and return averages (never voter IDs or IPs).

create table if not exists public.ratings (
  id             bigint generated always as identity primary key,
  restaurant_key text        not null check (restaurant_key ~ '^[A-Za-z0-9_-]{1,100}$'),
  voter_id       uuid        not null,
  stars          smallint    not null check (stars between 1 and 5),
  ip_hash        text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (restaurant_key, voter_id)
);
create index if not exists ratings_ip_recent on public.ratings (ip_hash, created_at);

alter table public.ratings enable row level security;
revoke all on public.ratings from anon, authenticated;

-- Hash of the caller's IP (first X-Forwarded-For hop). Only the hash is stored.
create or replace function public._rater_ip_hash()
returns text language sql stable set search_path = public as $$
  select md5('tennsational:' || split_part(coalesce(
    current_setting('request.headers', true)::json->>'x-forwarded-for', ''), ',', 1))
$$;
revoke all on function public._rater_ip_hash() from public, anon, authenticated;

-- Add or change a rating. One rating per browser per restaurant; changing it
-- is allowed. Returns the restaurant's new average and count.
create or replace function public.submit_rating(p_restaurant_key text, p_voter_id uuid, p_stars int)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_ip   text := public._rater_ip_hash();
  v_new  boolean;
begin
  if p_stars is null or p_stars < 1 or p_stars > 5 then
    raise exception 'Stars must be 1 to 5';
  end if;
  if p_restaurant_key is null or p_restaurant_key !~ '^[A-Za-z0-9_-]{1,100}$' then
    raise exception 'Unknown restaurant';
  end if;
  if p_voter_id is null then
    raise exception 'Missing voter';
  end if;

  v_new := not exists (
    select 1 from public.ratings where restaurant_key = p_restaurant_key and voter_id = p_voter_id);

  if v_new then
    -- Anti-stuffing: at most 3 new ratings per restaurant per network per day,
    -- and 30 new ratings per network per hour overall.
    if (select count(*) from public.ratings
        where ip_hash = v_ip and restaurant_key = p_restaurant_key
          and created_at > now() - interval '1 day') >= 3
    or (select count(*) from public.ratings
        where ip_hash = v_ip and created_at > now() - interval '1 hour') >= 30 then
      raise exception 'Too many ratings from this network — please try again later';
    end if;
  end if;

  insert into public.ratings (restaurant_key, voter_id, stars, ip_hash)
  values (p_restaurant_key, p_voter_id, p_stars, v_ip)
  on conflict (restaurant_key, voter_id)
  do update set stars = excluded.stars, updated_at = now();

  return (
    select json_build_object('avg', round(avg(stars)::numeric, 1), 'count', count(*))
    from public.ratings where restaurant_key = p_restaurant_key);
end;
$$;

-- Averages for every restaurant that has at least one local rating.
create or replace function public.get_rating_summaries()
returns table (restaurant_key text, avg numeric, count bigint)
language sql stable security definer set search_path = public as $$
  select restaurant_key, round(avg(stars)::numeric, 1), count(*)
  from public.ratings group by restaurant_key
$$;

-- The stars this browser gave a restaurant (null if none).
create or replace function public.get_my_rating(p_restaurant_key text, p_voter_id uuid)
returns int language sql stable security definer set search_path = public as $$
  select stars::int from public.ratings
  where restaurant_key = p_restaurant_key and voter_id = p_voter_id
$$;

revoke all on function public.submit_rating(text, uuid, int)  from public;
revoke all on function public.get_rating_summaries()         from public;
revoke all on function public.get_my_rating(text, uuid)      from public;
grant execute on function public.submit_rating(text, uuid, int) to anon, authenticated;
grant execute on function public.get_rating_summaries()        to anon, authenticated;
grant execute on function public.get_my_rating(text, uuid)     to anon, authenticated;
