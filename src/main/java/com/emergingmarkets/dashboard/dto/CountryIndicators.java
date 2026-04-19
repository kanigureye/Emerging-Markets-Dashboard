package com.emergingmarkets.dashboard.dto;

import java.util.Map;

public class CountryIndicators {
    private String country;
    private String code;
    private String region;
    private Map<String, IndicatorSeries> indicators;
    public CountryIndicators(String country, String code, String region,
                                Map<String, IndicatorSeries> indicators) {
        this.country = country;
        this.code = code;
        this.region = region;
        this.indicators = indicators;
    }

    public String getCountry() { return country; }
    public String getCode() { return code; }
    public String getRegion() { return region; }
    public Map<String, IndicatorSeries> getIndicators() { return indicators; }
}