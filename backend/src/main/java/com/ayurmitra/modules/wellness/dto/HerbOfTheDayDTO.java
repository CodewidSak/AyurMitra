package com.ayurmitra.modules.wellness.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HerbOfTheDayDTO {
    private Long id;
    private String name;
    private String latinName;
    private String description;
    private String benefits;
    private String doshaEffect;
    private String preparationMethod;
    private String dosage;
    private String precautions;
    private String imageUrl;
    private LocalDate featuredDate;
}