import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { formatarDadosComparacao, formatarDadosPorData, agruparTesteCompleto, formatarRadarChart } from '../components/utils/formatarDados'
import GraficoComparacaoT12 from '../components/charts/comparacaoT12'
import type { ResultadoItem, ResultadoLimiarItem } from '../components/types/graficos'
import GraficoComparacaoPorData from '../components/charts/GraficoComparacaoPorData'
import GraficoRadarT12 from '../components/charts/GraficoRadarT12'
import { formatarDadosLimiar } from '../components/utils/formatarDadosLimiar'
import GraficoLimiar from '../components/charts/GraficoLimiar'
import { filtrarAtletas } from '../components/utils/filtrarAtletas'
import AthleteFilter from '../components/charts/AthleteFilter'
import ChartCard from '../components/ui/ChartCard'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function AnaliseComparativa() {
  const [dados, setDados] = useState<ResultadoItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [dadosLimiar, setDadosLimiar] = useState<ResultadoLimiarItem[]>([])
  const [atletasSelecionados, setAtletasSelecionados] = useState<string[]>([])

 useEffect(() => {
    async function buscarResultados() {
      setCarregando(true)

      // BUSCAR RESULTADO TESTE
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


          // TRATAR ERROS dos graficos normais 
      if (error) {
        setErro(error.message)
      } else {
        setDados(
          (data as unknown as ResultadoItem[]) ?? []
        )
      }

      // BUSCAR LIMIAR // limiar
      const {
        data: limiarData,
        error: limiarError,
      } = await supabase
        .from('resultado_limiar')
        .select(`
          percentual,
          tempo_ms,
          teste_limiar:teste_limiar_id (
            data_teste,
            atleta:atleta_id (
              nome
            )
          )
        `)
        .order('percentual', { ascending: true })

    
      if (limiarError) { // tratar erros limiar 
        setErro(limiarError.message)
      } else {
        setDadosLimiar(
          (limiarData as unknown as ResultadoLimiarItem[]) ?? []
        )
      }
      setCarregando(false)
    }

    buscarResultados()
  }, [])


    const dadosFiltrados = filtrarAtletas( // para dar filtros aos graficos 
    dados,
    atletasSelecionados
   )

  const atletas = [ 
    ...new Set(
      dados.map((d) => d.atleta?.nome ?? '')
    ),
  ];

  // caso o filtro esteja sem atletas selecionados

  const temAtletasSelecionados = atletasSelecionados.length > 0

  const temAtletasComparacao = atletasSelecionados.length > 1



  const dadosT12 = dadosFiltrados.filter(
    (item) => item.tipo_teste?.nome?.includes('T12')
  )
  const testesAgrupados = agruparTesteCompleto(dadosT12)
  
  // Usa a data mais recente dinamicamente em vez de hardcoded
  const datasUnicas = [...new Set(testesAgrupados.map(item => item.data))].sort()
  const ultimaData = datasUnicas[datasUnicas.length - 1]
  const ultimoTeste = testesAgrupados.filter(
    item => item.data === ultimaData
  )



  const dadosT12FC1 = dadosFiltrados.filter(
    (item) =>  item .tipo_teste?.nome == 'T12 - FC1'
  )
  const dadosPorDataFC1 = formatarDadosPorData(dadosT12FC1)



  const dadosT12FC2 = dadosFiltrados.filter( // para o gráfico de comparação T12 - FC2 vou colocar tudo de fc2 t12 aqui
    (item) => item.tipo_teste?.nome === 'T12 - FC2'
  )
  const dadosFormatadosFC2 = formatarDadosComparacao(dadosT12FC2)
  const dadosPorDataFC2 = formatarDadosPorData(dadosT12FC2)



 const radarData = formatarRadarChart(ultimoTeste) // para o radar charts 


const dadosLimiarFiltrados = dadosLimiar.filter(
  (item) =>
    atletasSelecionados.includes(
      item.teste_limiar.atleta.nome
    )
)
const dadosGraficoLimiar =
  formatarDadosLimiar(dadosLimiarFiltrados)
const atletasLimiar = [
  ...new Set(
    dadosLimiarFiltrados.map(
      (item) => item.teste_limiar.atleta.nome
    )
  ),
]

  // KPIs
  const totalAtletas = atletas.length
  const totalTestes = dados.length
  const ultimoTesteData = dados.length > 0
    ? dados[dados.length - 1].data_resultado ?? '—'
    : '—'

  if (carregando) return <LoadingSpinner />
  if (erro) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">Erro ao carregar dados</h3>
      <p className="error-message">{erro}</p>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Análise Comparativa</h1>
        <p className="page-subtitle">Compare o desempenho entre os atletas da equipe</p>
      </div>

      {/* KPIs */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-icon">🏊</div>
          <div className="kpi-label">Total de Atletas</div>
          <div className="kpi-value">{totalAtletas}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">📋</div>
          <div className="kpi-label">Total de Testes</div>
          <div className="kpi-value">{totalTestes}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">📅</div>
          <div className="kpi-label">Último Teste</div>
          <div className="kpi-value" style={{ fontSize: '1.1rem' }}>{ultimoTesteData}</div>
        </div>
      </div>

      {/* Filtro */}
      <div className="filter-section">
        <AthleteFilter
          atletas={atletas}
          atletasSelecionados={atletasSelecionados}
          onChange={setAtletasSelecionados}
        />
      </div>

      {/* Gráficos */}
      {temAtletasSelecionados ? (
        <>
          <ChartCard
            title="Resultados gerais do teste T12 — FC2"
            subtitle="Valores de frequência cardíaca 2 por atleta"
          >
            <GraficoComparacaoT12 dados={dadosFormatadosFC2} />
          </ChartCard>
        </>
      ) : (
        <ChartCard title="Resultados T12 — FC2">
          <EmptyState
            icon="👆"
            title="Selecione um atleta"
            message="Use o filtro acima para selecionar pelo menos um atleta e visualizar os dados."
          />
        </ChartCard>
      )}

      {temAtletasComparacao ? (
        <>
          <div className="charts-grid">
            <ChartCard
              title="Comparação T12 — FC1"
              subtitle="Evolução da FC1 por data entre atletas"
            >
              <GraficoComparacaoPorData dados={dadosPorDataFC1} />
            </ChartCard>

            <ChartCard
              title="Comparação T12 — FC2"
              subtitle="Evolução da FC2 por data entre atletas"
            >
              <GraficoComparacaoPorData dados={dadosPorDataFC2} />
            </ChartCard>
          </div>

          <ChartCard
            title="Radar Chart — Perfil Comparativo"
            subtitle="Métricas comparadas: MTS / FC1 / FC2 (último teste)"
          >
            <GraficoRadarT12 dados={radarData} atletas={atletas} />
          </ChartCard>
        </>
      ) : temAtletasSelecionados ? (
        <ChartCard title="Comparação entre atletas">
          <EmptyState
            icon="👥"
            title="Selecione dois ou mais atletas"
            message="Para ver os gráficos de comparação, selecione pelo menos dois atletas no filtro."
          />
        </ChartCard>
      ) : null}

      {temAtletasSelecionados && (
        <ChartCard
          title="Gráfico de Limiar"
          subtitle="Curva de limiar anaeróbico por percentual"
        >
          {atletasLimiar.length > 0 ? (
            <GraficoLimiar dados={dadosGraficoLimiar} atletas={atletasLimiar} />
          ) : (
            <EmptyState
              icon="📉"
              title="Sem dados de limiar"
              message="Não há dados de limiar disponíveis para os atletas selecionados."
            />
          )}
        </ChartCard>
      )}
    </div>
  )
}

export default AnaliseComparativa