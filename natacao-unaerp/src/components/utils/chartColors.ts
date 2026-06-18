// Paleta de cores consistente para gráficos — tema aquático/natação
export const CHART_COLORS = [
  '#06b6d4', // Cyan (primário)
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#ef4444', // Red
  '#ec4899', // Pink
  '#f97316', // Orange
] as const

/**
 * Retorna uma cor do palette pelo índice (cíclico).
 */
export function getColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length]
}

/**
 * Retorna a cor atribuída a um atleta, baseada na posição
 * do nome na lista de todos os atletas.
 */
export function getAtletaColor(
  nome: string,
  atletas: string[]
): string {
  const index = atletas.indexOf(nome)
  return getColor(index >= 0 ? index : 0)
}

/**
 * Gera as iniciais (até 2 caracteres) do nome do atleta.
 */
export function getIniciais(nome: string): string {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

/**
 * Estilo padrão para tooltips dos gráficos Recharts.
 */
export const tooltipStyle = {
  contentStyle: {
    background: '#1a1f35',
    border: '1px solid rgba(148,163,184,0.15)',
    borderRadius: '10px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    padding: '12px 16px',
  },
  labelStyle: {
    color: '#f1f5f9',
    fontWeight: 600,
    marginBottom: '6px',
  },
  itemStyle: {
    color: '#94a3b8',
    fontSize: '0.85rem',
  },
}
