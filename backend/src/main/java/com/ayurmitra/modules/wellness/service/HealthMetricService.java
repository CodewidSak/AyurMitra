package com.ayurmitra.modules.wellness.service;

import com.ayurmitra.modules.wellness.dto.HealthMetricDTO;
import com.ayurmitra.modules.wellness.entity.HealthMetric;
import com.ayurmitra.modules.wellness.repository.HealthMetricRepository;
import com.ayurmitra.modules.user.entity.User;
import com.ayurmitra.modules.user.repository.UserRepository;
import com.ayurmitra.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HealthMetricService {
    
    private final HealthMetricRepository healthMetricRepository;
    private final UserRepository userRepository;
    
    public Optional<HealthMetricDTO> getLatestVitalityScore(Long userId) {
        Pageable pageable = PageRequest.of(0, 1);
        List<HealthMetric> metrics = healthMetricRepository.findLatestByUserIdAndMetricType(userId, "VITALITY_SCORE", pageable);
        return metrics.isEmpty() ? Optional.empty() : Optional.of(convertToDTO(metrics.get(0)));
    }
    
    public Optional<HealthMetricDTO> getLatestDoshaBalance(Long userId) {
        Pageable pageable = PageRequest.of(0, 1);
        List<HealthMetric> metrics = healthMetricRepository.findLatestByUserIdAndMetricType(userId, "DOSHA_BALANCE", pageable);
        return metrics.isEmpty() ? Optional.empty() : Optional.of(convertToDTO(metrics.get(0)));
    }
    
    public List<HealthMetricDTO> getUserMetrics(Long userId, String metricType) {
        List<HealthMetric> metrics = healthMetricRepository.findByUserIdAndMetricTypeOrderByRecordedAtDesc(userId, metricType);
        return metrics.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public HealthMetricDTO recordVitalityScore(Long userId, Double score, String notes) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        HealthMetric metric = HealthMetric.builder()
                .user(user)
                .metricType("VITALITY_SCORE")
                .metricValue(score)
                .metricUnit("percentage")
                .notes(notes)
                .recordedAt(LocalDateTime.now())
                .build();
        
        HealthMetric saved = healthMetricRepository.save(metric);
        return convertToDTO(saved);
    }
    
    @Transactional
    public HealthMetricDTO recordDoshaBalance(Long userId, Integer vata, Integer pitta, Integer kapha, String notes) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Determine dominant dosha
        String dominantDosha = "VATA";
        Double maxPercentage = vata.doubleValue();
        
        if (pitta > maxPercentage) {
            dominantDosha = "PITTA";
            maxPercentage = pitta.doubleValue();
        }
        if (kapha > maxPercentage) {
            dominantDosha = "KAPHA";
        }
        
        HealthMetric metric = HealthMetric.builder()
                .user(user)
                .metricType("DOSHA_BALANCE")
                .metricValue(maxPercentage)
                .metricUnit("percentage")
                .vataPercentage(vata)
                .pittaPercentage(pitta)
                .kaphaPercentage(kapha)
                .notes(notes + " | Dominant: " + dominantDosha)
                .recordedAt(LocalDateTime.now())
                .build();
        
        HealthMetric saved = healthMetricRepository.save(metric);
        return convertToDTO(saved);
    }
    
    private HealthMetricDTO convertToDTO(HealthMetric metric) {
        return HealthMetricDTO.builder()
                .id(metric.getId())
                .metricType(metric.getMetricType())
                .metricValue(metric.getMetricValue())
                .metricUnit(metric.getMetricUnit())
                .vataPercentage(metric.getVataPercentage())
                .pittaPercentage(metric.getPittaPercentage())
                .kaphaPercentage(metric.getKaphaPercentage())
                .notes(metric.getNotes())
                .recordedAt(metric.getRecordedAt())
                .createdAt(metric.getCreatedAt())
                .build();
    }
    
    // Initialize default health metrics for new users
    @Transactional
    public void initializeDefaultMetrics(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Create initial vitality score
        HealthMetric vitalityScore = HealthMetric.builder()
                .user(user)
                .metricType("VITALITY_SCORE")
                .metricValue(84.0)
                .metricUnit("percentage")
                .notes("Initial assessment based on registration questionnaire")
                .recordedAt(LocalDateTime.now())
                .build();
        
        // Create initial dosha balance
        HealthMetric doshaBalance = HealthMetric.builder()
                .user(user)
                .metricType("DOSHA_BALANCE")
                .metricValue(60.0)
                .metricUnit("percentage")
                .vataPercentage(25)
                .pittaPercentage(60)
                .kaphaPercentage(15)
                .notes("Initial constitution assessment | Dominant: PITTA")
                .recordedAt(LocalDateTime.now())
                .build();
        
        healthMetricRepository.saveAll(List.of(vitalityScore, doshaBalance));
    }
}