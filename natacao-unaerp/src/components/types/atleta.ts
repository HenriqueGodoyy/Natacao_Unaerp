// Tipos da entidade Atleta (tabela `atleta` no Supabase).
// Os nomes das colunas RG / CPF / Telefone seguem exatamente o schema atual
// (com maiúsculas), por isso são mantidos assim aqui.

export type Atleta = {
  id_atleta: number
  usuario_id: number | null
  nome: string
  data_nascimento: string | null
  sexo: string | null
  RG: string | null
  CPF: string | null
  Telefone: string | null
  responsavel: string | null
  federado: boolean | null
  ativo: boolean | null
  categoria_id: number | null
  turma_id: number | null
  data_criacao: string | null
  categoria: string | null
}

// Campos editáveis pelo formulário de cadastro/edição.
export type AtletaFormData = {
  nome: string
  data_nascimento: string | null
  sexo: string | null
  RG: string | null
  CPF: string | null
  Telefone: string | null
  responsavel: string | null
  categoria: string | null
  federado: boolean
  ativo: boolean
}

export const SEXOS = ['masculino', 'feminino', 'outro'] as const

// Um atleta é considerado ativo a menos que `ativo` seja explicitamente false
// (registros antigos podem ter `ativo` = null).
export function estaAtivo(atleta: Pick<Atleta, 'ativo'>): boolean {
  return atleta.ativo !== false
}
