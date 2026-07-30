/**
 * Formata uma data ISO (YYYY-MM-DD) para o formato brasileiro (DD/MM/YYYY).
 * Faz o parsing manual para evitar problemas de fuso horário que ocorreriam
 * com `new Date('2024-05-10')` (que é interpretada como UTC).
 */
export function formatarData(data: string | null): string {
  if (!data) return '—'

  const [ano, mes, dia] = data.slice(0, 10).split('-')

  if (ano && mes && dia) {
    return `${dia}/${mes}/${ano}`
  }

  return data
}
