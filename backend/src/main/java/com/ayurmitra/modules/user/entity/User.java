package com.ayurmitra.modules.user.entity;

import com.ayurmitra.modules.ai.entity.ChatHistory;
import com.ayurmitra.modules.medical.entity.MedicalCondition;
import com.ayurmitra.modules.wellness.entity.DailyRitual;
import com.ayurmitra.modules.wellness.entity.HealthMetric;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    @Column(name = "height_cm")
    private Double heightCm;
    
    @Column(name = "weight_kg")
    private Double weightKg;
    
    @Column(name = "age")
    private Integer age;
    
    @Column(name = "gender")
    private String gender;
    
    @Column(name = "bmi")
    private Double bmi;
    
    @Column(name = "prakriti")
    private String prakriti; // Vata, Pitta, Kapha
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MedicalCondition> medicalConditions;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatHistory> chatHistories;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DailyRitual> dailyRituals;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HealthMetric> healthMetrics;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public void calculateBMI() {
        if (heightCm != null && weightKg != null && heightCm > 0) {
            double heightM = heightCm / 100.0;
            this.bmi = weightKg / (heightM * heightM);
        }
    }
    
    public void calculatePrakriti() {
        // Simplified Prakriti calculation based on age and BMI
        if (bmi != null && age != null) {
            if (bmi < 18.5) {
                this.prakriti = "Vata";
            } else if (bmi < 25) {
                this.prakriti = "Pitta";
            } else {
                this.prakriti = "Kapha";
            }
        }
    }
}
