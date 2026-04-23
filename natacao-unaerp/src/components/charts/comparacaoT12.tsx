import { 
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
   // Cell, usado para deixar cores variadas nos graficos
   LabelList,
}from 'recharts'
import type { DadoGraficoComparacao } from '../types/graficos'

type Props = { dados: DadoGraficoComparacao[]}


function GraficoComparacaoT12({ dados} :Props) {
    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <BarChart data={dados}>
                    <CartesianGrid strokeDasharray="3 3 "/>
                    <XAxis dataKey="atleta" 
                        tick={{ fontSize: 12, fill: '#f8f8f8' }}
                    />
                    <YAxis />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#000000',
                            border: '1 px solid #555',
                            borderRadius: '10px', 
                        }}  
                        labelStyle={{ color : '#fff' }}
                        itemStyle={{ color : '#8b80f9'}}                  
                    />
                    <Bar 
                    dataKey="valor" 
                    radius= {[8,8,0,0]} 
                    fill="#70bbee" 
                    activeBar={{ stroke: '#070606', strokeWidth: 2 }}
                    >
                    <LabelList dataKey="valor" position="top" />
                    
                    </Bar> 
                </BarChart>
            </ResponsiveContainer>

        </div>
    )
}


export default GraficoComparacaoT12