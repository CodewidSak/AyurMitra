package com.ayurmitra.modules.wellness.entity;

import com.ayurmitra.modules.user.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "daily_rituals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyRitual {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "scheduled_time")
    private LocalTime scheduledTime;
    
    @Column(name = "is_completed")
    @Builder.Default
    private Boolean isCompleted = false;
    
    @Column(name = "is_skipped")
    @Builder.Default
    private Boolean isSkipped = false;
    
    @Column(name = "completion_date")
    private LocalDateTime completionDate;
    
    @Column(name = "ritual_date")
    private LocalDateTime ritualDate;
    
    @Column(name = "category")
    private String category; // MORNING, AFTERNOON, EVENING, NIGHT
    
    @Column(name = "priority")
    @Builder.Default
    private Integer priority = 1; // 1-5, 1 being highest
    
    @Column(name = "streak_count")
    @Builder.Default
    private Integer streakCount = 0;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (ritualDate == null) {
            ritualDate = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}