import { describe, it, expect } from 'vitest'
import { filtrarAtletas } from './filtrarAtletas'
import type { ResultadoItem } from '../types/graficos'

function item(nome: string | null): ResultadoItem {
  return {
    id_resultado_teste: 1,
    valor: 10,
    data_resultado: '2024-01-01',
    observacao: null,
    atleta: nome ? { nome } : null,
    tipo_teste: { nome: 'T12 - FC1' },
  }
}

describe('filtrarAtletas', () => {
  it('retorna [] quando nenhum atleta está selecionado', () => {
    const dados = [item('Ana'), item('Bruno')]
    expect(filtrarAtletas(dados, [])).toEqual([])
  })

  it('mantém apenas os resultados dos atletas selecionados', () => {
    const dados = [item('Ana'), item('Bruno'), item('Ana')]
    const resultado = filtrarAtletas(dados, ['Ana'])
    expect(resultado).toHaveLength(2)
    expect(resultado.every((d) => d.atleta?.nome === 'Ana')).toBe(true)
  })

  it('não quebra com atleta nulo', () => {
    const dados = [item(null), item('Ana')]
    expect(filtrarAtletas(dados, ['Ana'])).toHaveLength(1)
  })
})
