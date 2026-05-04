import { useQuery } from '@tanstack/react-query'
import {fetchComparison, fetchCountries, fetchIndicators} from '../api/indicators'
import { queryKeys } from './query-keys.ts'

export function useCountriesQuery() {
    return useQuery({
        queryKey: queryKeys.countries,
        queryFn: fetchCountries,
    })
}

export function useIndicatorsQuery(countryCode: string) {
    return useQuery({
        queryKey: queryKeys.indicators(countryCode),
        queryFn: () => fetchIndicators(countryCode),
    })
}

export function useComparisonQuery(codeA: string, codeB: string) {
    return useQuery({
        queryKey: queryKeys.comparison(codeA, codeB),
        queryFn: () => fetchComparison(codeA, codeB),
    })
}