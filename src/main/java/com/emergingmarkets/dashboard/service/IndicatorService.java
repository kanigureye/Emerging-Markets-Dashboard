package com.emergingmarkets.dashboard.service;
import com.emergingmarkets.dashboard.dto.CountryIndicators;
import com.emergingmarkets.dashboard.dto.DataPoint;
import com.emergingmarkets.dashboard.dto.IndicatorSeries;
import com.emergingmarkets.dashboard.model.Indicator;
import com.emergingmarkets.dashboard.repository.IndicatorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class IndicatorService {

    private final IndicatorRepository indicatorRepository;

    public IndicatorService(IndicatorRepository indicatorRepository) {
        this.indicatorRepository = indicatorRepository;
    }

    public List<Indicator> getIndicatorsByCountry(String countryCode) {
        return indicatorRepository.findByCountryCode(countryCode.toUpperCase());
    }
    public List<Indicator> getIndicatorsByCountryAndCode(String countryCode, String indicatorCode) {
        return indicatorRepository.findByCountryCodeAndIndicatorCode(
                countryCode.toUpperCase(),
                indicatorCode
        );
    }

    // New — shaped response for frontend
    public CountryIndicators getShapedResponse(String countryCode) {
        List<Indicator> indicators = indicatorRepository
                .findByCountryCode(countryCode.toUpperCase());

        if (indicators.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No data found for country: " + countryCode);
        }

        // Grab country info from first result
        String countryName = indicators.get(0).getCountry().getName();
        String code = indicators.get(0).getCountry().getCode();
        String region = indicators.get(0).getCountry().getRegion();

        // Group by indicator code, map each group to a series
        Map<String, IndicatorSeries> indicatorMap = indicators.stream()
                .collect(Collectors.groupingBy(
                        Indicator::getIndicatorCode,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> new IndicatorSeries(
                                        list.get(0).getIndicatorName(),
                                        list.stream()
                                                .map(i -> new DataPoint(
                                                        i.getYear(),
                                                        i.getValue() != null
                                                                ? i.getValue().doubleValue()
                                                                : null))
                                                .collect(Collectors.toList())
                                )
                        )
                ));

        return new CountryIndicators(countryName, code, region, indicatorMap);
    }
}