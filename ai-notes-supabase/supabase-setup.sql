-- Execute no SQL Editor do Supabase

create table if not exists notes (
  id         uuid default gen_random_uuid() primary key,
  title      text,
  summary    text,
  tags       text[],
  color      text,
  original   text,
  autor      text default 'Anônimo',
  created_at timestamptz default now()
);

create index if not exists notes_created_at_idx on notes (created_at desc);
