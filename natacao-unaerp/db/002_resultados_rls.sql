-- ============================================================
--  Natação UNAERP — Policies de RLS para lançamento de resultados
-- ============================================================
--  Libera INSERT/SELECT (e UPDATE/DELETE) para a role `anon` nas
--  tabelas de resultados, para que a tela "Lançar Resultados" funcione.
--
--  Como usar: Supabase -> SQL Editor -> New query -> cole e Run.
--
--  ⚠️  SEGURANÇA: sem autenticação, qualquer pessoa com o link pode
--  gravar. Isso foi combinado como "tela primeiro, login depois".
--  Quando o Supabase Auth entrar, troque `to anon` por `to authenticated`
--  (lançamento liberado a treinador e atletas logados).
-- ============================================================

alter table public.resultado_teste  enable row level security;
alter table public.teste_limiar      enable row level security;
alter table public.resultado_limiar  enable row level security;

-- ─── resultado_teste ───
drop policy if exists "resultado_teste_anon_all" on public.resultado_teste;
create policy "resultado_teste_anon_all"
  on public.resultado_teste for all
  to anon
  using (true)
  with check (true);

-- ─── teste_limiar ───
drop policy if exists "teste_limiar_anon_all" on public.teste_limiar;
create policy "teste_limiar_anon_all"
  on public.teste_limiar for all
  to anon
  using (true)
  with check (true);

-- ─── resultado_limiar ───
drop policy if exists "resultado_limiar_anon_all" on public.resultado_limiar;
create policy "resultado_limiar_anon_all"
  on public.resultado_limiar for all
  to anon
  using (true)
  with check (true);

-- ============================================================
--  VERSÃO COM LOGIN (quando o Auth estiver ativo):
--  troque as 3 policies acima por estas (lançamento liberado a
--  qualquer usuário autenticado — treinador e atletas):
-- ============================================================
-- create policy "resultado_teste_auth_all"  on public.resultado_teste  for all to authenticated using (true) with check (true);
-- create policy "teste_limiar_auth_all"     on public.teste_limiar     for all to authenticated using (true) with check (true);
-- create policy "resultado_limiar_auth_all" on public.resultado_limiar for all to authenticated using (true) with check (true);
