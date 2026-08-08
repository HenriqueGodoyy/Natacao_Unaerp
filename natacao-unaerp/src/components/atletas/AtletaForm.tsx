import { useEffect, useState } from 'react'
import type { Atleta, AtletaFormData } from '../types/atleta'
import { SEXOS } from '../types/atleta'

interface AtletaFormProps {
  // Quando presente, o formulário está em modo edição.
  atleta?: Atleta | null
  onSalvar: (dados: AtletaFormData) => Promise<void>
  onFechar: () => void
}

function estadoInicial(atleta?: Atleta | null): AtletaFormData {
  return {
    nome: atleta?.nome ?? '',
    data_nascimento: atleta?.data_nascimento ?? '',
    sexo: atleta?.sexo ?? '',
    RG: atleta?.RG ?? '',
    CPF: atleta?.CPF ?? '',
    Telefone: atleta?.Telefone ?? '',
    responsavel: atleta?.responsavel ?? '',
    categoria: atleta?.categoria ?? '',
    federado: atleta?.federado ?? false,
    ativo: atleta?.ativo ?? true,
  }
}

// Converte strings vazias em null antes de enviar ao banco.
function normalizar(form: AtletaFormData): AtletaFormData {
  const limpar = (v: string | null) => {
    const t = (v ?? '').trim()
    return t === '' ? null : t
  }
  return {
    ...form,
    nome: form.nome.trim(),
    data_nascimento: limpar(form.data_nascimento),
    sexo: limpar(form.sexo),
    RG: limpar(form.RG),
    CPF: limpar(form.CPF),
    Telefone: limpar(form.Telefone),
    responsavel: limpar(form.responsavel),
    categoria: limpar(form.categoria),
  }
}

export default function AtletaForm({
  atleta,
  onSalvar,
  onFechar,
}: AtletaFormProps) {
  const [form, setForm] = useState<AtletaFormData>(
    estadoInicial(atleta)
  )
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const editando = Boolean(atleta)

  // Fecha o modal ao pressionar Esc.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onFechar])

  function atualizarCampo<K extends keyof AtletaFormData>(
    campo: K,
    valor: AtletaFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.nome.trim() === '') {
      setErro('O nome do atleta é obrigatório.')
      return
    }
    setSalvando(true)
    setErro(null)
    try {
      await onSalvar(normalizar(form))
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao salvar.'
      setErro(msg)
      setSalvando(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {editando ? 'Editar atleta' : 'Novo atleta'}
          </h2>
          <button
            className="modal-close"
            onClick={onFechar}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-field form-field-full">
              <label className="form-label">
                Nome <span className="form-required">*</span>
              </label>
              <input
                className="form-input"
                value={form.nome}
                onChange={(e) =>
                  atualizarCampo('nome', e.target.value)
                }
                placeholder="Nome completo"
                autoFocus
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                Data de nascimento
              </label>
              <input
                type="date"
                className="form-input"
                value={form.data_nascimento ?? ''}
                onChange={(e) =>
                  atualizarCampo(
                    'data_nascimento',
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-field">
              <label className="form-label">Sexo</label>
              <select
                className="form-input"
                value={form.sexo ?? ''}
                onChange={(e) =>
                  atualizarCampo('sexo', e.target.value)
                }
              >
                <option value="">Não informado</option>
                {SEXOS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Categoria</label>
              <input
                className="form-input"
                value={form.categoria ?? ''}
                onChange={(e) =>
                  atualizarCampo('categoria', e.target.value)
                }
                placeholder="Ex: júnior 1"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Telefone</label>
              <input
                className="form-input"
                value={form.Telefone ?? ''}
                onChange={(e) =>
                  atualizarCampo('Telefone', e.target.value)
                }
                placeholder="(16) 99999-9999"
              />
            </div>

            <div className="form-field">
              <label className="form-label">RG</label>
              <input
                className="form-input"
                value={form.RG ?? ''}
                onChange={(e) =>
                  atualizarCampo('RG', e.target.value)
                }
              />
            </div>

            <div className="form-field">
              <label className="form-label">CPF</label>
              <input
                className="form-input"
                value={form.CPF ?? ''}
                onChange={(e) =>
                  atualizarCampo('CPF', e.target.value)
                }
              />
            </div>

            <div className="form-field form-field-full">
              <label className="form-label">Responsável</label>
              <input
                className="form-input"
                value={form.responsavel ?? ''}
                onChange={(e) =>
                  atualizarCampo('responsavel', e.target.value)
                }
                placeholder="Nome do responsável"
              />
            </div>

            <div className="form-field-checkboxes form-field-full">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  checked={form.federado}
                  onChange={(e) =>
                    atualizarCampo('federado', e.target.checked)
                  }
                />
                Federado
              </label>
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  checked={form.ativo}
                  onChange={(e) =>
                    atualizarCampo('ativo', e.target.checked)
                  }
                />
                Ativo
              </label>
            </div>
          </div>

          {erro && <div className="form-error">{erro}</div>}

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onFechar}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={salvando}
            >
              {salvando
                ? 'Salvando...'
                : editando
                  ? 'Salvar alterações'
                  : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
