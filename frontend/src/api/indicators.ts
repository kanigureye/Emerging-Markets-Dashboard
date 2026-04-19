import client from './client';
import type {CountryIndicators, Country} from '../types/api';

export const fetchCountries = async (): Promise<Country[]> => {
    const { data } = await client.get<Country[]>('/countries');
    return data;
};

export const fetchIndicators = async (countryCode: string): Promise<CountryIndicators> => {
    const { data } = await client.get<CountryIndicators>(`/indicators/${countryCode}`);
    return data;
};
