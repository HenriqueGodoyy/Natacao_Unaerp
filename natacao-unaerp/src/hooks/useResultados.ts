import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import type { ResultadoItem, ResultadoLimiarItem } from '../components/types/graficos'

type EstadoResultados = {
  dados: ResultadoItem[]
  dadosLimiar: ResultadoLimiarItem[]
  carregando: boolean
  erro: string | null
}

/**
 * Busca os resultados de teste e de limiar do Supabase.
 * Centraliza a lógica que antes estava duplicada em
 * AnaliseComparativa e AnaliseIndividual.
 */
export function useResultados(): EstadoResultados {
  const [dados, setDados] = useState<ResultadoItem[]>([])
  const [dadosLimiar, setDadosLimiar] = useState<ResultadoLimiarItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    // Evita atualizar o estado se o componente desmontar durante o fetch
    let ativo = true

    async function buscarResultados() {
      setCarregando(true)

      // Resultados dos testes (T12 etc.)
      const { data, error } = await supabase
        .from('resultado_teste')
        .select(`
          id_resultado_teste,
          valor,
          data_resultado,
          observacao,
          atleta:atleta_id(nome),
          tipo_teste:tipo_teste_id(nome)
        `)
        .order('data_resultado', { ascending: true })

      if (!ativo) return

      if (error) {
        setErro(error.message)
      } else {
        setDados((data as unknown as ResultadoItem[]) ?? [])
      }

      // Resultados do teste de limiar
      const { data: limiarData, error: limiarError } = await supabase
        .from('resultado_limiar')
        .select(`
          percentual,
          tempo_ms,
          teste_limiar:teste_limiar_id (
            data_teste,
            atleta:atleta_id (
              nome
            )
          )
        `)
        .order('percentual', { ascending: true })

      if (!ativo) return

      if (limiarError) {
        setErro(limiarError.message)
      } else {
        setDadosLimiar((limiarData as unknown as ResultadoLimiarItem[]) ?? [])
      }

      setCarregando(false)
    }

    buscarResultados()

    return () => {
      ativo = false
    }
  }, [])

  return { dados, dadosLimiar, carregando, erro }
}
