package com.ayurmitra.modules.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StructuredAyurvedicResponse {
    
    private String bodyPart;
    private String symptoms;
    private String primaryDosha;
    private String constitution;
    private List<HerbRecommendation> herbs;
    private List<String> dietaryRecommendations;
    private List<String> lifestyleChanges;
    private List<YogaPose> yogaPoses;
    private List<String> precautions;
    private DinacharayaRecommendation dinacharya;
    private String severity;
    private String consultationAdvice;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HerbRecommendation {
        private String name;
        private String sanskritName;
        private String scientificName;
        private String dosage;
        private String benefits;
        private String preparation;
        private String precautions;
        private List<String> affectedDoshas;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class YogaPose {
        private String name;
        private String sanskritName;
        private String description;
        private String duration;
        private String benefits;
        private String difficulty;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DinacharayaRecommendation {
        private String wakeUpTime;
        private String bedTime;
        private List<String> morningRoutine;
        private List<String> eveningRoutine;
        private String mealTiming;
        private String exerciseTime;
    }
}