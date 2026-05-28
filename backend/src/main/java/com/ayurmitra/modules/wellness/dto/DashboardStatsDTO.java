package com.ayurmitra.modules.wellness.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private Double vitalityScore;
    private DoshaBalanceDTO doshaBalance;
    private RitualStatsDTO ritualStats;
    private HerbOfTheDayDTO herbOfTheDay;
    private List<DailyRitualDTO> todayRituals;
    private String personalizedMessage;
    private String seasonalAdvice;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DoshaBalanceDTO {
        private Integer vataPercentage;
        private Integer pittaPercentage;
        private Integer kaphaPercentage;
        private String dominantDosha;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RitualStatsDTO {
        private Long completedToday;
        private Long totalToday;
        private Double completionPercentage;
        private Integer currentStreak;
    }
}