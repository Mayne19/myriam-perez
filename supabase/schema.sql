-- À exécuter une fois dans l'éditeur SQL du projet Supabase.
-- Crée la table des comptes (statut pending/active) et la synchronise
-- automatiquement avec les inscriptions Supabase Auth.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  status text not null default 'pending' check (status in ('pending', 'active')),
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Un utilisateur peut lire son propre profil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Un utilisateur peut mettre à jour son propre profil"
  on public.profiles for update
  using (auth.uid() = id);

-- Crée automatiquement une ligne "profiles" (statut pending) à chaque
-- inscription via Supabase Auth, à partir du nom complet fourni au signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, status)
  values (new.id, new.raw_user_meta_data ->> 'full_name', 'pending');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
