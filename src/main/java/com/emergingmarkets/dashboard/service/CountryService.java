package com.emergingmarkets.dashboard.service;

import com.emergingmarkets.dashboard.model.Country;
import com.emergingmarkets.dashboard.repository.CountryRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CountryService {

    private final CountryRepository countryRepository;

    public CountryService(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    public List<Country> getAllCountries() {
        return countryRepository.findAll();
    }
}