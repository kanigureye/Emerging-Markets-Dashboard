import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import type { DataPoint } from '../types/api'
import { formatYAxis } from '../config/indicators'

interface ChartCardProps {
    title: string
    data: DataPoint[]
    color: string
    indicatorCode: string
    formatValue: (v: number) => string
}

export default function ChartCard({ title, data, color, indicatorCode, formatValue }: ChartCardProps) {
    const sorted = [...data].sort((a, b) => a.year - b.year)
    const isInflation = indicatorCode === 'FP.CPI.TOTL.ZG'

    return (
        <div style={{
            background: '#0a1f18',
            borderRadius: 6,
            padding: 28,
            border: '0.5px solid #1d4d3e',
        }}>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6a9a8a', marginBottom: 6 }}>
                indicator
            </div>
            <h3 style={{ color: '#e4fff4', margin: '0 0 24px 0', fontSize: 18, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400 }}>
                {title}
            </h3>
            <ResponsiveContainer width="100%" height={220}>
                {isInflation ? (
                    <BarChart data={sorted}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#133328" />
                        <XAxis dataKey="year" stroke="#3f6356" tick={{ fill: '#6a9a8a', fontSize: 11 }} />
                        <YAxis stroke="#3f6356" tick={{ fill: '#6a9a8a', fontSize: 11 }} tickFormatter={formatYAxis(indicatorCode)} />
                        <Tooltip
                            contentStyle={{ background: '#061411', border: '0.5px solid #1d4d3e', borderRadius: 4, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}
                            labelStyle={{ color: '#9de8c8' }}
                            formatter={(value) => [formatValue(Number(value)), title]}
                        />
                        <Bar dataKey="value" fill={color} radius={[3, 3, 0, 0]} opacity={0.85} />
                    </BarChart>
                ) : (
                    <LineChart data={sorted}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#133328" />
                        <XAxis dataKey="year" stroke="#3f6356" tick={{ fill: '#6a9a8a', fontSize: 11 }} />
                        <YAxis stroke="#3f6356" tick={{ fill: '#6a9a8a', fontSize: 11 }} tickFormatter={formatYAxis(indicatorCode)} />
                        <Tooltip
                            contentStyle={{ background: '#061411', border: '0.5px solid #1d4d3e', borderRadius: 4, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}
                            labelStyle={{ color: '#9de8c8' }}
                            formatter={(value) => [formatValue(Number(value)), title]}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            dot={{ fill: color, r: 2 }}
                            activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                    </LineChart>
                )}
            </ResponsiveContainer>
        </div>
    )
}