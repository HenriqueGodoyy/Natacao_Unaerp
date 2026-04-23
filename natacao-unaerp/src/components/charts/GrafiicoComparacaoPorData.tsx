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

type Props = {
  dados: DadoGraficoPorData[]
}

function GraficoComparacaoPorData({ dados }: Props) {
  return (
    <div style={{ width: '100%', height: 400, marginTop: 40 }}>
      <ResponsiveContainer>
        <BarChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Alice Holer Silva" fill="#8884d8" />
          <Bar dataKey="Arthur Marques" fill="#82ca9d" />
          <Bar dataKey="Arthur Ribeiro dos Santos" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GraficoComparacaoPorData