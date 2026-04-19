package com.emergingmarkets.dashboard.repository;

import com.emergingmarkets.dashboard.model.Indicator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IndicatorRepository extends JpaRepository<Indicator, Long> {

    // All indicators for a country by its code
    @Query("SELECT i FROM Indicator i JOIN FETCH i.country c WHERE c.code = :countryCode ORDER BY i.indicatorCode, i.year")
    List<Indicator> findByCountryCode(@Param("countryCode") String countryCode);

    // Filter by country code + specific indicator
    @Query("SELECT i FROM Indicator i JOIN FETCH i.country c WHERE c.code = :countryCode AND i.indicatorCode = :indicatorCode ORDER BY i.year")
    List<Indicator> findByCountryCodeAndIndicatorCode(
            @Param("countryCode") String countryCode,
            @Param("indicatorCode") String indicatorCode
    );

    // Check if a specific data point exists (useful for upsert logic)
    boolean existsByCountry_CodeAndIndicatorCodeAndYear(String countryCode, String indicatorCode, Integer year);
}