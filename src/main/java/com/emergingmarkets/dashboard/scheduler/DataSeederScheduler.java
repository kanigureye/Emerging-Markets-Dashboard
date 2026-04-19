package com.emergingmarkets.dashboard.scheduler;

import com.emergingmarkets.dashboard.service.WorldBankService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DataSeederScheduler {

    private static final Logger log = LoggerFactory.getLogger(DataSeederScheduler.class);
    private final WorldBankService worldBankService;

    public DataSeederScheduler(WorldBankService worldBankService) {
        this.worldBankService = worldBankService;
    }

    /**
     * Kjører kun en gang når appen kjøres,
     * setter inn initiell data kun dersom DB er tom, hopper over eksisterende rader
     */
    @EventListener(ApplicationReadyEvent.class)
    public void seedOnStartup() {
        log.info("App ready — starting initial World Bank data seed...");
        worldBankService.seedAllData();
    }
    /**
     * Oppdaterer dataen hver søndag 02:00 på morgenen.
     * Idempotent — setter kun inn nye år som ikke allerede eksisterer i databasen.
     */
    @Scheduled(cron = "0 0 2 * * SUN")
    public void weeklyRefresh() {
        log.info("Ukentlig oppdatering — henter siste data fra World Bank...");
        worldBankService.seedAllData();
    }
}