import { 
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from 'recharts'
import type { DadoGraficoComparacao } from '../types/graficos'
import { tooltipStyle } from '../utils/chartColors'

type Props = { dados: DadoGraficoComparacao[] }

function GraficoComparacaoT12({ dados }: Props) {
    return (
        <div style={{ width: '100%', height: 380 }}>
            <ResponsiveContainer>
                <BarChart data={dados}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(148,163,184,0.06)"
                    />
                    <XAxis
                        dataKey="atleta"
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        axisLine={{ stroke: 'rgba(148,163,184,0.1)' }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        axisLine={{ stroke: 'rgba(148,163,184,0.1)' }}
                        tickLine={false}
                    />
                    <Tooltip
                        {...tooltipStyle}
                    />
                    <Bar
                        dataKey="valor"
                        radius={[8, 8, 0, 0]}
                        fill="#06b6d4"
                        activeBar={{ stroke: '#22d3ee', strokeWidth: 2 }}
                    >
                        <LabelList
                            dataKey="valor"
                            position="top"
                            fill="#94a3b8"
                            fontSize={12}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default GraficoComparacaoT12