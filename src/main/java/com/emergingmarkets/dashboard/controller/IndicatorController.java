package com.emergingmarkets.dashboard.controller;

import com.emergingmarkets.dashboard.dto.CountryIndicators;
import com.emergingmarkets.dashboard.model.Indicator;
import com.emergingmarkets.dashboard.service.IndicatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/indicators")
public class IndicatorController {

    private final IndicatorService indicatorService;

    public IndicatorController(IndicatorService indicatorService) {
        this.indicatorService = indicatorService;
    }

    // Original raw endpoint — keep for debugging
    @GetMapping("/{countryCode}/raw")
    public ResponseEntity<List<Indicator>> getByCountry(
            @PathVariable String countryCode) {
        List<Indicator> indicators = indicatorService.getIndicatorsByCountry(countryCode);
        if (indicators.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(indicators);
    }

    // New shaped endpoint — frontend uses this
    @GetMapping("/{countryCode}")
    public ResponseEntity<CountryIndicators> getShapedByCountry(
            @PathVariable String countryCode) {
        return ResponseEntity.ok(indicatorService.getShapedResponse(countryCode));
    }

    // Filter by indicator code
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
}