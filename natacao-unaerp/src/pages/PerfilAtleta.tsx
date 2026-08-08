import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import type { Atleta, AtletaFormData } from '../components/types/atleta'
import { estaAtivo } from '../components/types/atleta'
import type {
  ResultadoItem,
  ResultadoLimiarItem,
} from '../components/types/graficos'
import { buscarAtleta, atualizarAtleta } from '../services/atletas'
import {
  agruparTesteCompleto,
  formatarRadarChart,
} from '../components/utils/formatarDados'
import { formatarDadosLimiar } from '../components/utils/formatarDadosLimiar'
import { calcularIdade } from '../components/utils/datas'
import { getIniciais } from '../components/utils/chartColors'
import GraficoEvolucaoAtleta from '../components/charts/GraficoEvolucaoAtleta'
import GraficoRadarT12 from '../components/charts/GraficoRadarT12'
import GraficoLimiar from '../components/charts/GraficoLimiar'
import AtletaForm from '../components/atletas/AtletaForm'
import ChartCard from '../components/ui/ChartCard'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// Linha de resultado_teste com o atleta_id incluído (para filtrar com
// precisão sem depender do nome).
type ResultadoRow = ResultadoItem & { atleta_id: number }

function PerfilAtleta() {
  const { id } = useParams<{ id: string }>()
  const atletaId = Number(id)

  const [atleta, setAtleta] = useState<Atleta | null>(null)
  const [todosResultados, setTodosResultados] = useState<
    ResultadoRow[]
  >([])
  const [limiar, setLimiar] = useState<ResultadoLimiarItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [editando, setEditando] = useState(false)

  async function carregar() {
    setCarregando(true)
    setErro(null)
    try {
      const registro = await buscarAtleta(atletaId)
      setAtleta(registro)

      if (registro) {
        // Busca todos os resultados (todos os atletas): o deste atleta
        // alimenta o perfil e o conjunto completo serve de referência
        // para a normalização do radar.
        const { data, error } = await supabase
          .from('resultado_teste')
          .select(
            `
            id_resultado_teste,
            atleta_id,
            valor,
            data_resultado,
            observacao,
            atleta:atleta_id(nome),
            tipo_teste:tipo_teste_id(nome)
          `
          )
          .order('data_resultado', { ascending: true })
        if (error) throw error
        setTodosResultados(
          (data as unknown as ResultadoRow[]) ?? []
        )

        const { data: limiarData, error: limiarError } =
          await supabase
            .from('resultado_limiar')
            .select(
              `
              percentual,
              tempo_ms,
              teste_limiar:teste_limiar_id (
                data_teste,
                atleta:atleta_id ( nome )
              )
            `
            )
            .order('percentual', { ascending: true })
        if (limiarError) throw limiarError
        setLimiar(
          (limiarData as unknown as ResultadoLimiarItem[]) ?? []
        )
      }
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : 'Erro ao carregar o perfil.'
      )
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    if (!Number.isFinite(atletaId)) {
      setErro('Atleta inválido.')
      setCarregando(false)
      return
    }
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atletaId])

  // Resultados apenas deste atleta.
  const resultados = useMemo(
    () =>
      todosResultados.filter((r) => r.atleta_id === atletaId),
    [todosResultados, atletaId]
  )

  // Referência de normalização do radar: todos os testes T12 de todos
  // os atletas, para o formato refletir a posição relativa à equipe.
  const referenciaT12 = useMemo(
    () =>
      agruparTesteCompleto(
        todosResultados.filter((r) =>
          r.tipo_teste?.nome?.includes('T12')
        )
      ),
    [todosResultados]
  )

  // ─── T12 (FC1/FC2/MTS) agrupado por data ───
  const testesT12 = useMemo(() => {
    const t12 = resultados.filter((r) =>
      r.tipo_teste?.nome?.includes('T12')
    )
    return agruparTesteCompleto(t12).sort((a, b) =>
      a.data.localeCompare(b.data)
    )
  }, [resultados])

  const ultimoTeste = testesT12[testesT12.length - 1]
  const radarData = useMemo(
    () =>
      ultimoTeste
        ? formatarRadarChart([ultimoTeste], referenciaT12)
        : [],
    [ultimoTeste, referenciaT12]
  )

  // ─── Limiar do atleta ───
  const dadosLimiar = useMemo(() => {
    if (!atleta) return []
    const filtrado = limiar.filter(
      (item) => item.teste_limiar?.atleta?.nome === atleta.nome
    )
    return formatarDadosLimiar(filtrado)
  }, [limiar, atleta])

  // ─── KPIs ───
  const kpis = useMemo(() => {
    const datas = [
      ...new Set(resultados.map((r) => r.data_resultado ?? '')),
    ]
      .filter(Boolean)
      .sort()
    const melhorMTS = testesT12.reduce<number | null>(
      (max, t) =>
        t.MTS != null ? Math.max(max ?? 0, t.MTS) : max,
      null
    )
    return {
      totalTestes: resultados.length,
      ultimaData: datas[datas.length - 1] ?? '—',
      melhorMTS,
      sessoesLimiar: dadosLimiar.length > 0 ? 1 : 0,
    }
  }, [resultados, testesT12, dadosLimiar])

  async function handleSalvar(dados: AtletaFormData) {
    await atualizarAtleta(atletaId, dados)
    setEditando(false)
    await carregar()
  }

  if (carregando) return <LoadingSpinner />
  if (erro || !atleta)
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3 className="error-title">
          {erro ?? 'Atleta não encontrado'}
        </h3>
        <Link to="/atletas" className="btn btn-secondary">
          ← Voltar para atletas
        </Link>
      </div>
    )

  const ativo = estaAtivo(atleta)
  const idade = calcularIdade(atleta.data_nascimento)

  const detalhes: { rotulo: string; valor: string }[] = [
    { rotulo: 'Categoria', valor: atleta.categoria ?? '—' },
    {
      rotulo: 'Nascimento',
      valor: atleta.data_nascimento ?? '—',
    },
    {
      rotulo: 'Idade',
      valor: idade !== null ? `${idade} anos` : '—',
    },
    { rotulo: 'Sexo', valor: atleta.sexo ?? '—' },
    { rotulo: 'Telefone', valor: atleta.Telefone ?? '—' },
    { rotulo: 'Responsável', valor: atleta.responsavel ?? '—' },
    { rotulo: 'RG', valor: atleta.RG ?? '—' },
    { rotulo: 'CPF', valor: atleta.CPF ?? '—' },
  ]

  return (
    <div>
      <Link
        to="/atletas"
        className="back-link"
      >
        ← Voltar para atletas
      </Link>

      {/* Cabeçalho do perfil */}
      <div className="profile-header">
        <div className="profile-avatar">
          {getIniciais(atleta.nome)}
        </div>
        <div className="profile-info">
          <div className="profile-name-row">
            <h1 className="page-title">{atleta.nome}</h1>
            <span
              className={`badge ${
                ativo ? 'badge-success' : 'badge-muted'
              }`}
            >
              {ativo ? 'Ativo' : 'Inativo'}
            </span>
            {atleta.federado && (
              <span className="badge badge-info">Federado</span>
            )}
          </div>
          <div className="profile-details">
            {detalhes.map((d) => (
              <div key={d.rotulo} className="profile-detail">
                <span className="profile-detail-label">
                  {d.rotulo}
                </span>
                <span className="profile-detail-value">
                  {d.valor}
                </span>
              </div>
            ))}
          </div>
        </div>
        <button
          className="btn btn-secondary profile-edit-btn"
          onClick={() => setEditando(true)}
        >
          ✏️ Editar
        </button>
      </div>

      {/* KPIs */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-icon">📋</div>
          <div className="kpi-label">Testes registrados</div>
          <div className="kpi-value">{kpis.totalTestes}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">📅</div>
          <div className="kpi-label">Último teste</div>
          <div className="kpi-value" style={{ fontSize: '1.1rem' }}>
            {kpis.ultimaData}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">🏊</div>
          <div className="kpi-label">Melhor MTS (T12)</div>
          <div className="kpi-value">
            {kpis.melhorMTS != null ? `${kpis.melhorMTS} m` : '—'}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">📉</div>
          <div className="kpi-label">Teste de limiar</div>
          <div className="kpi-value">
            {kpis.sessoesLimiar > 0 ? 'Sim' : '—'}
          </div>
        </div>
      </div>

      {/* Evolução T12 */}
      <ChartCard
        title="Evolução do T12"
        subtitle="FC1 / FC2 (bpm) e MTS (m) ao longo do tempo"
      >
        {testesT12.length > 0 ? (
          <GraficoEvolucaoAtleta dados={testesT12} />
        ) : (
          <EmptyState
            icon="📈"
            title="Sem testes T12"
            message="Este atleta ainda não possui resultados de teste T12 registrados."
          />
        )}
      </ChartCard>

      {/* Radar do último teste + Limiar */}
      <div className="charts-grid">
        <ChartCard
          title="Perfil do último teste"
          subtitle={
            ultimoTeste
              ? `Radar FC1 / FC2 / MTS — ${ultimoTeste.data}`
              : 'Sem dados'
          }
        >
          {radarData.length > 0 ? (
            <GraficoRadarT12
              dados={radarData}
              atletas={[atleta.nome]}
              todosAtletas={[atleta.nome]}
            />
          ) : (
            <EmptyState
              icon="🎯"
              title="Sem dados para o radar"
              message="Registre um teste T12 completo (FC1, FC2 e MTS)."
            />
          )}
        </ChartCard>

        <ChartCard
          title="Curva de limiar"
          subtitle="Tempo por percentual de esforço"
        >
          {dadosLimiar.length > 0 ? (
            <GraficoLimiar
              dados={dadosLimiar}
              atletas={[atleta.nome]}
              todosAtletas={[atleta.nome]}
            />
          ) : (
            <EmptyState
              icon="📉"
              title="Sem dados de limiar"
              message="Este atleta ainda não possui teste de limiar."
            />
          )}
        </ChartCard>
      </div>

      {/* Histórico de resultados */}
      <ChartCard
        title="Histórico de resultados"
        subtitle={`${resultados.length} registro(s)`}
      >
        {resultados.length > 0 ? (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Teste</th>
                  <th>Valor</th>
                  <th>Observação</th>
                </tr>
              </thead>
              <tbody>
                {[...resultados]
                  .sort((a, b) =>
                    (b.data_resultado ?? '').localeCompare(
                      a.data_resultado ?? ''
                    )
                  )
                  .map((r) => (
                    <tr key={r.id_resultado_teste}>
                      <td>{r.data_resultado ?? '—'}</td>
                      <td>{r.tipo_teste?.nome ?? '—'}</td>
                      <td>{r.valor ?? '—'}</td>
                      <td>{r.observacao ?? '—'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="📋"
            title="Nenhum resultado"
            message="Este atleta ainda não possui resultados de teste registrados."
          />
        )}
      </ChartCard>

      {editando && (
        <AtletaForm
          atleta={atleta}
          onSalvar={handleSalvar}
          onFechar={() => setEditando(false)}
        />
      )}
    </div>
  )
}

export default PerfilAtleta
