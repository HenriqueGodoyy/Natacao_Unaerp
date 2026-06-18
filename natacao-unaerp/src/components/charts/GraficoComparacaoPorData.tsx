import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { DadoGraficoPorData } from '../types/graficos'
import { getColor, tooltipStyle } from '../utils/chartColors'

type Props = {
  dados: DadoGraficoPorData[]
}

function GraficoComparacaoPorData({ dados }: Props) {
  // Extrai dinamicamente os nomes dos atletas a partir dos dados
  const atletas = dados.length > 0
    ? Object.keys(dados[0]).filter((key) => key !== 'data')
    : []

  return (
    <div style={{ width: '100%', height: 380 }}>
      <ResponsiveContainer>
        <BarChart data={dados}>
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
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={{ stroke: 'rgba(148,163,184,0.1)' }}
            tickLine={false}
          />
          <Tooltip {...tooltipStyle} />
          <Legend />
          {atletas.map((atleta, index) => (
            <Bar
              key={atleta}
              dataKey={atleta}
              fill={getColor(index)}
              radius={[6, 6, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GraficoComparacaoPorData