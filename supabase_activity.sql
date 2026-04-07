-- =======================================================
-- Feed de Atividade — activity_log
-- Rodar no SQL Editor do Supabase para criar a tabela
-- de registro de atividades do dashboard ECDL.
-- =======================================================

create table if not exists public.activity_log (
  id          bigserial primary key,
  user_id     uuid references auth.users on delete set null,
  user_nome   text not null default 'Sistema',
  user_role   text,
  acao        text not null,         -- ex: 'criou', 'atualizou', 'moveu', 'excluiu'
  entidade    text not null,         -- ex: 'lead', 'matricula', 'kanban', 'checklist'
  descricao   text not null,         -- texto legível: "Criou o lead João Silva"
  meta        jsonb default '{}',    -- dados extras: { id, status_anterior, status_novo, … }
  created_at  timestamptz default now()
);

-- Índices para filtros comuns no feed
create index if not exists activity_log_user_id_idx    on public.activity_log (user_id);
create index if not exists activity_log_entidade_idx   on public.activity_log (entidade);
create index if not exists activity_log_created_at_idx on public.activity_log (created_at desc);

-- Row Level Security
alter table public.activity_log enable row level security;

-- Qualquer usuário autenticado pode ler o feed completo
create policy "activity_log_select"
  on public.activity_log for select
  to authenticated
  using (true);

-- Usuário autenticado insere apenas suas próprias entradas
create policy "activity_log_insert"
  on public.activity_log for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Ninguém pode atualizar ou excluir registros de atividade
-- (log imutável — apenas insert permitido)

-- Ativar Realtime para o feed ao vivo
-- Opção A: Dashboard → Database → Replication → marcar activity_log
-- Opção B: SQL abaixo
alter publication supabase_realtime add table public.activity_log;
