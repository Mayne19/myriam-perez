-- Table des articles du blog.
-- Depuis l'éditeur admin, le contenu est du HTML (TipTap) stocké dans
-- `content` ; la FAQ vit dans `faq_json`. Les anciens articles (markdown
-- maison décrit dans src/lib/blog-format.ts) restent lisibles : ils sont
-- convertis en HTML à la volée (src/lib/article-html.ts).
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
  faq_json jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists articles_published_at_idx
  on public.articles (published_at desc);

-- Catégories du blog : proposées dans l'éditeur, gérées depuis /admin/categories.
create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  position integer default 0,
  created_at timestamptz default now()
);

-- Accès public en lecture : le blog est public.
alter table public.articles enable row level security;
alter table public.blog_categories enable row level security;

create policy "Articles : lecture publique"
  on public.articles for select
  using (true);

create policy "Catégories : lecture publique"
  on public.blog_categories for select
  using (true);

-- Exemple d'insertion d'un article (éditeur admin → HTML) :
-- insert into public.articles (slug, title, excerpt, content, category, author_name, published_at, reading_time_minutes, tags, faq_json)
-- values ('mon-premier-article', 'Mon premier article', 'Résumé de l''article.',
--         '<h2>Première section</h2><p>Un paragraphe de contenu.</p>',
--         'Certification & agrément', 'Myriam Perez', now(), 5, array['tag1', 'tag2'],
--         '[{"question": "Une question ?", "answer": "Une réponse."}]');
