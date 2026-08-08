import { useEffect, useState } from 'react'
import type { Atleta } from '../components/types/atleta'
import { estaAtivo } from '../components/types/atleta'
import type { TipoTeste } from '../components/types/resultado'
import { listarAtletas } from '../services/atletas'
import { listarTiposTeste } from '../services/resultados'
import FormResultadoTeste from '../components/resultados/FormResultadoTeste'
import FormTesteLimiar from '../components/resultados/FormTesteLimiar'
import ChartCard from '../components/ui/ChartCard'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'

type Aba = 'teste' | 'limiar'

function LancarResultados() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [tipos, setTipos] = useState<TipoTeste[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [aba, setAba] = useState<Aba>('teste')

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      setErro(null)
      try {
        const [listaAtletas, listaTipos] = await Promise.all([
          listarAtletas(),
          listarTiposTeste(),
        ])
        // Só atletas ativos podem receber lançamentos.
        setAtletas(listaAtletas.filter((a) => estaAtivo(a)))
        setTipos(listaTipos)
      } catch (err) {
        setErro(
          err instanceof Error
            ? err.message
            : 'Erro ao carregar dados.'
        )
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

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
        <h1 className="page-title">Lançar Resultados</h1>
        <p className="page-subtitle">
          Registre os testes realizados — treinador e atletas podem lançar
        </p>
      </div>

      {/* Abas */}
      <div className="tabs">
        <button
          className={`tab ${aba === 'teste' ? 'active' : ''}`}
          onClick={() => setAba('teste')}
        >
          🏊 Teste T12
        </button>
        <button
          className={`tab ${aba === 'limiar' ? 'active' : ''}`}
          onClick={() => setAba('limiar')}
        >
          📉 Teste de limiar
        </button>
      </div>

      {atletas.length === 0 ? (
        <ChartCard title="Sem atletas ativos">
          <EmptyState
            icon="👥"
            title="Nenhum atleta ativo"
            message="Cadastre ou ative um atleta em Gerenciar Atletas antes de lançar resultados."
          />
        </ChartCard>
      ) : aba === 'teste' ? (
        <ChartCard
          title="Resultados de teste"
          subtitle="Preencha os valores medidos para o atleta e a data"
        >
          {tipos.length > 0 ? (
            <FormResultadoTeste atletas={atletas} tipos={tipos} />
          ) : (
            <EmptyState
              icon="🧪"
              title="Nenhum tipo de teste cadastrado"
              message="Cadastre os tipos de teste (T12 - FC1/FC2/MTS) no Supabase."
            />
          )}
        </ChartCard>
      ) : (
        <ChartCard
          title="Teste de limiar"
          subtitle="Registre a curva de tempos por percentual de esforço"
        >
          <FormTesteLimiar atletas={atletas} />
        </ChartCard>
      )}
    </div>
  )
}

export default LancarResultados
