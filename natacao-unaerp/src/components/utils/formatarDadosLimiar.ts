import type { ResultadoLimiarItem } from '../types/graficos'

export function formatarDadosLimiar(
  dados: ResultadoLimiarItem[]
) {
  const agrupado: Record<string, any> = {}

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