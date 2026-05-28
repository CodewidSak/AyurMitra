package com.ayurmitra.modules.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AyurvedicResponse {
    private String bodyPart;
    private String symptoms;
    private String remedies;
    private String lifestyleChanges;
    private String dietaryRecommendations;
    private String precautions;
}
