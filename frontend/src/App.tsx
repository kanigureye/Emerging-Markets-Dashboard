import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { fetchCountries, fetchIndicators } from './api/indicators'
import type {DataPoint} from './types/api'

const INDICATOR_CONFIG: Record<string, { label: string; color: string; format: (v: number) => string }> = {
    'NY.GDP.MKTP.CD': {
        label: 'GDP (current US$)',
        color: '#00d4aa',
        format: (v) => `$${(v / 1e9).toFixed(1)}B`,
    },
    'FP.CPI.TOTL.ZG': {
        label: 'Inflation (%)',
        color: '#ff6b6b',
        format: (v) => `${v.toFixed(1)}%`,
    },
    'SP.POP.TOTL': {
        label: 'Population',
        color: '#4ecdc4',
        format: (v) => `${(v / 1e6).toFixed(1)}M`,
    },
}

const formatYAxis = (code: string) => (value: number) => {
    if (code === 'NY.GDP.MKTP.CD') return `$${(value / 1e9).toFixed(0)}B`
    if (code === 'SP.POP.TOTL') return `${(value / 1e6).toFixed(0)}M`
    return `${value.toFixed(1)}%`
}

interface ChartCardProps {
    title: string
    data: DataPoint[]
    color: string
    indicatorCode: string
    formatValue: (v: number) => string
}

function ChartCard({ title, data, color, indicatorCode, formatValue }: ChartCardProps) {
    const sorted = [...data].sort((a, b) => a.year - b.year)
    const isInflation = indicatorCode === 'FP.CPI.TOTL.ZG'

    return (
        <div style={{
            background: '#1a1a2e',
            borderRadius: 12,
            padding: 24,
            border: '1px solid #2a2a4a',
        }}>
            <h3 style={{ color: '#e0e0e0', margin: '0 0 20px 0', fontSize: 16 }}>{title}</h3>
            <ResponsiveContainer width="100%" height={220}>
                {isInflation ? (
                    <BarChart data={sorted}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                        <XAxis dataKey="year" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                        <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} tickFormatter={formatYAxis(indicatorCode)} />
                        <Tooltip
                            contentStyle={{ background: '#16213e', border: '1px solid #2a2a4a', borderRadius: 8 }}
                            labelStyle={{ color: '#e0e0e0' }}
                            formatter={(value) => [formatValue(Number(value)), title]}                        />
                        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                ) : (
                    <LineChart data={sorted}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                        <XAxis dataKey="year" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
                        <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} tickFormatter={formatYAxis(indicatorCode)} />
                        <Tooltip
                            contentStyle={{ background: '#16213e', border: '1px solid #2a2a4a', borderRadius: 8 }}
                            labelStyle={{ color: '#e0e0e0' }}
                            formatter={(value) => [formatValue(Number(value)), title]}                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2.5}
                            dot={{ fill: color, r: 3 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                )}
            </ResponsiveContainer>
        </div>
    )
}

function App() {
    const [selectedCountry, setSelectedCountry] = useState('NG')

    const { data: countries } = useQuery({
        queryKey: ['countries'],
        queryFn: fetchCountries,
    })

    const { data, isLoading, isError } = useQuery({
        queryKey: ['indicators', selectedCountry],
        queryFn: () => fetchIndicators(selectedCountry),
    })
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f0f23',
            color: '#e0e0e0',
            fontFamily: 'Inter, system-ui, sans-serif',
            padding: '32px 24px',
        }}>
            {/* Header */}
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#ffffff' }}>
                            🌍 Emerging Markets Dashboard
                        </h1>
                        <p style={{ margin: '4px 0 0 0', color: '#888', fontSize: 14 }}>
                            Economic indicators · World Bank data
                        </p>
                    </div>

                    {/* Country selector */}
                    <select
                        value={selectedCountry}
                        onChange={e => setSelectedCountry(e.target.value)}
                        style={{
                            background: '#1a1a2e',
                            color: '#e0e0e0',
                            border: '1px solid #2a2a4a',
                            borderRadius: 8,
                            padding: '10px 16px',
                            fontSize: 15,
                            cursor: 'pointer',
                            outline: 'none',
                        }}
                    >
                        {countries?.map(c => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Country tag */}
                {data && (
                    <div style={{ marginBottom: 24 }}>
            <span style={{
                background: '#00d4aa22',
                color: '#00d4aa',
                border: '1px solid #00d4aa44',
                borderRadius: 20,
                padding: '4px 14px',
                fontSize: 13,
            }}>
              {data.country} · {data.region}
            </span>
                    </div>
                )}

                {/* States */}
                {isLoading && (
                    <div style={{ textAlign: 'center', padding: 80, color: '#888' }}>
                        Loading data...
                    </div>
                )}
                {isError && (
                    <div style={{ textAlign: 'center', padding: 80, color: '#ff6b6b' }}>
                        Failed to load data. Is the backend running?
                    </div>
                )}

                {/* Charts grid */}
                {data && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: 20,
                    }}>
                        {Object.entries(data.indicators).map(([code, series]) => {
                            const config = INDICATOR_CONFIG[code]
                            if (!config) return null
                            return (
                                <ChartCard
                                    key={code}
                                    title={config.label}
                                    data={series.data}
                                    color={config.color}
                                    indicatorCode={code}
                                    formatValue={config.format}
                                />
                            )
                        })}
                    </div>
                )}

                {/* Footer */}
                <p style={{ textAlign: 'center', color: '#444', fontSize: 12, marginTop: 48 }}>
                    Data source: World Bank Open Data · Updated weekly
                </p>
            </div>
        </div>
    )
}

export default App