import type { Country } from '../types/api'

interface CountrySelectorProps {
    countries: Country[]
    value: string
    onChange: (code: string) => void
    label?: string
}

export default function CountrySelector({ countries, value, onChange, label }: CountrySelectorProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {label && (
                <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6a9a8a' }}>
                    {label}
                </div>
            )}
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
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
                {countries.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                ))}
            </select>
        </div>
    )
}