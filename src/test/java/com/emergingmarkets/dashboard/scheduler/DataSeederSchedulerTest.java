package com.emergingmarkets.dashboard.scheduler;

import com.emergingmarkets.dashboard.service.WorldBankService;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

class DataSeederSchedulerTest {

    @Test
    void shouldSeedOnStartup() {
        WorldBankService worldBankService = mock(WorldBankService.class);
        DataSeederScheduler scheduler = new DataSeederScheduler(worldBankService);

        scheduler.seedOnStartup();

        verify(worldBankService, times(1)).seedAllData();
    }

    @Test
    void shouldRunWeeklyRefresh() {
        WorldBankService worldBankService = mock(WorldBankService.class);
        DataSeederScheduler scheduler = new DataSeederScheduler(worldBankService);

        scheduler.weeklyRefresh();

        verify(worldBankService, times(1)).seedAllData();
    }
}