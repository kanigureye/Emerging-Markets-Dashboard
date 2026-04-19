package com.emergingmarkets.dashboard.dto;
import java.util.List;

public class IndicatorSeries {

    private String name;
    private List<DataPoint> data;

    public IndicatorSeries(String name, List<DataPoint> data) {
        this.name = name;
        this.data = data;
    }

    public String getName() { return name; }
    public List<DataPoint> getData() { return data; }
}