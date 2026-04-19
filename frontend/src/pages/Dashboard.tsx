import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { fetchCountries, fetchIndicators } from '../api/indicators'
import type {DataPoint} from "../types/api.ts";

const INDICATOR_CONFIG: Record<string, { label: string; color: string; format: (v: number) => string }> = {
    'NY.GDP.MKTP.CD': {
        label: 'GDP (current US$)',
        color: '#1de9b6',
        format: (v) => `$${(v / 1e9).toFixed(1)}B`,
    },
    'FP.CPI.TOTL.ZG': {
        label: 'Inflation (%)',
        color: '#ff6b6b',
        format: (v) => `${v.toFixed(1)}%`,
    },
    'SP.POP.TOTL': {
        label: 'Population',
        color: '#5dffc2',
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
            background: '#0a1f18',
            borderRadius: 6,
            padding: 28,
            border: '0.5px solid #1d4d3e',
            transition: 'border-color 0.2s',
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

export default function Dashboard() {
    const [selectedCountry, setSelectedCountry] = useState('NG')
    const navigate = useNavigate()

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
            background: '#04080a',
            color: '#e4fff4',
            fontFamily: "'JetBrains Mono', monospace",
            padding: '0 0 80px',
        }}>
            {/* Nav */}
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
                <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', borderBottom: '0.5px solid #133328' }}>
                    <div
                        onClick={() => navigate('/')}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
                    >
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#5dffc2', boxShadow: '0 0 10px #5dffc2', display: 'inline-block' }} />
                        Emerging Markets
                    </div>
                    <div style={{ fontSize: 11, color: '#6a9a8a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Dashboard
                    </div>
                </nav>

                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px 0 32px' }}>
                    <div>
                        <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1de9b6', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ width: 24, height: 1, background: '#1de9b6', display: 'inline-block' }} />
                            Economic Indicators
                        </div>
                        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 300, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em', color: '#e4fff4', margin: 0 }}>
                            {data ? <><em style={{ fontStyle: 'italic', color: '#5dffc2' }}>{data.country}</em> · {data.region}</> : 'Select a market'}
                        </h1>
                    </div>

                    {/* Country selector */}
                    <select
                        value={selectedCountry}
                        onChange={e => setSelectedCountry(e.target.value)}
                        style={{
                            background: '#0a1f18',
                            color: '#e4fff4',
                            border: '0.5px solid #1d4d3e',
                            borderRadius: 4,
                            padding: '10px 16px',
                            fontSize: 13,
                            fontFamily: "'JetBrains Mono', monospace",
                            cursor: 'pointer',
                            outline: 'none',
                            letterSpacing: '0.04em',
                        }}
                    >
                        {countries?.map(c => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* States */}
                {isLoading && (
                    <div style={{ textAlign: 'center', padding: 80, color: '#6a9a8a', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Fetching data...
                    </div>
                )}
                {isError && (
                    <div style={{ textAlign: 'center', padding: 80, color: '#ff6b6b', fontSize: 12 }}>
                        Failed to load. Is the backend running?
                    </div>
                )}

                {/* Charts */}
                {data && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
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
                <p style={{ textAlign: 'center', color: '#3f6356', fontSize: 11, marginTop: 64, letterSpacing: '0.06em' }}>
                    Data source: World Bank Open Data · Updated weekly
                </p>
            </div>
        </div>
    )
}