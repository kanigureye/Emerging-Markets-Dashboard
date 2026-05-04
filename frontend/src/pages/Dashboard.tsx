import { useState } from 'react'
import { useCountriesQuery, useIndicatorsQuery } from '../queries/indicators'
import Nav from '../components/Nav'
import CountrySelector from '../components/CountrySelector'
import ChartGrid from '../components/ChartGrid'
import ComparisonView from '../components/ComparisonView'

export default function Dashboard() {
    const [selectedCountry, setSelectedCountry] = useState('NG')
    const [mode, setMode] = useState<'single' | 'compare'>('single')

    const { data: countries } = useCountriesQuery()
    const { data, isLoading, isError } = useIndicatorsQuery(selectedCountry)

    return (
        <div style={{
            minHeight: '100vh',
            background: '#04080a',
            color: '#e4fff4',
            fontFamily: "'JetBrains Mono', monospace",
            padding: '0 0 80px',
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
                <Nav mode="dashboard" />

                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px 0 32px' }}>
                    <div>
                        <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1de9b6', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ width: 24, height: 1, background: '#1de9b6', display: 'inline-block' }} />
                            Economic Indicators
                        </div>
                        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 300, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em', color: '#e4fff4', margin: 0 }}>
                            {mode === 'single' && data
                                ? <><em style={{ fontStyle: 'italic', color: '#5dffc2' }}>{data.country}</em> · {data.region}</>
                                : mode === 'compare' ? 'Compare Markets' : 'Select a market'}
                        </h1>
                    </div>

                    {/* Controls */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                        {mode === 'single' && countries && (
                            <CountrySelector
                                countries={countries}
                                value={selectedCountry}
                                onChange={setSelectedCountry}
                            />
                        )}
                        <button
                            onClick={() => setMode(mode === 'single' ? 'compare' : 'single')}
                            style={{
                                background: mode === 'compare' ? '#5dffc2' : 'transparent',
                                color: mode === 'compare' ? '#04080a' : '#5dffc2',
                                border: '0.5px solid #5dffc2',
                                borderRadius: 4,
                                padding: '10px 16px',
                                fontSize: 12,
                                fontFamily: "'JetBrains Mono', monospace",
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                            }}
                        >
                            {mode === 'single' ? 'Compare →' : '← Single'}
                        </button>
                    </div>
                </div>

                {/* Single mode */}
                {mode === 'single' && (
                    <>
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
                        {data && <ChartGrid data={data} />}
                    </>
                )}

                {/* Compare mode */}
                {mode === 'compare' && countries && (
                    <ComparisonView countries={countries} />
                )}

                <p style={{ textAlign: 'center', color: '#3f6356', fontSize: 11, marginTop: 64, letterSpacing: '0.06em' }}>
                    Data source: World Bank Open Data · Updated weekly
                </p>
            </div>
        </div>
    )
}