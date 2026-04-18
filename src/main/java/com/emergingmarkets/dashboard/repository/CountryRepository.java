package com.emergingmarkets.dashboard.repository;

import com.emergingmarkets.dashboard.model.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CountryRepository extends JpaRepository<Country, Long> {
    Optional<Country> findByCode(String code);
}