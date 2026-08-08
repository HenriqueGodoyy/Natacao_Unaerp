// Extrai uma mensagem legível de um erro desconhecido.
// Trata tanto instâncias de Error quanto os objetos de erro do Supabase
// (PostgrestError), que têm `.message` mas não são instâncias de Error.
export function mensagemErro(
  err: unknown,
  fallback = 'Ocorreu um erro.'
): string {
  if (err instanceof Error) return err.message
  if (
    typeof err === 'object' &&
    err !== null &&
    'message' in err
  ) {
    const m = (err as { message?: unknown }).message
    if (typeof m === 'string' && m.trim() !== '') return m
  }
  return fallback
}
