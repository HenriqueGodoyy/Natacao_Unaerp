import { useMemo, useState } from 'react'
import { getIniciais } from '../utils/chartColors'

interface AthleteFilterProps {
  atletas: string[]
  atletasSelecionados: string[]
  onChange: (atletas: string[]) => void
  singleSelect?: boolean
}

export default function AthleteFilter({
  atletas,
  atletasSelecionados,
  onChange,
  singleSelect = false,
}: AthleteFilterProps) {
  const [pesquisa, setPesquisa] = useState('')

  const atletasFiltrados = useMemo(() => {
    return atletas.filter((atleta) =>
      atleta
        .toLowerCase()
        .includes(pesquisa.toLowerCase())
    )
  }, [pesquisa, atletas])

  const toggleAtleta = (nome: string) => {
    if (singleSelect) {
      onChange([nome])
      return
    }

    if (atletasSelecionados.includes(nome)) {
      onChange(
        atletasSelecionados.filter(
          (a) => a !== nome
        )
      )
    } else {
      onChange([...atletasSelecionados, nome])
    }
  }

  return (
    <div className="filter-container">
      {/* Search input */}
      <div className="filter-search-wrapper">
        <span className="filter-search-icon">🔍</span>
        <input
          type="text"
          placeholder="Pesquisar atletas..."
          value={pesquisa}
          onChange={(e) =>
            setPesquisa(e.target.value)
          }
          className="filter-search"
        />
      </div>

      {/* Selected chips */}
      {atletasSelecionados.length > 0 && (
        <div className="chips-row">
          {atletasSelecionados.map((atleta) => (
            <div key={atleta} className="chip">
              {atleta}
              <button
                onClick={() =>
                  toggleAtleta(atleta)
                }
                className="chip-remove"
                aria-label={`Remover ${atleta}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Athlete list */}
      <div className="athlete-list">
        {atletasFiltrados.map((atleta) => {
          const selecionado = atletasSelecionados.includes(atleta)
          return (
            <button
              key={atleta}
              type="button"
              onClick={() => toggleAtleta(atleta)}
              aria-pressed={selecionado}
              className={`athlete-item ${selecionado ? 'selected' : ''}`}
            >
              <div className="athlete-avatar">
                {getIniciais(atleta)}
              </div>
              {atleta}
            </button>
          )
        })}
      </div>
    </div>
  )
}