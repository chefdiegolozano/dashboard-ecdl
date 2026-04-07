-- =======================================================
-- ECDL Dashboard — Tabela de dados compartilhados
-- Rodar no SQL Editor: supabase.com → projeto → SQL Editor
-- =======================================================

create table if not exists public.app_data (
  key        text primary key,
  value      jsonb not null default '[]'::jsonb,
  updated_at timestamptz default now()
);

-- Row Level Security
alter table public.app_data enable row level security;

-- Todos os usuários autenticados leem e gravam (dados são da equipe, não individuais)
create policy "auth_select" on public.app_data
  for select using (auth.role() = 'authenticated');

create policy "auth_insert" on public.app_data
  for insert with check (auth.role() = 'authenticated');

create policy "auth_update" on public.app_data
  for update using (auth.role() = 'authenticated');

-- =======================================================
-- Chaves usadas pelo app:
--   ecdl_posts        → métricas de conteúdo
--   ecdl_pautas       → banco de pautas
--   ecdl_matriculas   → matrículas de alunos
--   ecdl_leads        → pipeline de leads
--   ecdl_calendar     → calendário editorial
--   ecdl_checklists   → checklists
--   ecdl_kanban       → kanban de produção
--   ecdl_triggers     → automações / triggers
--   ecdl_templates    → templates de mensagem/copy
--
-- OBS: ecdl_anthropic_key fica apenas no localStorage (dado sensível por usuário)
-- =======================================================
