import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { getAtletaColor } from '../utils/chartColors'
import type { DadoRadar } from '../types/graficos'

type EntradaTooltip = {
  dataKey: string
  name: string
  color: string
  payload: Record<string, string | number>
}

type TooltipRadarProps = {
  active?: boolean
  label?: string
  payload?: EntradaTooltip[]
}

function TooltipRadar({ active, payload, label }: TooltipRadarProps) {
  if (!active || !payload?.length) return null

  return (
    <div
      style={{
        background: '#1a1f35',
        padding: '12px 16px',
        border: '1px solid rgba(148,163,184,0.15)',
        borderRadius: '10px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <p style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: 6, margin: 0 }}>
        {label}
      </p>

      {payload.map((entry) => {
        const valorReal =
          entry.payload[`${entry.dataKey}_real`]

        return (
          <p key={entry.dataKey} style={{ color: entry.color, margin: '4px 0', fontSize: '0.85rem' }}>
            {entry.name}: {valorReal}
          </p>
        )
      })}
    </div>
  )
}

type Props = {
  dados: DadoRadar[]
  atletas: string[]
  todosAtletas: string[]
}

function GraficoRadarT12({ dados, atletas, todosAtletas }: Props) {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <RadarChart data={dados} outerRadius="72%">
          <PolarGrid stroke="rgba(148,163,184,0.15)" />
          <PolarAngleAxis
            dataKey="metrica"
            tick={{ fill: '#94a3b8', fontSize: 13 }}
          />
          {/* Eixo de raio com domínio fixo (valores são relativos à
              equipe, então os números são ocultados para não confundir). */}
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Tooltip content={<TooltipRadar />} />
          <Legend />

          {atletas.map((atleta) => (
            <Radar
              key={atleta}
              name={atleta}
              dataKey={atleta}
              stroke={getAtletaColor(atleta, todosAtletas)}
              fill={getAtletaColor(atleta, todosAtletas)}
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{ r: 3, fillOpacity: 1 }}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GraficoRadarT12