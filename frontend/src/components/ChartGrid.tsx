import type { CountryIndicators } from '../types/api'
import { INDICATOR_CONFIG } from '../config/indicators'
import ChartCard from './ChartCard'

interface ChartGridProps {
    data: CountryIndicators
}

export default function ChartGrid({ data }: ChartGridProps) {
    return (
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
    )
}