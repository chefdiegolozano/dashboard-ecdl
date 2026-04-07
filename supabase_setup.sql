-- =======================================================
-- ECDL Dashboard — Setup Supabase
-- Rodar no SQL Editor: supabase.com → projeto → SQL Editor
-- =======================================================

-- 1. Tabela de perfis (vinculada ao auth.users)
create table if not exists public.profiles (
  id     uuid references auth.users on delete cascade primary key,
  email  text,
  nome   text,
  role   text check (role in ('gestor', 'editor', 'analista', 'video_maker'))
           not null default 'editor',
  cargo  text default '',
  created_at timestamptz default now()
);

-- 2. Row Level Security
alter table public.profiles enable row level security;

-- Cada usuário vê e edita apenas o próprio perfil
create policy "proprio_perfil_select"
  on public.profiles for select
  using (auth.uid() = id);

create policy "proprio_perfil_update"
  on public.profiles for update
  using (auth.uid() = id);

-- Gestor vê todos os perfis
create policy "gestor_select_all"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'gestor'
    )
  );

-- 3. Trigger: cria perfil automaticamente ao registrar usuário
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, nome, role, cargo)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'editor'),
    coalesce(new.raw_user_meta_data->>'cargo', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =======================================================
-- Após criar usuários via Authentication → Users,
-- atualize o role de cada um:
--
--   update public.profiles set role = 'gestor', cargo = 'Diretor'
--   where email = 'diego@escola.com';
--
--   update public.profiles set role = 'editor', cargo = 'Editor de Conteúdo'
--   where email = 'editor@escola.com';
-- =======================================================
