eate extension if not exists "pgcrypto";

create table if not exists categorias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade default auth.uid(),
  nome text not null
);

-- Ativar Row Level Security
alter table categorias enable row level security;

-- Apagar políticas antigas se existirem
drop policy if exists "Selecionar apenas categorias do próprio usuário" on categorias;
drop policy if exists "Permitir INSERT em categorias autenticadas" on categorias;
drop policy if exists "Permitir UPDATE apenas das próprias categorias" on categorias;
drop policy if exists "Permitir DELETE apenas das próprias categorias" on categorias;

-- SELECT
create policy "Selecionar apenas categorias do próprio usuário"
on categorias
for select
using (auth.uid() = user_id);

-- INSERT
create policy "Permitir INSERT em categorias autenticadas"
on categorias
for insert
to authenticated
with check (auth.uid() = user_id);

-- UPDATE
create policy "Permitir UPDATE apenas das próprias categorias"
on categorias
for update
using (auth.uid() = user_id);

-- DELETE
create policy "Permitir DELETE apenas das próprias categorias"
on categorias
for delete
using (auth.uid() = user_id);