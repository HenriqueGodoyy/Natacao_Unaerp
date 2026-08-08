// Tipo da tabela `tipo_teste` (ex.: "T12 - MTS", "T12 - FC1", "T12 - FC2").
export type TipoTeste = {
  id_tipo_teste: number
  nome: string
  unidade: string | null
  descricao: string | null
}

// Um ponto da curva de limiar (percentual de esforço -> tempo).
export type PontoLimiar = {
  percentual: number
  tempo_ms: number
}
