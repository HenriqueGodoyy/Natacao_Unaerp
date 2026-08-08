-- ============================================================
--  Natação UNAERP — Policies de RLS para a tabela `atleta`
-- ============================================================
--  Como usar:
--    1. Abra o painel do Supabase do projeto.
--    2. Vá em "SQL Editor" -> "New query".
--    3. Cole este arquivo inteiro e clique em "Run".
--
--  O que este script faz:
--    Libera INSERT / UPDATE / DELETE / SELECT na tabela `atleta`
--    para a role `anon` (a chave "publishable" usada pelo front-end).
--
--  ⚠️  ATENÇÃO DE SEGURANÇA
--    Sem autenticação, QUALQUER pessoa com o link do app poderá
--    criar, editar e excluir atletas. Isso é aceitável apenas para
--    uso interno / protótipo. Quando você habilitar o Supabase Auth,
--    troque as policies abaixo pela versão "authenticated" que está
--    comentada no final do arquivo.
-- ============================================================

alter table public.atleta enable row level security;

-- Idempotente: remove versões anteriores antes de recriar.
drop policy if exists "atleta_anon_select" on public.atleta;
drop policy if exists "atleta_anon_insert" on public.atleta;
drop policy if exists "atleta_anon_update" on public.atleta;
drop policy if exists "atleta_anon_delete" on public.atleta;

create policy "atleta_anon_select"
  on public.atleta for select
  to anon
  using (true);

create policy "atleta_anon_insert"
  on public.atleta for insert
  to anon
  with check (true);

create policy "atleta_anon_update"
  on public.atleta for update
  to anon
  using (true)
  with check (true);

create policy "atleta_anon_delete"
  on public.atleta for delete
  to anon
  using (true);

-- ============================================================
--  VERSÃO SEGURA (para quando o Supabase Auth estiver ativo).
--  Descomente e rode isto no lugar das policies acima:
-- ============================================================
-- drop policy if exists "atleta_anon_select" on public.atleta;
-- drop policy if exists "atleta_anon_insert" on public.atleta;
-- drop policy if exists "atleta_anon_update" on public.atleta;
-- drop policy if exists "atleta_anon_delete" on public.atleta;
--
-- create policy "atleta_auth_all"
--   on public.atleta for all
--   to authenticated
--   using (true)
--   with check (true);
