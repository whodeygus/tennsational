-- "TENNsational Approved" badges — run once in Supabase: SQL Editor → New query → Run.
-- Safe to re-run. Requires ratings.sql to have been run first.
--
-- Anyone can read which restaurants are approved. Only someone with the
-- admin passcode (stored as a bcrypt hash) can approve or un-approve.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.admin_settings (
  key   text primary key,
  value text not null
);
alter table public.admin_settings enable row level security;
revoke all on public.admin_settings from anon, authenticated;

create table if not exists public.approved_restaurants (
  restaurant_key text primary key check (restaurant_key ~ '^[A-Za-z0-9_-]{1,100}$'),
  approved_at    timestamptz not null default now()
);
alter table public.approved_restaurants enable row level security;
revoke all on public.approved_restaurants from anon, authenticated;

-- True if the passcode matches. Wrong guesses wait 2 seconds to slow down
-- anyone trying to guess it.
create or replace function public._check_admin_passcode(p_passcode text)
returns boolean language plpgsql volatile set search_path = public as $$
declare v_hash text;
begin
  select value into v_hash from public.admin_settings where key = 'admin_passcode_hash';
  if v_hash is not null and p_passcode is not null
     and extensions.crypt(p_passcode, v_hash) = v_hash then
    return true;
  end if;
  perform pg_sleep(2);
  return false;
end;
$$;
revoke all on function public._check_admin_passcode(text) from public, anon, authenticated;

create or replace function public.check_admin(p_passcode text)
returns boolean language sql volatile security definer set search_path = public as $$
  select public._check_admin_passcode(p_passcode)
$$;

create or replace function public.set_approved(p_restaurant_key text, p_approved boolean, p_passcode text)
returns boolean language plpgsql volatile security definer set search_path = public as $$
begin
  if not public._check_admin_passcode(p_passcode) then
    raise exception 'Wrong passcode';
  end if;
  if p_restaurant_key is null or p_restaurant_key !~ '^[A-Za-z0-9_-]{1,100}$' then
    raise exception 'Unknown restaurant';
  end if;
  if p_approved then
    insert into public.approved_restaurants (restaurant_key) values (p_restaurant_key)
    on conflict (restaurant_key) do nothing;
  else
    delete from public.approved_restaurants where restaurant_key = p_restaurant_key;
  end if;
  return p_approved;
end;
$$;

create or replace function public.get_approved()
returns setof text language sql stable security definer set search_path = public as $$
  select restaurant_key from public.approved_restaurants
$$;

revoke all on function public.check_admin(text)                 from public;
revoke all on function public.set_approved(text, boolean, text) from public;
revoke all on function public.get_approved()                    from public;
grant execute on function public.check_admin(text)                 to anon, authenticated;
grant execute on function public.set_approved(text, boolean, text) to anon, authenticated;
grant execute on function public.get_approved()                    to anon, authenticated;

-- Set (or change) your admin passcode: replace the text between the quotes,
-- then run this line. Use 10+ characters. Only the hash is stored.
insert into public.admin_settings (key, value)
values ('admin_passcode_hash', extensions.crypt('CHANGE-ME-TO-YOUR-PASSCODE', extensions.gen_salt('bf')))
on conflict (key) do update set value = excluded.value;
