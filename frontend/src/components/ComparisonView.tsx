import { useState } from 'react'
import type { Country } from '../types/api'
import { useComparisonQuery } from '../queries/indicators'
import CountrySelector from './CountrySelector'
import ChartGrid from './ChartGrid'
import ComparisonStats from './ComparisonStats'

interface ComparisonViewProps {
    countries: Country[]
}

export default function ComparisonView({ countries }: ComparisonViewProps) {
    const [countryA, setCountryA] = useState('NG')
    const [countryB, setCountryB] = useState('IN')

    const { data, isLoading, isError } = useComparisonQuery(countryA, countryB)

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
                <CountrySelector countries={countries} value={countryA} onChange={setCountryA} label="Country A" />
                <CountrySelector countries={countries} value={countryB} onChange={setCountryB} label="Country B" />
            </div>

            {isLoading && (
                <div style={{ textAlign: 'center', padding: 80, color: '#6a9a8a', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Fetching comparison data...
                </div>
            )}
            {isError && (
                <div style={{ textAlign: 'center', padding: 80, color: '#ff6b6b', fontSize: 12 }}>
                    Failed to load. Is the backend running?
                </div>
            )}

            {data && (
                <>
                    <ComparisonStats dataA={data[0]} dataB={data[1]} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                        {data.map(countryData => (
                            <div key={countryData.code}>
                                <div style={{ marginBottom: 20 }}>
                                    <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 300, fontSize: 28, color: '#e4fff4', margin: '0 0 4px 0' }}>
                                        <em style={{ fontStyle: 'italic', color: '#5dffc2' }}>{countryData.country}</em>
                                    </h2>
                                    <div style={{ fontSize: 11, color: '#6a9a8a', letterSpacing: '0.08em' }}>{countryData.region}</div>
                                </div>
                                <ChartGrid data={countryData} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}