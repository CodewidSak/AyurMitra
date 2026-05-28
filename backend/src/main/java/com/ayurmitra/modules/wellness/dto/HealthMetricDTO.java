package com.ayurmitra.modules.wellness.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthMetricDTO {
    private Long id;
    private String metricType;
    private Double metricValue;
    private String metricUnit;
    private Integer vataPercentage;
    private Integer pittaPercentage;
    private Integer kaphaPercentage;
    private String notes;
    private LocalDateTime recordedAt;
    private LocalDateTime createdAt;
}