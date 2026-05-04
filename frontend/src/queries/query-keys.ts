export const queryKeys = {
    countries: ['countries'] as const,
    indicators: (code: string) => ['indicators', code] as const,
    comparison: (codeA: string, codeB: string) => ['comparison', codeA, codeB] as const,
}