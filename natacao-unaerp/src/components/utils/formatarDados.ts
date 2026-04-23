import type { ResultadoItem, DadoGraficoComparacao, DadoGraficoPorData } from '../types/graficos'

export function formatarDadosComparacao(
  dados: ResultadoItem[]
): DadoGraficoComparacao[] {
  return dados.map((item) => ({
    atleta: item.atleta?.nome ?? 'Sem nome',
    valor: item.valor ?? 0,
    teste: item.tipo_teste?.nome ?? 'Sem teste',
    data: item.data_resultado ?? 'Sem data',
  }))
}

export function formatarDadosPorData(
  dados: ResultadoItem[]
): DadoGraficoPorData[] {
  const agrupado: Record<string, DadoGraficoPorData> = {}

  dados.forEach((item) => {
    const data = item.data_resultado ?? 'Sem data'
    const atleta = item.atleta?.nome ?? 'Sem nome'
    const valor = item.valor ?? 0

    if (!agrupado[data]) {
      agrupado[data] = { data }
    }

    agrupado[data][atleta] = valor
  })

  return Object.values(agrupado)
}