import type { ResultadoItem, DadoGraficoComparacao, DadoGraficoPorData, ResultadoTesteCompleto } from '../types/graficos'

export function formatarDadosComparacao( // Esse é a formatação de comparação geral entre T12- FC
  dados: ResultadoItem[]
): DadoGraficoComparacao[] {
  return dados.map((item) => ({
    atleta: item.atleta?.nome ?? 'Sem nome',
    valor: item.valor ?? 0,
    teste: item.tipo_teste?.nome ?? 'Sem teste',
    data: item.data_resultado ?? 'Sem data',
  }))
}

export function formatarDadosPorData(// Esse é a formatação para gráfico por data, onde cada linha é uma data e as colunas são os atletas
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

export function agruparTesteCompleto( // Formatação para gráfico completo, onde cada linha é um teste completo (FC1, FC2 e MTS) agrupado por atleta e data
  dados: ResultadoItem[]
): ResultadoTesteCompleto[] {
  const agrupado: Record<string, ResultadoTesteCompleto> = {
}
 dados.forEach((item) => {
    const atleta = item.atleta?.nome ?? 'Sem nome'
    const data = item.data_resultado ?? 'Sem data'
    const nomeTeste = item.tipo_teste?.nome ?? ''
    const valor = item.valor ?? 0

    const chave = `${atleta}-${data}`

    if (!agrupado[chave]) {
      agrupado[chave] = {
        atleta,
        data,
      }
    }

    if (nomeTeste.includes('FC1')) {
      agrupado[chave].FC1 = valor
    }

    if (nomeTeste.includes('FC2')) {
      agrupado[chave].FC2 = valor
    }

    if (nomeTeste.includes('MTS')) {
      agrupado[chave].MTS = valor
    }
  })

  return Object.values(agrupado)
}

export function formatarRadarChart(
  dados: ResultadoTesteCompleto[]
) {
  // Calcula os valores máximos dinamicamente a partir dos dados
  const maxFC1 = Math.max(...dados.map((d) => d.FC1 ?? 0), 1)
  const maxFC2 = Math.max(...dados.map((d) => d.FC2 ?? 0), 1)
  const maxMTS = Math.max(...dados.map((d) => d.MTS ?? 0), 1)

  return [
    {
      metrica: 'FC1',
      ...Object.fromEntries(
        dados.flatMap((item) => [
          [item.atleta, ((item.FC1 ?? 0) / maxFC1) * 100],
          [`${item.atleta}_real`, item.FC1 ?? 0],
        ])
      ),
    },
    {
      metrica: 'FC2',
      ...Object.fromEntries(
        dados.flatMap((item) => [
          [item.atleta, ((item.FC2 ?? 0) / maxFC2) * 100],
          [`${item.atleta}_real`, item.FC2 ?? 0],
        ])
      ),
    },
    {
      metrica: 'MTS',
      ...Object.fromEntries(
        dados.flatMap((item) => [
          [item.atleta, ((item.MTS ?? 0) / maxMTS) * 100],
          [`${item.atleta}_real`, item.MTS ?? 0],
        ])
      ),
    },
  ]
}
