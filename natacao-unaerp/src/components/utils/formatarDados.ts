import type { ResultadoBanco, DadoGraficoBarra } from "../types/graficos";

export function formatarDadosComparacao(
  dados: ResultadoBanco[]
): DadoGraficoBarra[] {
  return dados.map((item) => ({
    atleta: item.atleta?.nome ?? "Sem nome",
    valor: Number(item.valor) || 0,
    teste: item.tipo_teste?.nome ?? "Sem teste",
    data: item.data_resultado ?? "Sem data",
  }));
}