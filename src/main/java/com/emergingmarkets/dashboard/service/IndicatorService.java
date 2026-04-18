package com.emergingmarkets.dashboard.service;

import com.emergingmarkets.dashboard.model.Indicator;
import com.emergingmarkets.dashboard.repository.IndicatorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
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
}