import { describe, it, expect } from 'vitest'
import {
  formatarDadosComparacao,
  formatarDadosPorData,
  agruparTesteCompleto,
  formatarRadarChart,
} from './formatarDados'
import type { ResultadoItem, ResultadoTesteCompleto } from '../types/graficos'

function item(
  nome: string | null,
  teste: string,
  valor: number | null,
  data = '2024-01-01',
): ResultadoItem {
  return {
    id_resultado_teste: 1,
    valor,
    data_resultado: data,
    observacao: null,
    atleta: nome ? { nome } : null,
    tipo_teste: { nome: teste },
  }
}

describe('formatarDadosComparacao', () => {
  it('mapeia os campos do resultado', () => {
    const resultado = formatarDadosComparacao([item('Ana', 'T12 - FC2', 150)])
    expect(resultado[0]).toEqual({
      atleta: 'Ana',
      valor: 150,
      teste: 'T12 - FC2',
      data: '2024-01-01',
    })
  })

  it('usa valores padrão quando há campos nulos', () => {
    const resultado = formatarDadosComparacao([item(null, 'T12 - FC2', null)])
    expect(resultado[0]).toEqual({
      atleta: 'Sem nome',
      valor: 0,
      teste: 'T12 - FC2',
      data: '2024-01-01',
    })
  })
})

describe('formatarDadosPorData', () => {
  it('agrupa por data com os atletas como colunas', () => {
    const dados = [
      item('Ana', 'T12 - FC1', 120, '2024-01-01'),
      item('Bruno', 'T12 - FC1', 130, '2024-01-01'),
      item('Ana', 'T12 - FC1', 125, '2024-02-01'),
    ]
    expect(formatarDadosPorData(dados)).toEqual([
      { data: '2024-01-01', Ana: 120, Bruno: 130 },
      { data: '2024-02-01', Ana: 125 },
    ])
  })
})

describe('agruparTesteCompleto', () => {
  it('agrupa FC1/FC2/MTS por atleta e data', () => {
    const dados = [
      item('Ana', 'T12 - FC1', 120),
      item('Ana', 'T12 - FC2', 160),
      item('Ana', 'T12 - MTS', 40),
    ]
    const resultado = agruparTesteCompleto(dados)
    expect(resultado).toHaveLength(1)
    expect(resultado[0]).toEqual({
      atleta: 'Ana',
      data: '2024-01-01',
      FC1: 120,
      FC2: 160,
      MTS: 40,
    })
  })
})

describe('formatarRadarChart', () => {
  it('normaliza para 0-100 e mantém o valor real', () => {
    const testes: ResultadoTesteCompleto[] = [
      { atleta: 'Ana', data: '2024-01-01', FC1: 100, FC2: 200, MTS: 50 },
    ]
    const resultado = formatarRadarChart(testes)
    const fc1 = resultado.find((m) => m.metrica === 'FC1')!
    // com um único atleta, o valor é o máximo => 100%
    expect(fc1.Ana).toBe(100)
    expect(fc1.Ana_real).toBe(100)
  })
})
