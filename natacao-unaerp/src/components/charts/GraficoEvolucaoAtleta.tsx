import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { ResultadoTesteCompleto } from '../types/graficos'
import { getColor, tooltipStyle } from '../utils/chartColors'

type Props = {
  // Um registro por data, com FC1/FC2 (bpm) e MTS (m).
  dados: ResultadoTesteCompleto[]
}

// Evolução do teste T12 de um único atleta ao longo do tempo.
// FC1/FC2 usam o eixo esquerdo (bpm); MTS usa o eixo direito (m),
// pois estão em escalas muito diferentes.
function GraficoEvolucaoAtleta({ dados }: Props) {
  return (
    <div style={{ width: '100%', height: 380 }}>
      <ResponsiveContainer>
        <LineChart data={dados}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148,163,184,0.06)"
          />
          <XAxis
            dataKey="data"
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={{ stroke: 'rgba(148,163,184,0.1)' }}
            tickLine={false}
          />
          <YAxis
            yAxisId="fc"
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={{ stroke: 'rgba(148,163,184,0.1)' }}
            tickLine={false}
            label={{
              value: 'bpm',
              angle: -90,
              position: 'insideLeft',
              fill: '#64748b',
              fontSize: 12,
            }}
          />
          <YAxis
            yAxisId="mts"
            orientation="right"
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={{ stroke: 'rgba(148,163,184,0.1)' }}
            tickLine={false}
            label={{
              value: 'm',
              angle: 90,
              position: 'insideRight',
              fill: '#64748b',
              fontSize: 12,
            }}
          />
          <Tooltip {...tooltipStyle} />
          <Legend />
          <Line
            yAxisId="fc"
            type="monotone"
            dataKey="FC1"
            name="FC1 (bpm)"
            stroke={getColor(1)}
            strokeWidth={2}
            connectNulls
            dot={{ r: 4 }}
          />
          <Line
            yAxisId="fc"
            type="monotone"
            dataKey="FC2"
            name="FC2 (bpm)"
            stroke={getColor(5)}
            strokeWidth={2}
            connectNulls
            dot={{ r: 4 }}
          />
          <Line
            yAxisId="mts"
            type="monotone"
            dataKey="MTS"
            name="MTS (m)"
            stroke={getColor(0)}
            strokeWidth={2}
            connectNulls
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GraficoEvolucaoAtleta
