package com.ayurmitra.modules.wellness.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyRitualDTO {
    private Long id;
    private String name;
    private String description;
    private LocalTime scheduledTime;
    private Boolean isCompleted;
    private Boolean isSkipped;
    private LocalDateTime completionDate;
    private LocalDateTime ritualDate;
    private String category;
    private Integer priority;
    private Integer streakCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}