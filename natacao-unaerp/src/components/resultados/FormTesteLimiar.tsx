import { useState } from 'react'
import type { Atleta } from '../types/atleta'
import { lancarTesteLimiar } from '../../services/resultados'
import { parseTempoParaMs } from '../utils/tempo'
import { mensagemErro } from '../utils/erros'

interface Props {
  atletas: Atleta[]
}

type LinhaTempo = { percentual: string; tempo: string }

function hoje(): string {
  return new Date().toISOString().slice(0, 10)
}

const LINHAS_INICIAIS: LinhaTempo[] = [
  { percentual: '60', tempo: '' },
  { percentual: '70', tempo: '' },
  { percentual: '80', tempo: '' },
  { percentual: '90', tempo: '' },
  { percentual: '100', tempo: '' },
]

export default function FormTesteLimiar({ atletas }: Props) {
  const [atletaId, setAtletaId] = useState('')
  const [data, setData] = useState(hoje())
  const [distancia, setDistancia] = useState('100')
  const [observacao, setObservacao] = useState('')
  const [linhas, setLinhas] = useState<LinhaTempo[]>(
    LINHAS_INICIAIS
  )
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  function atualizarLinha(
    index: number,
    campo: keyof LinhaTempo,
    valor: string
  ) {
    setLinhas((prev) =>
      prev.map((l, i) =>
        i === index ? { ...l, [campo]: valor } : l
      )
    )
  }

  function adicionarLinha() {
    setLinhas((prev) => [...prev, { percentual: '', tempo: '' }])
  }

  function removerLinha(index: number) {
    setLinhas((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setSucesso(null)

    if (!atletaId) {
      setErro('Selecione um atleta.')
      return
    }
    if (!data) {
      setErro('Informe a data do teste.')
      return
    }

    // Considera apenas linhas com percentual e tempo preenchidos.
    const pontos: { percentual: number; tempo_ms: number }[] = []
    for (const l of linhas) {
      if (l.percentual.trim() === '' && l.tempo.trim() === '') {
        continue
      }
      const percentual = Number(l.percentual)
      const tempoMs = parseTempoParaMs(l.tempo)
      if (Number.isNaN(percentual) || l.percentual.trim() === '') {
        setErro('Há um percentual inválido.')
        return
      }
      if (tempoMs === null) {
        setErro(
          `Tempo inválido em ${l.percentual}%. Use o formato m:ss.cc (ex.: 1:49.23).`
        )
        return
      }
      pontos.push({ percentual, tempo_ms: tempoMs })
    }

    if (pontos.length === 0) {
      setErro('Preencha pelo menos um ponto (percentual e tempo).')
      return
    }

    setSalvando(true)
    try {
      await lancarTesteLimiar({
        atleta_id: Number(atletaId),
        data_teste: data,
        distancia: distancia.trim() === '' ? null : Number(distancia),
        observacao:
          observacao.trim() === '' ? null : observacao.trim(),
        pontos,
      })
      const nome =
        atletas.find((a) => a.id_atleta === Number(atletaId))
          ?.nome ?? 'atleta'
      setSucesso(
        `Teste de limiar com ${pontos.length} ponto(s) lançado para ${nome} em ${data}.`
      )
      setLinhas(LINHAS_INICIAIS)
      setObservacao('')
    } catch (err) {
      setErro(mensagemErro(err, 'Erro ao salvar.'))
    } finally {
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">
            Atleta <span className="form-required">*</span>
          </label>
          <select
            className="form-input"
            value={atletaId}
            onChange={(e) => setAtletaId(e.target.value)}
          >
            <option value="">Selecione...</option>
            {atletas.map((a) => (
              <option key={a.id_atleta} value={a.id_atleta}>
                {a.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">
            Data do teste <span className="form-required">*</span>
          </label>
          <input
            type="date"
            className="form-input"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="form-label">Distância (m)</label>
          <input
            type="number"
            step="any"
            className="form-input"
            value={distancia}
            onChange={(e) => setDistancia(e.target.value)}
          />
        </div>
      </div>

      <div className="form-section-label">
        Pontos da curva (percentual → tempo)
      </div>

      <div className="limiar-rows">
        <div className="limiar-row limiar-row-head">
          <span>Percentual (%)</span>
          <span>Tempo (m:ss.cc)</span>
          <span />
        </div>
        {linhas.map((l, i) => (
          <div className="limiar-row" key={i}>
            <input
              type="number"
              className="form-input"
              placeholder="Ex: 80"
              value={l.percentual}
              onChange={(e) =>
                atualizarLinha(i, 'percentual', e.target.value)
              }
            />
            <input
              type="text"
              className="form-input"
              placeholder="Ex: 1:49.23"
              value={l.tempo}
              onChange={(e) =>
                atualizarLinha(i, 'tempo', e.target.value)
              }
            />
            <button
              type="button"
              className="btn-icon btn-icon-danger"
              title="Remover linha"
              onClick={() => removerLinha(i)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-secondary"
        style={{ marginTop: 12 }}
        onClick={adicionarLinha}
      >
        + Adicionar ponto
      </button>

      <div
        className="form-field form-field-full"
        style={{ marginTop: 16 }}
      >
        <label className="form-label">Observação</label>
        <textarea
          className="form-input"
          rows={2}
          placeholder="Opcional"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
        />
      </div>

      {erro && <div className="form-error">{erro}</div>}
      {sucesso && <div className="form-success">✓ {sucesso}</div>}

      <div className="modal-footer">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={salvando}
        >
          {salvando ? 'Salvando...' : 'Lançar teste de limiar'}
        </button>
      </div>
    </form>
  )
}
