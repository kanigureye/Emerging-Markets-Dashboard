package com.emergingmarkets.dashboard.dto;

public class DataPoint {

    private Integer year;
    private Double value;

    public DataPoint(Integer year, Double value) {
        this.year = year;
        this.value = value;
    }

    public Integer getYear() { return year; }
    public Double getValue() { return value; }
}