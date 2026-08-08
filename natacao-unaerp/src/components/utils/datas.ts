// Calcula a idade (em anos completos) a partir de uma data de nascimento
// no formato ISO (YYYY-MM-DD). Retorna null se a data for inválida/ausente.
export function calcularIdade(
  dataNascimento: string | null
): number | null {
  if (!dataNascimento) return null
  const nasc = new Date(dataNascimento)
  if (isNaN(nasc.getTime())) return null

  const hoje = new Date()
  let idade = hoje.getFullYear() - nasc.getFullYear()
  const m = hoje.getMonth() - nasc.getMonth()
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
    idade--
  }
  return idade
}
