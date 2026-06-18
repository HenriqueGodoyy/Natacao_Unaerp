import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import AthleteFilter from '../components/charts/AthleteFilter'
import type { ResultadoItem, ResultadoLimiarItem } from '../components/types/graficos'
import { formatarDadosLimiar } from '../components/utils/formatarDadosLimiar'
import GraficoLimiar from '../components/charts/GraficoLimiar'
import { filtrarAtletas } from '../components/utils/filtrarAtletas'
import { agruparTesteCompleto, formatarRadarChart } from '../components/utils/formatarDados'
import GraficoRadarT12 from '../components/charts/GraficoRadarT12'
import ChartCard from '../components/ui/ChartCard'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'


function AnaliseIndividual() {

    const [dados, setDados ] = useState<ResultadoItem[]>([])
    const [carregando, setCarregando ] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [dadosLimiar, setDadosLimiar] = useState<ResultadoLimiarItem[]>([])
    const [atletasSelecionados, setAtletasSelecionados] = useState<string[]>([])
    const [dataSelecionada, setDataSelecionada] = useState('')

    useEffect(() => {
        async function buscarResultados() {
            setCarregando(true)


            // busca dos resultados do teste
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
                .order('data_resultado', {ascending: true}) 
                    // tratar erros dos graficos normais
                   if(error) {
                            setErro(error.message)
                        } else {
                            setDados(
                                (data as unknown as ResultadoItem[]) ?? []
                            )
                        }

                // busca dos resultados dos limiares
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
                        .order('percentual', {ascending : true})
                        // Tratar erros dos graficos de limiar
                        if(limiarError) {
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



    const atletas = [
        ...new Set(
            dados.map((d) => d.atleta?.nome ?? '')
        )
    ]

    const dadosFiltrados = filtrarAtletas(
        dados,
        atletasSelecionados
    )


    const dadosT12 = dadosFiltrados.filter(
        (item) => item.tipo_teste?.nome?.includes('T12')
    )
    const testesAgrupados = agruparTesteCompleto(dadosT12)
    const testeSelecionado = testesAgrupados.filter(
        item => item.data === dataSelecionada
    )
    const radarData = formatarRadarChart(testeSelecionado)    

    const datasDisponiveis = [
        ...new Set (
            testesAgrupados.map((item) => item.data)
        )
    ]


    const dadosLimiarFiltrados = dadosLimiar.filter(
        (item) =>
            atletasSelecionados.includes(
                item.teste_limiar.atleta.nome
            )
    )
    const dadosGraficoLimiar = formatarDadosLimiar(dadosLimiarFiltrados)
    const atletasLimiar = [
    ...new Set(
        dadosLimiarFiltrados.map(
        (item) => item.teste_limiar.atleta.nome
        )
      ),
    ]

    const temAtletaSelecionado = atletasSelecionados.length > 0

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
              <h1 className="page-title">Análise Individual</h1>
              <p className="page-subtitle">Análise detalhada de um atleta específico</p>
            </div>

            {/* Filtro de atleta */}
            <div className="filter-section">
              <AthleteFilter
                  atletas={atletas}
                  atletasSelecionados={atletasSelecionados}
                  onChange={setAtletasSelecionados}
                  singleSelect
              />
            </div>

            {temAtletaSelecionado ? (
              <>
                {/* Seletor de data */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: 12 }}>
                    Selecione a data do teste:
                  </label>
                  <select
                    value={dataSelecionada}
                    onChange={(e) =>
                      setDataSelecionada(e.target.value)
                    }
                    className="styled-select"
                  >
                    <option value="">
                      Escolha uma data
                    </option>
                    {datasDisponiveis.map((data) => (
                      <option key={data} value={data}>
                        {data}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Radar T12 */}
                <ChartCard
                  title="Análise T12 Individual"
                  subtitle={dataSelecionada
                    ? `Teste de ${dataSelecionada} — Perfil FC1 / FC2 / MTS`
                    : 'Selecione uma data acima para visualizar'
                  }
                >
                  {dataSelecionada ? (
                    <GraficoRadarT12 dados={radarData} atletas={atletasSelecionados} />
                  ) : (
                    <EmptyState
                      icon="📅"
                      title="Selecione uma data"
                      message="Escolha a data do teste acima para visualizar o radar chart do atleta."
                    />
                  )}
                </ChartCard>

                {/* Limiar */}
                <ChartCard
                  title="Análise Teste Limiar"
                  subtitle="Curva de limiar anaeróbico do atleta"
                >
                  {atletasLimiar.length > 0 ? (
                    <GraficoLimiar dados={dadosGraficoLimiar} atletas={atletasLimiar} />
                  ) : (
                    <EmptyState
                      icon="📉"
                      title="Sem dados de limiar"
                      message="Não há dados de limiar disponíveis para este atleta."
                    />
                  )}
                </ChartCard>
              </>
            ) : (
              <ChartCard title="Dados do Atleta">
                <EmptyState
                  icon="👤"
                  title="Nenhum atleta selecionado"
                  message="Use o filtro acima para selecionar um atleta e visualizar sua análise individual."
                />
              </ChartCard>
            )}
        </div>
    )
}

export default AnaliseIndividual
