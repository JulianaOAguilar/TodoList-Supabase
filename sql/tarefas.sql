create table if not exists tarefa (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade default auth.uid(),
  nome text not null,
  descricao text,
  data_limite date,
  feito boolean default false,
  categoria_id uuid references categorias(id) on delete set null
);

-- Ativar Row Level Security
alter table tarefa enable row level security;

-- Apagar políticas antigas se existirem
drop policy if exists "Selecionar apenas tarefas do próprio usuário" on tarefa;
drop policy if exists "Permitir INSERT para usuários autenticados" on tarefa;
drop policy if exists "Permitir UPDATE apenas das próprias tarefas" on tarefa;
drop policy if exists "Permitir DELETE apenas das próprias tarefas" on tarefa;

-- SELECT
create policy "Selecionar apenas tarefas do próprio usuário"
on tarefa
for select
using (auth.uid() = user_id);

-- INSERT
create policy "Permitir INSERT para usuários autenticados"
on tarefa
for insert
to authenticated
with check (auth.uid() = user_id);

-- UPDATE
create policy "Permitir UPDATE apenas das próprias tarefas"
on tarefa
for update
using (auth.uid() = user_id);

-- DELETE
create policy "Permitir DELETE apenas das próprias tarefas"
on tarefa
for delete
using (auth.uid() = user_id);
