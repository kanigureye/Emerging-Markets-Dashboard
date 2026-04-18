package com.emergingmarkets.dashboard.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "indicators")
public class Indicator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @Column(name = "indicator_code", nullable = false)
    private String indicatorCode;

    @Column(name = "indicator_name", nullable = false)
    private String indicatorName;

    @Column(nullable = false)
    private Integer year;

    @Column(precision = 20, scale = 4)
    private BigDecimal value;

    // Constructors
    public Indicator() {}

    public Indicator(Country country, String indicatorCode, String indicatorName,
                     Integer year, BigDecimal value) {
        this.country = country;
        this.indicatorCode = indicatorCode;
        this.indicatorName = indicatorName;
        this.year = year;
        this.value = value;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Country getCountry() { return country; }
    public void setCountry(Country country) { this.country = country; }

    public String getIndicatorCode() { return indicatorCode; }
    public void setIndicatorCode(String indicatorCode) { this.indicatorCode = indicatorCode; }

    public String getIndicatorName() { return indicatorName; }
    public void setIndicatorName(String indicatorName) { this.indicatorName = indicatorName; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public BigDecimal getValue() { return value; }
    public void setValue(BigDecimal value) { this.value = value; }
}