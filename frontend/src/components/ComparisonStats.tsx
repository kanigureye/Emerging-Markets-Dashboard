import type { CountryIndicators } from '../types/api'
import { INDICATOR_CONFIG } from '../config/indicators'

interface ComparisonStatsProps {
    dataA: CountryIndicators
    dataB: CountryIndicators
}

function getLatest(data: CountryIndicators, code: string): number | null {
    const series = data.indicators[code]
    if (!series) return null
    const sorted = [...series.data].sort((a, b) => b.year - a.year)
    return sorted[0]?.value ?? null
}

export default function ComparisonStats({ dataA, dataB }: ComparisonStatsProps) {
    const indicators = [
        'NY.GDP.MKTP.CD',
        'FP.CPI.TOTL.ZG',
        'SP.POP.TOTL',
    ]

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 12,
            marginBottom: 40,
            padding: 24,
            background: '#061411',
            border: '0.5px solid #1d4d3e',
            borderRadius: 6,
        }}>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6a9a8a', marginBottom: 8 }}>
                Latest values · comparison
            </div>

            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 12, paddingBottom: 12, borderBottom: '0.5px solid #133328' }}>
                <div style={{ fontSize: 11, color: '#3f6356' }}>Indicator</div>
                <div style={{ fontSize: 12, color: '#5dffc2', fontFamily: 'Fraunces, Georgia, serif', fontStyle: 'italic' }}>{dataA.country}</div>
                <div style={{ fontSize: 12, color: '#1de9b6', fontFamily: 'Fraunces, Georgia, serif', fontStyle: 'italic' }}>{dataB.country}</div>
                <div style={{ fontSize: 11, color: '#3f6356' }}>Delta</div>
            </div>

            {/* Rows */}
            {indicators.map(code => {
                const config = INDICATOR_CONFIG[code]
                if (!config) return null
                const valA = getLatest(dataA, code)
                const valB = getLatest(dataB, code)
                const delta = valA !== null && valB !== null ? valA - valB : null

                const deltaLabel = () => {
                    if (delta === null) return '—'
                    if (code === 'NY.GDP.MKTP.CD') return `${delta >= 0 ? '+' : ''}$${(delta / 1e9).toFixed(1)}B`
                    if (code === 'SP.POP.TOTL') return `${delta >= 0 ? '+' : ''}${(delta / 1e6).toFixed(1)}M`
                    return `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}pp`
                }

                const deltaColor = delta === null ? '#3f6356'
                    : code === 'FP.CPI.TOTL.ZG'
                        ? delta > 0 ? '#ff6b6b' : '#5dffc2'
                        : delta >= 0 ? '#5dffc2' : '#ff6b6b'

                return (
                    <div key={code} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 12, padding: '10px 0', borderBottom: '0.5px solid #0a1f18' }}>
                        <div style={{ fontSize: 11, color: '#6a9a8a', letterSpacing: '0.04em' }}>{config.label}</div>
                        <div style={{ fontSize: 13, color: '#e4fff4', fontFamily: 'JetBrains Mono, monospace' }}>
                            {valA !== null ? config.format(valA) : '—'}
                        </div>
                        <div style={{ fontSize: 13, color: '#e4fff4', fontFamily: 'JetBrains Mono, monospace' }}>
                            {valB !== null ? config.format(valB) : '—'}
                        </div>
                        <div style={{ fontSize: 13, color: deltaColor, fontFamily: 'JetBrains Mono, monospace' }}>
                            {deltaLabel()}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}