-- À exécuter une fois dans l'éditeur SQL du projet Supabase, après schema.sql
-- et articles.sql. Ajoute l'espace apprenant (formations/chapitres/vidéos +
-- progression) et le panel d'administration (rôles, invitations, écriture
-- sur les articles).

-- 1. Rôles ---------------------------------------------------------------
-- 'learner' (apprenant, défaut), 'editor' (accès à l'éditeur d'articles
-- uniquement), 'admin' (accès complet au panel).
alter table public.profiles
  add column if not exists role text not null default 'learner'
    check (role in ('learner', 'admin', 'editor'));

-- L'email n'est pas dupliqué depuis auth.users habituellement ; on l'ajoute
-- ici pour l'afficher dans la liste des apprenants (panel admin) sans passer
-- par la clé service_role à chaque requête.
alter table public.profiles add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, status, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', 'pending', new.email);
  return new;
end;
$$;

-- Fonction security definer : évite la récursion RLS quand une policy sur
-- `profiles` (ou une autre table) a besoin de connaître le rôle de
-- l'utilisateur courant.
create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create policy "Un administrateur peut lire tous les profils"
  on public.profiles for select
  using (public.current_user_role() = 'admin');

create policy "Un administrateur peut mettre à jour n'importe quel profil"
  on public.profiles for update
  using (public.current_user_role() = 'admin');

-- 2. Formations / chapitres / vidéos --------------------------------------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  cover_image_url text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  title text not null,
  -- URL du lecteur (iframe Kajabi, fichier direct, Vimeo/Mux...). Volontairement
  -- générique tant que la source d'hébergement vidéo définitive n'est pas
  -- confirmée par Myriam.
  video_url text not null default '',
  duration_seconds integer not null default 0,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists chapters_course_id_idx on public.chapters (course_id);
create index if not exists videos_chapter_id_idx on public.videos (chapter_id);

alter table public.courses enable row level security;
alter table public.chapters enable row level security;
alter table public.videos enable row level security;

-- Lecture : réservée aux comptes actifs (ont payé, voir profiles.status) et
-- à l'équipe admin. Un apprenant "pending" ne voit pas encore le contenu.
create policy "Contenu des formations : lecture réservée aux comptes actifs"
  on public.courses for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
    or public.current_user_role() in ('admin', 'editor')
  );

create policy "Chapitres : lecture réservée aux comptes actifs"
  on public.chapters for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
    or public.current_user_role() in ('admin', 'editor')
  );

create policy "Vidéos : lecture réservée aux comptes actifs"
  on public.videos for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
    or public.current_user_role() in ('admin', 'editor')
  );

-- 3. Progression de visionnage ---------------------------------------------
create table if not exists public.video_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  video_id uuid not null references public.videos (id) on delete cascade,
  seconds_watched integer not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, video_id)
);

alter table public.video_progress enable row level security;

create policy "Un apprenant gère sa propre progression"
  on public.video_progress for all
  using (auth.uid() = user_id or public.current_user_role() = 'admin')
  with check (auth.uid() = user_id);

-- 4. Invitations (équipe admin / éditeur) -----------------------------------
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text not null check (role in ('admin', 'editor')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  invited_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

alter table public.invitations enable row level security;

create policy "Seul un administrateur gère les invitations"
  on public.invitations for all
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- 5. Écriture sur les articles (admin + éditeur) ----------------------------
-- articles.sql ne pose qu'une policy de lecture publique ; on ajoute
-- l'écriture, réservée à l'équipe.
create policy "Admin et éditeur peuvent créer des articles"
  on public.articles for insert
  with check (public.current_user_role() in ('admin', 'editor'));

create policy "Admin et éditeur peuvent modifier des articles"
  on public.articles for update
  using (public.current_user_role() in ('admin', 'editor'));

create policy "Admin et éditeur peuvent supprimer des articles"
  on public.articles for delete
  using (public.current_user_role() in ('admin', 'editor'));

-- 6. Bucket de stockage pour les images (couverture d'article, formations) --
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Lecture publique du bucket media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Admin et éditeur peuvent téléverser dans media"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.current_user_role() in ('admin', 'editor'));

create policy "Admin et éditeur peuvent supprimer dans media"
  on storage.objects for delete
  using (bucket_id = 'media' and public.current_user_role() in ('admin', 'editor'));

-- 7. Amorçage des 5 formations (titres/descriptions réels, voir src/data/content.ts) --
-- Les chapitres et vidéos de chaque formation restent à ajouter manuellement
-- (table editor Supabase ou futur outil dédié) : aucune UI de gestion de
-- contenu de formation n'a été demandée pour le panel admin, seulement le
-- blog, les apprenants et les rôles.
insert into public.courses (slug, title, description, order_index) values
  ('formation-1', 'Formation 1 — Prise de parole stratégique et impact professionnel', 'Développer une communication claire et assurée face à votre audience.', 1),
  ('formation-2', 'Formation 2 — Concevoir une formation de A à Z', 'Structurer un contenu complet, des objectifs réalistes et un plan adapté au marché.', 2),
  ('formation-3', 'Formation 3 — Former avec impact et maîtriser la dynamique de groupe', 'Animer un groupe, gérer les interactions et maintenir l''engagement.', 3),
  ('formation-4', 'Formation 4 — Développer son activité de formateur', 'Stratégie, leadership et rentabilité d''une offre de formation.', 4),
  ('formation-5', 'Formation 5 — L''art de former', 'Posture, aisance et excellence en animation devant un public.', 5)
on conflict (slug) do nothing;

-- 8. Premier compte administrateur -------------------------------------------
-- Remplacer l'email ci-dessous par celui de Myriam puis exécuter une fois
-- qu'elle s'est déjà inscrite normalement via /login (le compte doit exister
-- dans profiles avant cette mise à jour).
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'myriam@exemple.com');
