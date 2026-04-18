package com.emergingmarkets.dashboard.service;

import com.emergingmarkets.dashboard.dto.WorldBankDataPoint;
import com.emergingmarkets.dashboard.model.Country;
import com.emergingmarkets.dashboard.model.Indicator;
import com.emergingmarkets.dashboard.repository.CountryRepository;
import com.emergingmarkets.dashboard.repository.IndicatorRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class WorldBankService {
    private static final Logger log = LoggerFactory.getLogger(WorldBankService.class);

    // Countries to seed
    private static final List<String> TARGET_COUNTRIES = List.of("NG", "KE", "GH", "ZA", "ET");

    // Indicators to fetch
    private static final List<String> TARGET_INDICATORS = List.of(
            "NY.GDP.MKTP.CD",   // GDP
            "FP.CPI.TOTL.ZG",  // Inflation
            "SP.POP.TOTL"       // Population
    );

    private final WebClient webClient;
    private final CountryRepository countryRepository;
    private final IndicatorRepository indicatorRepository;
    private final ObjectMapper objectMapper;

    public WorldBankService(WebClient worldBankWebClient,
                            CountryRepository countryRepository,
                            IndicatorRepository indicatorRepository,
                            ObjectMapper objectMapper) {
        this.webClient = worldBankWebClient;
        this.countryRepository = countryRepository;
        this.indicatorRepository = indicatorRepository;
        this.objectMapper = objectMapper;
    }

/**
 * Main entry point — seeds all countries and indicators.
 * Called by the scheduler on startup.


 */
public void seedAllData() {
    for (String countryCode : TARGET_COUNTRIES) {
        Optional<Country> countryOpt = countryRepository.findByCode(countryCode);
        if (countryOpt.isEmpty()) {
            log.warn("Country not found in DB: {}. Skipping.", countryCode);
            continue;
        }
        Country country = countryOpt.get();

        for (String indicatorCode : TARGET_INDICATORS) {
            try {
                log.info("Fetching {} for {}", indicatorCode, countryCode);
                List<WorldBankDataPoint> dataPoints = fetchIndicator(countryCode, indicatorCode);
                saveDataPoints(country, indicatorCode, dataPoints);
            } catch (Exception e) {
                log.error("Failed to fetch {} for {}: {}", indicatorCode, countryCode, e.getMessage());
            }
        }
    }
    log.info("World Bank data seeding complete.");
}

    /**
     * Fetches all pages for a given country + indicator from the World Bank API.
     */
    private List<WorldBankDataPoint> fetchIndicator(String countryCode, String indicatorCode) {
        List<WorldBankDataPoint> allPoints = new ArrayList<>();
        int page = 1;
        int totalPages;
        do {
            int currentPage = page; // final copy for lambda
            String responseBody = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/country/{code}/indicator/{indicator}")
                            .queryParam("format", "json")
                            .queryParam("per_page", "50")
                            .queryParam("page", currentPage)
                            .queryParam("mrv", "20")  // most recent 20 years
                            .build(countryCode, indicatorCode))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = parseJson(responseBody);
            JsonNode meta = root.get(0);
            JsonNode data = root.get(1);

            totalPages = meta.path("pages").asInt(1);

            if (data != null && data.isArray()) {
                for (JsonNode node : data) {
                    WorldBankDataPoint point = objectMapper.convertValue(node, WorldBankDataPoint.class);
                    if (point.getValue() != null) { // skip nulls (missing data years)
                        allPoints.add(point);
                    }
                }
            }
            page++;
        } while (page <= totalPages);

        return allPoints;
    }

    /**
     * Saves data points to the DB, skipping duplicates.
     */
    private void saveDataPoints(Country country, String indicatorCode,
                                List<WorldBankDataPoint> dataPoints) {
        int saved = 0;
        int skipped = 0;

        for (WorldBankDataPoint point : dataPoints) {
            Integer year;
            try {
                year = Integer.parseInt(point.getYear());
            } catch (NumberFormatException e) {
                skipped++;
                continue;
            }

            // Skip if already in DB (idempotent)
            if (indicatorRepository.existsByCountry_CodeAndIndicatorCodeAndYear(
                    country.getCode(), indicatorCode, year)) {
                skipped++;
                continue;
            }

            String indicatorName = point.getIndicator() != null
                    ? point.getIndicator().getName()
                    : indicatorCode;

            Indicator indicator = new Indicator(
                    country,
                    indicatorCode,
                    indicatorName,
                    year,
                    BigDecimal.valueOf(point.getValue())
            );
            indicatorRepository.save(indicator);
            saved++;
        }

        log.info("{} | {} → saved: {}, skipped: {}", country.getCode(), indicatorCode, saved, skipped);
    }

    private JsonNode parseJson(String body) {
        try {
            return objectMapper.readTree(body);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse World Bank response", e);
        }
    }
}