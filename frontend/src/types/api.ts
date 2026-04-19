export interface DataPoint {
    year: number;
    value: number | null;
}

export interface IndicatorSeries {
    name: string;
    data: DataPoint[];
}

export interface CountryIndicators {
    country: string;
    code: string;
    region: string;
    indicators: Record<string, IndicatorSeries>;
}

export interface Country {
    id: number;
    code: string;
    name: string;
    region: string;
}