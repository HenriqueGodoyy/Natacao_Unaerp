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
  it('sem variação na referência, usa o ponto médio mas mantém o valor real', () => {
    const testes: ResultadoTesteCompleto[] = [
      { atleta: 'Ana', data: '2024-01-01', FC1: 100, FC2: 200, MTS: 50 },
    ]
    const resultado = formatarRadarChart(testes)
    const fc1 = resultado.find((m) => m.metrica === 'FC1')!
    // referência com um único valor não tem variação => ponto médio (60)
    expect(fc1.Ana).toBe(60)
    expect(fc1.Ana_real).toBe(100)
  })

  it('normaliza relativo à faixa de referência da equipe', () => {
    const testes: ResultadoTesteCompleto[] = [
      { atleta: 'Ana', data: '2024-01-01', FC1: 100, FC2: 200, MTS: 50 },
      { atleta: 'Bruno', data: '2024-01-01', FC1: 200, FC2: 200, MTS: 50 },
    ]
    const resultado = formatarRadarChart(testes)
    const fc1 = resultado.find((m) => m.metrica === 'FC1')!
    expect(fc1.Ana_real).toBe(100)
    expect(fc1.Bruno_real).toBe(200)
    expect(fc1.Bruno as number).toBeGreaterThan(fc1.Ana as number)
  })
})
