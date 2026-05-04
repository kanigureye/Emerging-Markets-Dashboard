export const INDICATOR_CONFIG: Record<string, {
    label: string
    color: string
    format: (v: number) => string
}> = {
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

export const formatYAxis = (code: string) => (value: number) => {
    if (code === 'NY.GDP.MKTP.CD') return `$${(value / 1e9).toFixed(0)}B`
    if (code === 'SP.POP.TOTL') return `${(value / 1e6).toFixed(0)}M`
    return `${value.toFixed(1)}%`
}