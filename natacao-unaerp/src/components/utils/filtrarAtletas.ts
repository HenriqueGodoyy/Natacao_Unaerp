import type { ResultadoItem } from "../types/graficos";

export function filtrarAtletas(
  dados: ResultadoItem[],
  atletasSelecionados: string[]
) {
  if (atletasSelecionados.length === 0) {
    return [];
  }

  return dados.filter((item) =>
    atletasSelecionados.includes(
      item.atleta?.nome ?? ''
    )
  );
}