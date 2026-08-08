import { supabase } from '../supabase'
import type { Atleta, AtletaFormData } from '../components/types/atleta'

// Camada de acesso a dados da tabela `atleta`.
// Centraliza as operações de leitura/escrita para as telas de gestão.

export async function listarAtletas(): Promise<Atleta[]> {
  const { data, error } = await supabase
    .from('atleta')
    .select('*')
    .order('nome', { ascending: true })

  if (error) throw error
  return (data as Atleta[]) ?? []
}

export async function buscarAtleta(
  id: number
): Promise<Atleta | null> {
  const { data, error } = await supabase
    .from('atleta')
    .select('*')
    .eq('id_atleta', id)
    .maybeSingle()

  if (error) throw error
  return (data as Atleta | null) ?? null
}

export async function criarAtleta(
  dados: AtletaFormData
): Promise<Atleta> {
  const { data, error } = await supabase
    .from('atleta')
    .insert(dados)
    .select()
    .single()

  if (error) throw error
  return data as Atleta
}

export async function atualizarAtleta(
  id: number,
  dados: Partial<AtletaFormData>
): Promise<Atleta> {
  const { data, error } = await supabase
    .from('atleta')
    .update(dados)
    .eq('id_atleta', id)
    .select()
    .single()

  if (error) throw error
  return data as Atleta
}

// Ativa ou inativa um atleta (soft toggle) sem removê-lo do banco.
export async function definirAtivo(
  id: number,
  ativo: boolean
): Promise<void> {
  const { error } = await supabase
    .from('atleta')
    .update({ ativo })
    .eq('id_atleta', id)

  if (error) throw error
}

// Exclusão definitiva. Pode falhar caso o atleta tenha resultados de
// teste/limiar vinculados (restrição de chave estrangeira) — nesse caso
// a UI orienta a inativar em vez de excluir.
export async function excluirAtleta(id: number): Promise<void> {
  const { error } = await supabase
    .from('atleta')
    .delete()
    .eq('id_atleta', id)

  if (error) throw error
}
