import { useEffect, useState } from 'react'
import { supabase } from './supabase'
//import { formatarDadosComparacao } from './components/utils/formatarDados'

type ResultadoItem = {
  id_resultado_teste: number
  valor: number | null
  data_resultado: string | null
  observacao: string | null
  atleta: { nome: string } | null
  tipo_teste: { nome: string } | null
}

type DadoGrafico = {
  atleta: string
  valor: number
  teste: string
  data: string
}

function formatarDadosComparacao(dados: ResultadoItem[]): DadoGrafico[] {
  return dados.map((item) => ({
    atleta: item.atleta?.nome ?? 'Sem nome',
    valor: item.valor ?? 0,
    teste: item.tipo_teste?.nome ?? 'Sem teste',
    data: item.data_resultado ?? 'Sem data',
  })) // tirar essa função daqui e deixar em utils, formatar dados 
}

function App() {
  const [dados, setDados] = useState<ResultadoItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function buscarResultados() {
      const { data, error } = await supabase
        .from('resultado_teste')
        .select(`
          id_resultado_teste,
          valor,
          data_resultado,
          observacao,
          atleta:atleta_id(nome),
          tipo_teste:tipo_teste_id(nome)
        `)
        .order('data_resultado', { ascending: true })

      console.log('Primeiro item:', data?.[0])
      console.log('ERRO:', error)

      if (error) {
        setErro(error.message)
      } else {
        setDados((data as unknown as ResultadoItem[]) ?? [])
      }

      setCarregando(false)
    }

    buscarResultados()
  }, [])

  const dadosFormatados = formatarDadosComparacao(dados)

  console.log('Dados formatados:', dadosFormatados)

  if (carregando) return <p>Carregando...</p>
  if (erro) return <p>Erro: {erro}</p>

  return (
    <div style={{ padding: 20 }}>
      <h1>Resultados dos testes</h1>

      {dados.map((item) => (
        <div
          key={item.id_resultado_teste}
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <p><strong>Atleta:</strong> {item.atleta?.nome ?? '-'}</p>
          <p><strong>Tipo de teste:</strong> {item.tipo_teste?.nome ?? '-'}</p>
          <p><strong>Valor:</strong> {item.valor ?? '-'}</p>
          <p><strong>Data:</strong> {item.data_resultado ?? '-'}</p>
          <p><strong>Observação:</strong> {item.observacao ?? '-'}</p>
        </div>
      ))}
    </div>
  )
}

export default App