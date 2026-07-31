-- Table des articles du blog.
-- Le contenu utilise le format markdown maison décrit dans src/lib/blog-format.ts.
-- Les articles de démonstration (src/data/articles.ts) sont servis tant que
-- cette table n'est pas peuplée ; une fois peuplée, le site lit depuis Supabase.

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null default '',
  category text,
  author_name text default 'Myriam Perez',
  published_at timestamptz default now(),
  reading_time_minutes integer default 0,
  cover_image_url text,
  tags text[] default '{}',
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists articles_published_at_idx
  on public.articles (published_at desc);

-- Accès public en lecture : le blog est public.
alter table public.articles enable row level security;

create policy "Articles : lecture publique"
  on public.articles for select
  using (true);

-- Exemple d'insertion d'un article :
-- insert into public.articles (slug, title, excerpt, content, category, author_name, published_at, reading_time_minutes, tags)
-- values ('mon-premier-article', 'Mon premier article', 'Résumé de l''article.',
--         '## Première section\n\nUn paragraphe de contenu.\n\nFAQ: Une question ? | Une réponse.',
--         'Certification & agrément', 'Myriam Perez', now(), 5, array['tag1', 'tag2']);
