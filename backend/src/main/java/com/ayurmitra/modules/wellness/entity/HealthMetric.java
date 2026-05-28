package com.ayurmitra.modules.wellness.entity;

import com.ayurmitra.modules.user.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthMetric {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
    
    @Column(name = "metric_type", nullable = false)
    private String metricType; // VITALITY_SCORE, DOSHA_BALANCE, STRESS_LEVEL, etc.
    
    @Column(name = "metric_value", nullable = false)
    private Double metricValue;
    
    @Column(name = "metric_unit")
    private String metricUnit; // percentage, score, etc.
    
    @Column(name = "vata_percentage")
    private Integer vataPercentage;
    
    @Column(name = "pitta_percentage")
    private Integer pittaPercentage;
    
    @Column(name = "kapha_percentage")
    private Integer kaphaPercentage;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (recordedAt == null) {
            recordedAt = LocalDateTime.now();
        }
    }
}