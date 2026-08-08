import { useState } from 'react'
import type { Atleta } from '../types/atleta'
import type { TipoTeste } from '../types/resultado'
import { lancarResultadosTeste } from '../../services/resultados'
import { mensagemErro } from '../utils/erros'

interface Props {
  atletas: Atleta[]
  tipos: TipoTeste[]
}

function hoje(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function FormResultadoTeste({
  atletas,
  tipos,
}: Props) {
  const [atletaId, setAtletaId] = useState('')
  const [data, setData] = useState(hoje())
  const [observacao, setObservacao] = useState('')
  // valores por tipo_teste_id (como string, para o input controlado).
  const [valores, setValores] = useState<Record<number, string>>(
    {}
  )
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  function setValor(tipoId: number, valor: string) {
    setValores((prev) => ({ ...prev, [tipoId]: valor }))
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

    const preenchidos = tipos
      .map((t) => ({
        tipo_teste_id: t.id_tipo_teste,
        valor: Number(valores[t.id_tipo_teste]),
        bruto: valores[t.id_tipo_teste],
      }))
      .filter((v) => v.bruto !== undefined && v.bruto.trim() !== '')

    if (preenchidos.length === 0) {
      setErro('Preencha pelo menos um valor de teste.')
      return
    }
    if (preenchidos.some((v) => Number.isNaN(v.valor))) {
      setErro('Há um valor inválido. Use apenas números.')
      return
    }

    setSalvando(true)
    try {
      await lancarResultadosTeste({
        atleta_id: Number(atletaId),
        data_resultado: data,
        observacao: observacao.trim() === '' ? null : observacao.trim(),
        valores: preenchidos.map((v) => ({
          tipo_teste_id: v.tipo_teste_id,
          valor: v.valor,
        })),
      })
      const nome =
        atletas.find((a) => a.id_atleta === Number(atletaId))
          ?.nome ?? 'atleta'
      setSucesso(
        `${preenchidos.length} resultado(s) lançado(s) para ${nome} em ${data}.`
      )
      // Mantém atleta e data para lançamentos em sequência; limpa valores.
      setValores({})
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
      </div>

      <div className="form-section-label">Valores medidos</div>
      <div className="form-grid">
        {tipos.map((t) => (
          <div className="form-field" key={t.id_tipo_teste}>
            <label className="form-label">
              {t.nome}
              {t.unidade ? ` (${t.unidade})` : ''}
            </label>
            <input
              type="number"
              step="any"
              className="form-input"
              placeholder="—"
              value={valores[t.id_tipo_teste] ?? ''}
              onChange={(e) =>
                setValor(t.id_tipo_teste, e.target.value)
              }
            />
          </div>
        ))}
      </div>

      <div className="form-field form-field-full" style={{ marginTop: 16 }}>
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
          {salvando ? 'Salvando...' : 'Lançar resultados'}
        </button>
      </div>
    </form>
  )
}
