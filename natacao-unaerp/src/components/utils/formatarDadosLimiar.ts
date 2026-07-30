import type { ResultadoLimiarItem, DadoGraficoLimiar } from '../types/graficos'

export function formatarDadosLimiar(
  dados: ResultadoLimiarItem[]
): DadoGraficoLimiar[] {
  const agrupado: Record<number, DadoGraficoLimiar> = {}

  dados.forEach((item) => {
    const percentual = item.percentual
    const atleta = item.teste_limiar.atleta.nome

    if (!agrupado[percentual]) {
      agrupado[percentual] = {
        percentual,
      }
    }

    agrupado[percentual][atleta] = item.tempo_ms
  })

  return Object.values(agrupado)
}
