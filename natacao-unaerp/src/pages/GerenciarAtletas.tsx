import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Atleta, AtletaFormData } from '../components/types/atleta'
import { estaAtivo } from '../components/types/atleta'
import {
  listarAtletas,
  criarAtleta,
  atualizarAtleta,
  definirAtivo,
  excluirAtleta,
} from '../services/atletas'
import AtletaForm from '../components/atletas/AtletaForm'
import { getIniciais } from '../components/utils/chartColors'
import { calcularIdade } from '../components/utils/datas'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'

type FiltroStatus = 'todos' | 'ativos' | 'inativos'

function GerenciarAtletas() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const [pesquisa, setPesquisa] = useState('')
  const [filtroStatus, setFiltroStatus] =
    useState<FiltroStatus>('todos')

  // Modal de formulário: undefined = fechado; null = novo; Atleta = edição.
  const [editando, setEditando] = useState<
    Atleta | null | undefined
  >(undefined)

  // Confirmação de exclusão.
  const [aExcluir, setAExcluir] = useState<Atleta | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [erroAcao, setErroAcao] = useState<string | null>(null)

  async function carregar() {
    setCarregando(true)
    setErro(null)
    try {
      setAtletas(await listarAtletas())
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : 'Erro ao carregar atletas.'
      )
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  const atletasFiltrados = useMemo(() => {
    const termo = pesquisa.toLowerCase().trim()
    return atletas.filter((a) => {
      const ativo = estaAtivo(a)
      if (filtroStatus === 'ativos' && !ativo) return false
      if (filtroStatus === 'inativos' && ativo) return false
      if (termo === '') return true
      return (
        a.nome.toLowerCase().includes(termo) ||
        (a.categoria ?? '').toLowerCase().includes(termo) ||
        (a.responsavel ?? '').toLowerCase().includes(termo)
      )
    })
  }, [atletas, pesquisa, filtroStatus])

  const kpis = useMemo(() => {
    const ativos = atletas.filter((a) => estaAtivo(a)).length
    return {
      total: atletas.length,
      ativos,
      inativos: atletas.length - ativos,
      federados: atletas.filter((a) => a.federado).length,
    }
  }, [atletas])

  async function handleSalvar(dados: AtletaFormData) {
    if (editando) {
      await atualizarAtleta(editando.id_atleta, dados)
    } else {
      await criarAtleta(dados)
    }
    setEditando(undefined)
    await carregar()
  }

  async function handleToggleAtivo(atleta: Atleta) {
    setErroAcao(null)
    const novoValor = !estaAtivo(atleta)
    // Atualização otimista para resposta imediata.
    setAtletas((prev) =>
      prev.map((a) =>
        a.id_atleta === atleta.id_atleta
          ? { ...a, ativo: novoValor }
          : a
      )
    )
    try {
      await definirAtivo(atleta.id_atleta, novoValor)
    } catch (err) {
      setErroAcao(
        err instanceof Error
          ? err.message
          : 'Erro ao alterar status.'
      )
      await carregar()
    }
  }

  async function handleExcluir() {
    if (!aExcluir) return
    setExcluindo(true)
    setErroAcao(null)
    try {
      await excluirAtleta(aExcluir.id_atleta)
      setAExcluir(null)
      await carregar()
    } catch {
      setErroAcao(
        `Não foi possível excluir "${aExcluir.nome}". ` +
          'O atleta provavelmente possui resultados de teste vinculados. ' +
          'Use "Inativar" para removê-lo das análises sem apagar o histórico.'
      )
    } finally {
      setExcluindo(false)
    }
  }

  if (carregando) return <LoadingSpinner />
  if (erro)
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3 className="error-title">Erro ao carregar dados</h3>
        <p className="error-message">{erro}</p>
      </div>
    )

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gerenciar Atletas</h1>
        <p className="page-subtitle">
          Cadastre, edite, inative e organize os atletas da equipe
        </p>
      </div>

      {/* KPIs */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-icon">🏊</div>
          <div className="kpi-label">Total</div>
          <div className="kpi-value">{kpis.total}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">✅</div>
          <div className="kpi-label">Ativos</div>
          <div className="kpi-value">{kpis.ativos}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">💤</div>
          <div className="kpi-label">Inativos</div>
          <div className="kpi-value">{kpis.inativos}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">🏅</div>
          <div className="kpi-label">Federados</div>
          <div className="kpi-value">{kpis.federados}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-search">
          <span className="filter-search-icon">🔍</span>
          <input
            className="filter-search"
            placeholder="Buscar por nome, categoria ou responsável..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
        </div>
        <select
          className="styled-select"
          value={filtroStatus}
          onChange={(e) =>
            setFiltroStatus(e.target.value as FiltroStatus)
          }
        >
          <option value="todos">Todos os status</option>
          <option value="ativos">Somente ativos</option>
          <option value="inativos">Somente inativos</option>
        </select>
        <button
          className="btn btn-primary"
          onClick={() => setEditando(null)}
        >
          + Novo atleta
        </button>
      </div>

      {erroAcao && <div className="form-error">{erroAcao}</div>}

      {/* Tabela */}
      {atletasFiltrados.length === 0 ? (
        <div className="chart-card">
          <EmptyState
            icon="🔍"
            title="Nenhum atleta encontrado"
            message="Ajuste a busca/filtro ou cadastre um novo atleta."
          />
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Atleta</th>
                <th>Categoria</th>
                <th>Idade</th>
                <th>Sexo</th>
                <th>Telefone</th>
                <th>Federado</th>
                <th>Status</th>
                <th className="col-acoes">Ações</th>
              </tr>
            </thead>
            <tbody>
              {atletasFiltrados.map((a) => {
                const ativo = estaAtivo(a)
                const idade = calcularIdade(a.data_nascimento)
                return (
                  <tr
                    key={a.id_atleta}
                    className={ativo ? '' : 'row-inativo'}
                  >
                    <td>
                      <Link
                        to={`/atletas/${a.id_atleta}`}
                        className="cell-atleta cell-atleta-link"
                      >
                        <div className="athlete-avatar">
                          {getIniciais(a.nome)}
                        </div>
                        <span>{a.nome}</span>
                      </Link>
                    </td>
                    <td>{a.categoria ?? '—'}</td>
                    <td>{idade !== null ? `${idade} anos` : '—'}</td>
                    <td className="cell-capitalize">
                      {a.sexo ?? '—'}
                    </td>
                    <td>{a.Telefone ?? '—'}</td>
                    <td>
                      {a.federado ? (
                        <span className="badge badge-info">
                          Federado
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          ativo
                            ? 'badge-success'
                            : 'badge-muted'
                        }`}
                      >
                        {ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link
                          to={`/atletas/${a.id_atleta}`}
                          className="btn-icon"
                          title="Ver perfil"
                        >
                          👁️
                        </Link>
                        <button
                          className="btn-icon"
                          title="Editar"
                          onClick={() => setEditando(a)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon"
                          title={ativo ? 'Inativar' : 'Ativar'}
                          onClick={() => handleToggleAtivo(a)}
                        >
                          {ativo ? '💤' : '↩️'}
                        </button>
                        <button
                          className="btn-icon btn-icon-danger"
                          title="Excluir"
                          onClick={() => setAExcluir(a)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de formulário */}
      {editando !== undefined && (
        <AtletaForm
          key={editando?.id_atleta ?? 'novo'}
          atleta={editando}
          onSalvar={handleSalvar}
          onFechar={() => setEditando(undefined)}
        />
      )}

      {/* Confirmação de exclusão */}
      {aExcluir && (
        <div
          className="modal-overlay"
          onClick={() => !excluindo && setAExcluir(null)}
        >
          <div
            className="modal modal-sm"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <h2 className="modal-title">Excluir atleta</h2>
            </div>
            <div className="modal-body">
              <p>
                Tem certeza que deseja excluir{' '}
                <strong>{aExcluir.nome}</strong>? Esta ação é
                permanente.
              </p>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  marginTop: 8,
                }}
              >
                Dica: se o atleta tem histórico de testes, prefira{' '}
                <strong>inativar</strong> em vez de excluir.
              </p>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setAExcluir(null)}
                  disabled={excluindo}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleExcluir}
                  disabled={excluindo}
                >
                  {excluindo ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GerenciarAtletas
