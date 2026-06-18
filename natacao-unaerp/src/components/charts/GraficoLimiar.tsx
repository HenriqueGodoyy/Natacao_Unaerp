import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { getColor, tooltipStyle } from '../utils/chartColors'

type Props = {
  dados: any[]
  atletas: string[]
}

function formatarTempo(ms: number) {
  const minutos = Math.floor(ms / 60000)
  const segundos = Math.floor((ms % 60000) / 1000)
  const centesimos = Math.floor((ms % 1000) / 10)

  return `${minutos}:${segundos
    .toString()
    .padStart(2, '0')}.${centesimos
    .toString()
    .padStart(2, '0')}`
}

function GraficoLimiar({ dados, atletas }: Props) {
  return (
    <div style={{ width: '100%', height: 450 }}>
      <ResponsiveContainer>
        <LineChart data={dados}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148,163,184,0.06)"
          />

          <XAxis
            dataKey="percentual"
            tickFormatter={(value) => `${value}%`}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={{ stroke: 'rgba(148,163,184,0.1)' }}
            tickLine={false}
          />

          <YAxis
            tickFormatter={(value) => formatarTempo(value)}
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={{ stroke: 'rgba(148,163,184,0.1)' }}
            tickLine={false}
          />

          <Tooltip
            formatter={(value) =>
              formatarTempo(Number(value ?? 0))
            }
            {...tooltipStyle}
          />

          <Legend />

          {atletas.map((atleta, index) => (
            <Line
              key={atleta}
              type="monotone"
              dataKey={atleta}
              stroke={getColor(index)}
              strokeWidth={3}
              dot={{ r: 5, fill: getColor(index), strokeWidth: 2, stroke: '#0a0e1a' }}
              activeDot={{ r: 7, stroke: getColor(index), strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GraficoLimiar