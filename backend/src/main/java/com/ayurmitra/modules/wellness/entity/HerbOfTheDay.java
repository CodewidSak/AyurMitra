package com.ayurmitra.modules.wellness.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "herb_of_the_day")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HerbOfTheDay {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "latin_name")
    private String latinName;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String benefits;
    
    @Column(name = "dosha_effect")
    private String doshaEffect; // Vata pacifying, Pitta balancing, etc.
    
    @Column(name = "featured_date")
    private LocalDate featuredDate;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "preparation_method", columnDefinition = "TEXT")
    private String preparationMethod;
    
    @Column(name = "dosage")
    private String dosage;
    
    @Column(name = "precautions", columnDefinition = "TEXT")
    private String precautions;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (featuredDate == null) {
            featuredDate = LocalDate.now();
        }
    }
}