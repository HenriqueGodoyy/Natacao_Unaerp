export type ResultadoBanco = {
  atleta?: {
    nome?: string;
  };
  data_resultado?: string;
  id_resultado_teste?: number;
  observacao?: string | null;
  tipo_teste?: {
    nome?: string;
  };
  valor?: number;
};

export type DadoGraficoBarra = {
  atleta: string;
  valor: number;
  teste: string;
  data: string;
};