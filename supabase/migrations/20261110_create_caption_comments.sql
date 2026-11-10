create extension if not exists pgcrypto;

create table if not exists public.caption_comments (
  id uuid primary key default gen_random_uuid(),
  caption_id uuid not null references public.captions(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(trim(content)) > 0),
  created_by_user_id uuid not null references public.profiles(id),
  modified_by_user_id uuid not null references public.profiles(id),
  created_datetime_utc timestamptz not null default now(),
  modified_datetime_utc timestamptz not null default now()
);

create index if not exists idx_caption_comments_caption_id
  on public.caption_comments (caption_id);

create index if not exists idx_caption_comments_profile_id
  on public.caption_comments (profile_id);

alter table public.caption_comments enable row level security;

create policy "Users can view caption comments"
  on public.caption_comments
  for select
  using (true);

create policy "Users can insert their own comments"
  on public.caption_comments
  for insert
  with check (
    auth.uid() = profile_id
    and auth.uid() = created_by_user_id
    and auth.uid() = modified_by_user_id
  );

create policy "Users can update their own comments"
  on public.caption_comments
  for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

create policy "Users can delete their own comments"
  on public.caption_comments
  for delete
  using (auth.uid() = profile_id);
