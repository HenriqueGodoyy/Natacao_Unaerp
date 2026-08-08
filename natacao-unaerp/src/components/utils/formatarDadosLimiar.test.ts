import { describe, it, expect } from 'vitest'
import { formatarDadosLimiar } from './formatarDadosLimiar'
import type { ResultadoLimiarItem } from '../types/graficos'

function limiar(
  nome: string,
  percentual: number,
  tempo_ms: number,
): ResultadoLimiarItem {
  return {
    percentual,
    tempo_ms,
    teste_limiar: { data_teste: '2024-01-01', atleta: { nome } },
  }
}

describe('formatarDadosLimiar', () => {
  it('agrupa por percentual com o tempo de cada atleta', () => {
    const dados = [
      limiar('Ana', 80, 60000),
      limiar('Bruno', 80, 65000),
      limiar('Ana', 90, 55000),
    ]
    expect(formatarDadosLimiar(dados)).toEqual([
      { percentual: 80, Ana: 60000, Bruno: 65000 },
      { percentual: 90, Ana: 55000 },
    ])
  })

  it('retorna [] para entrada vazia', () => {
    expect(formatarDadosLimiar([])).toEqual([])
  })
})
