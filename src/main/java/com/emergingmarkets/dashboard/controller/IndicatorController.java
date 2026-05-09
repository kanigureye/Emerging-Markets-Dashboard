package com.emergingmarkets.dashboard.controller;

import com.emergingmarkets.dashboard.dto.CountryIndicators;
import com.emergingmarkets.dashboard.model.Indicator;
import com.emergingmarkets.dashboard.service.IndicatorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/indicators")
@Tag(name = "Indicators", description = "Economic indicators — GDP, inflation, population")
public class IndicatorController {

    private final IndicatorService indicatorService;

    public IndicatorController(IndicatorService indicatorService) {
        this.indicatorService = indicatorService;
    }

    @Operation(summary = "Get raw indicators", description = "Returns raw unshaped indicator data for a country. Useful for debugging.")
    @GetMapping("/{countryCode}/raw")
    public ResponseEntity<List<Indicator>> getByCountry(
            @PathVariable String countryCode) {
        List<Indicator> indicators = indicatorService.getIndicatorsByCountry(countryCode);
        if (indicators.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(indicators);
    }

    @Operation(summary = "Get shaped indicators", description = "Returns GDP, inflation and population data shaped for the frontend")
    @GetMapping("/{countryCode}")
    public ResponseEntity<CountryIndicators> getShapedByCountry(
            @PathVariable String countryCode) {
        return ResponseEntity.ok(indicatorService.getShapedResponse(countryCode));
    }

    @Operation(summary = "Filter by indicator code", description = "Returns data for a specific indicator e.g. NY.GDP.MKTP.CD")
    @GetMapping("/{countryCode}/filter")
    public ResponseEntity<List<Indicator>> getByCountryAndCode(
            @PathVariable String countryCode,
            @RequestParam String indicatorCode) {
        List<Indicator> indicators = indicatorService
                .getIndicatorsByCountryAndCode(countryCode, indicatorCode);
        if (indicators.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(indicators);
    }

    @Operation(summary = "Compare two countries", description = "Returns indicators for multiple countries side by side e.g. ?countries=NG,IN")
    @GetMapping("/compare")
    public ResponseEntity<List<CountryIndicators>> compareCountries(
            @RequestParam List<String> countries) {
        List<CountryIndicators> result = countries.stream()
                .map(code -> indicatorService.getShapedResponse(code.toUpperCase()))
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(result);
    }
}