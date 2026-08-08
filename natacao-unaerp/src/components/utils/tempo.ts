// Utilitários de tempo para os testes de limiar.
// O banco guarda o tempo em milissegundos (tempo_ms); na tela o usuário
// digita em formato amigável.

// Converte "m:ss.cc", "ss.cc" ou "ss" em milissegundos.
// Retorna null se o texto for inválido/vazio.
export function parseTempoParaMs(input: string): number | null {
  const txt = input.trim()
  if (txt === '') return null

  // Grupos: (minutos opcional) : segundos . (centésimos opcional)
  const re = /^(?:(\d+):)?([0-5]?\d)(?:[.,](\d{1,2}))?$/
  const m = txt.match(re)
  if (!m) return null

  const minutos = m[1] ? parseInt(m[1], 10) : 0
  const segundos = parseInt(m[2], 10)
  const centesimos = m[3] ? parseInt(m[3].padEnd(2, '0'), 10) : 0

  return (minutos * 60 + segundos) * 1000 + centesimos * 10
}

// Converte milissegundos em "m:ss.cc".
export function formatarMs(ms: number): string {
  const minutos = Math.floor(ms / 60000)
  const segundos = Math.floor((ms % 60000) / 1000)
  const centesimos = Math.floor((ms % 1000) / 10)
  return `${minutos}:${segundos
    .toString()
    .padStart(2, '0')}.${centesimos.toString().padStart(2, '0')}`
}
