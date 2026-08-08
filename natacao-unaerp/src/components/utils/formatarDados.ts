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

type Faixa = { min: number; max: number }

// Escala um valor para 0–100 dentro de uma faixa de referência, com uma
// margem de 15% em cada lado para que o melhor não fique colado na borda
// e o pior não colapse no centro.
function escalarNaFaixa(
  valor: number | undefined,
  faixa: Faixa
): number {
  if (valor == null) return 0
  // Sem variação na referência (ex.: um único valor conhecido):
  // usa um ponto médio para não gerar um radar totalmente cheio.
  if (faixa.max <= faixa.min) return 60

  const amplitude = faixa.max - faixa.min
  const lo = faixa.min - amplitude * 0.15
  const hi = faixa.max + amplitude * 0.15
  const pct = ((valor - lo) / (hi - lo)) * 100
  return Math.max(0, Math.min(100, pct))
}

function calcularFaixa(
  referencia: ResultadoTesteCompleto[],
  seletor: (d: ResultadoTesteCompleto) => number | undefined
): Faixa {
  const valores = referencia
    .map(seletor)
    .filter((v): v is number => v != null)
  if (valores.length === 0) return { min: 0, max: 1 }
  return { min: Math.min(...valores), max: Math.max(...valores) }
}

// Formata os dados para o radar T12.
//   `dados`      -> atleta(s)/teste(s) que serão desenhados no radar.
//   `referencia` -> conjunto usado para calcular a faixa de normalização.
//                   Passe TODOS os testes (todos os atletas) para que o
//                   radar mostre a posição relativa à equipe. Se omitido,
//                   usa os próprios `dados` (compatibilidade retroativa).
// Retorna o teste mais recente de cada atleta (um por atleta), em vez de
// depender de uma única data global — assim a comparação em radar mostra
// todos os atletas selecionados, mesmo que tenham testado em datas diferentes.
export function ultimoTestePorAtleta(
  testes: ResultadoTesteCompleto[]
): ResultadoTesteCompleto[] {
  const porAtleta: Record<string, ResultadoTesteCompleto> = {}
  testes.forEach((t) => {
    const atual = porAtleta[t.atleta]
    if (!atual || t.data.localeCompare(atual.data) > 0) {
      porAtleta[t.atleta] = t
    }
  })
  return Object.values(porAtleta)
}

export function formatarRadarChart(
  dados: ResultadoTesteCompleto[],
  referencia: ResultadoTesteCompleto[] = dados
) {
  const faixaFC1 = calcularFaixa(referencia, (d) => d.FC1)
  const faixaFC2 = calcularFaixa(referencia, (d) => d.FC2)
  const faixaMTS = calcularFaixa(referencia, (d) => d.MTS)

  const linha = (
    metrica: string,
    seletor: (d: ResultadoTesteCompleto) => number | undefined,
    faixa: Faixa
  ) => ({
    metrica,
    ...Object.fromEntries(
      dados.flatMap((item) => [
        [item.atleta, escalarNaFaixa(seletor(item), faixa)],
        [`${item.atleta}_real`, seletor(item) ?? 0],
      ])
    ),
  })

  return [
    linha('FC1', (d) => d.FC1, faixaFC1),
    linha('FC2', (d) => d.FC2, faixaFC2),
    linha('MTS', (d) => d.MTS, faixaMTS),
  ]
}
