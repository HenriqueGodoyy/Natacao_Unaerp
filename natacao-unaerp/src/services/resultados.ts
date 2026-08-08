import { supabase } from '../supabase'
import type { TipoTeste, PontoLimiar } from '../components/types/resultado'

// Lista os tipos de teste disponíveis (T12 - MTS/FC1/FC2, etc.).
export async function listarTiposTeste(): Promise<TipoTeste[]> {
  const { data, error } = await supabase
    .from('tipo_teste')
    .select('*')
    .order('id_tipo_teste', { ascending: true })

  if (error) throw error
  return (data as TipoTeste[]) ?? []
}

// Lança um ou mais resultados de teste para um atleta numa data.
// Cada valor preenchido vira uma linha em `resultado_teste`.
export async function lancarResultadosTeste(params: {
  atleta_id: number
  data_resultado: string
  observacao: string | null
  valores: { tipo_teste_id: number; valor: number }[]
}): Promise<void> {
  const linhas = params.valores.map((v) => ({
    atleta_id: params.atleta_id,
    tipo_teste_id: v.tipo_teste_id,
    valor: v.valor,
    data_resultado: params.data_resultado,
    observacao: params.observacao,
  }))

  const { error } = await supabase
    .from('resultado_teste')
    .insert(linhas)
  if (error) throw error
}

// Lança um teste de limiar completo: cria a sessão (`teste_limiar`) e
// insere seus pontos (`resultado_limiar`).
export async function lancarTesteLimiar(params: {
  atleta_id: number
  data_teste: string
  distancia: number | null
  observacao: string | null
  pontos: PontoLimiar[]
}): Promise<void> {
  const { data, error } = await supabase
    .from('teste_limiar')
    .insert({
      atleta_id: params.atleta_id,
      data_teste: params.data_teste,
      distancia: params.distancia,
      observacao: params.observacao,
    })
    .select()
    .single()
  if (error) throw error

  const testeId = (data as { id_teste_limiar: number })
    .id_teste_limiar

  const linhas = params.pontos.map((p) => ({
    teste_limiar_id: testeId,
    percentual: p.percentual,
    tempo_ms: p.tempo_ms,
  }))

  const { error: erroPontos } = await supabase
    .from('resultado_limiar')
    .insert(linhas)
  if (erroPontos) throw erroPontos
}
