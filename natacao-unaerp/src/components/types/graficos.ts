export type ResultadoItem = {
  id_resultado_teste: number
  valor: number | null
  data_resultado: string | null
  observacao: string | null
  atleta: { nome: string } | null
  tipo_teste: { nome: string } | null
}

export type DadoGraficoComparacao = {
  atleta: string
  valor: number
  teste: string
  data: string
}

export type DadoGraficoPorData = { 
  data: string
  [atleta: string]: string | number
}