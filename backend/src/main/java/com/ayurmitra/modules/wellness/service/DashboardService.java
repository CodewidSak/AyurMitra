package com.ayurmitra.modules.wellness.service;

import com.ayurmitra.modules.wellness.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final DailyRitualService dailyRitualService;
    private final HealthMetricService healthMetricService;
    private final HerbOfTheDayService herbOfTheDayService;
    
    public DashboardStatsDTO getDashboardStats(Long userId) {
        // Get vitality score
        Double vitalityScore = healthMetricService.getLatestVitalityScore(userId)
                .map(HealthMetricDTO::getMetricValue)
                .orElse(84.0); // Default value
        
        // Get dosha balance
        DashboardStatsDTO.DoshaBalanceDTO doshaBalance = healthMetricService.getLatestDoshaBalance(userId)
                .map(metric -> {
                    String dominantDosha = determineDominantDosha(
                        metric.getVataPercentage(), 
                        metric.getPittaPercentage(), 
                        metric.getKaphaPercentage()
                    );
                    return DashboardStatsDTO.DoshaBalanceDTO.builder()
                            .vataPercentage(metric.getVataPercentage())
                            .pittaPercentage(metric.getPittaPercentage())
                            .kaphaPercentage(metric.getKaphaPercentage())
                            .dominantDosha(dominantDosha)
                            .build();
                })
                .orElse(DashboardStatsDTO.DoshaBalanceDTO.builder()
                        .vataPercentage(25)
                        .pittaPercentage(60)
                        .kaphaPercentage(15)
                        .dominantDosha("PITTA")
                        .build());
        
        // Get ritual stats
        Long completedToday = dailyRitualService.getCompletedTodayCount(userId);
        Long totalToday = dailyRitualService.getTotalTodayCount(userId);
        Double completionPercentage = totalToday > 0 ? (completedToday.doubleValue() / totalToday.doubleValue()) * 100 : 0.0;
        
        DashboardStatsDTO.RitualStatsDTO ritualStats = DashboardStatsDTO.RitualStatsDTO.builder()
                .completedToday(completedToday)
                .totalToday(totalToday)
                .completionPercentage(completionPercentage)
                .currentStreak(calculateCurrentStreak(userId))
                .build();
        
        // Get today's rituals
        List<DailyRitualDTO> todayRituals = dailyRitualService.getTodayRituals(userId);
        
        // Get herb of the day
        HerbOfTheDayDTO herbOfTheDay = herbOfTheDayService.getTodayHerb()
                .orElse(getDefaultHerb());
        
        // Generate personalized messages
        String personalizedMessage = generatePersonalizedMessage(doshaBalance.getDominantDosha(), vitalityScore);
        String seasonalAdvice = generateSeasonalAdvice();
        
        return DashboardStatsDTO.builder()
                .vitalityScore(vitalityScore)
                .doshaBalance(doshaBalance)
                .ritualStats(ritualStats)
                .herbOfTheDay(herbOfTheDay)
                .todayRituals(todayRituals)
                .personalizedMessage(personalizedMessage)
                .seasonalAdvice(seasonalAdvice)
                .build();
    }
    
    private String determineDominantDosha(Integer vata, Integer pitta, Integer kapha) {
        if (pitta >= vata && pitta >= kapha) return "PITTA";
        if (vata >= kapha) return "VATA";
        return "KAPHA";
    }
    
    private Integer calculateCurrentStreak(Long userId) {
        // This is a simplified calculation - in a real app, you'd track daily completion streaks
        Long completedToday = dailyRitualService.getCompletedTodayCount(userId);
        return completedToday.intValue(); // Simplified for now
    }
    
    private String generatePersonalizedMessage(String dominantDosha, Double vitalityScore) {
        String baseMessage = "Your balance is our focus.";
        
        if (vitalityScore >= 80) {
            baseMessage = "Excellent alignment. Your circadian rhythm is stabilizing.";
        } else if (vitalityScore >= 60) {
            baseMessage = "Good progress. Continue with your current practices.";
        } else {
            baseMessage = "Let's work together to restore your natural balance.";
        }
        
        return baseMessage;
    }
    
    private String generateSeasonalAdvice() {
        LocalDate now = LocalDate.now();
        String season = getSeason(now);
        String month = now.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
        
        switch (season) {
            case "Spring":
                return "The transition into spring requires a cooling of the Pitta fire. Today's regimen is designed for clarity.";
            case "Summer":
                return "Summer's heat can aggravate Pitta. Focus on cooling foods and practices to maintain balance.";
            case "Autumn":
                return "Autumn's dryness can increase Vata. Emphasize grounding and nourishing practices.";
            case "Winter":
                return "Winter's cold can increase Kapha. Incorporate warming spices and energizing practices.";
            default:
                return "Since your Pitta is elevated this week, we recommend avoiding fermented foods and nightshades. Opt for sweet, cooling fruits like pomegranate or pears to soothe the digestive fire.";
        }
    }
    
    private String getSeason(LocalDate date) {
        int month = date.getMonthValue();
        if (month >= 3 && month <= 5) return "Spring";
        if (month >= 6 && month <= 8) return "Summer";
        if (month >= 9 && month <= 11) return "Autumn";
        return "Winter";
    }
    
    private HerbOfTheDayDTO getDefaultHerb() {
        return HerbOfTheDayDTO.builder()
                .id(1L)
                .name("Brahmi")
                .latinName("Bacopa monnieri")
                .description("The herb of grace. Renowned for enhancing cognitive function and calming the nervous system.")
                .benefits("Improves memory, reduces anxiety, supports brain health")
                .doshaEffect("Balances Vata and Pitta")
                .preparationMethod("Fresh juice, powder, or capsules")
                .dosage("Take 1-2 capsules daily with warm water")
                .precautions("Avoid during pregnancy")
                .featuredDate(LocalDate.now())
                .build();
    }
}