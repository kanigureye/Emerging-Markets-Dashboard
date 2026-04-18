package com.emergingmarkets.dashboard.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WorldBankDataPoint {

    @JsonProperty("date")
    private String year;
    @JsonProperty("value")
    private Double value;

    @JsonProperty("indicator")
    private IndicatorMeta indicator;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class IndicatorMeta {
        @JsonProperty("id")
        private String id;

        @JsonProperty("value")
        private String name;

        public String getId() { return id; }
        public String getName() { return name; }
    }

    public String getYear() { return year; }
    public Double getValue() { return value; }
    public IndicatorMeta getIndicator() { return indicator; }
}