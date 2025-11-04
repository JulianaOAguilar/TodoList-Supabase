create extension if not exists "pgcrypto";

create table tarefas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  data_conclusao date,
  feito boolean default false
);

alter table tarefas rename column data_conclusao to data_limite;

