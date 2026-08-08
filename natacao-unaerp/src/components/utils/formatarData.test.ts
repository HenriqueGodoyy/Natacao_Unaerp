import { describe, it, expect } from 'vitest'
import { formatarData } from './formatarData'

describe('formatarData', () => {
  it('converte ISO (YYYY-MM-DD) para DD/MM/YYYY', () => {
    expect(formatarData('2024-05-10')).toBe('10/05/2024')
  })

  it('ignora a parte de hora se houver', () => {
    expect(formatarData('2024-05-10T13:00:00Z')).toBe('10/05/2024')
  })

  it('retorna travessão para null', () => {
    expect(formatarData(null)).toBe('—')
  })
})
