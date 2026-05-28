package com.ayurmitra.modules.wellness.service;

import com.ayurmitra.modules.wellness.dto.DailyRitualDTO;
import com.ayurmitra.modules.wellness.entity.DailyRitual;
import com.ayurmitra.modules.wellness.repository.DailyRitualRepository;
import com.ayurmitra.modules.user.entity.User;
import com.ayurmitra.modules.user.repository.UserRepository;
import com.ayurmitra.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DailyRitualService {
    
    private final DailyRitualRepository dailyRitualRepository;
    private final UserRepository userRepository;
    
    public List<DailyRitualDTO> getTodayRituals(Long userId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        List<DailyRitual> rituals = dailyRitualRepository.findTodayRitualsByUserId(userId, startOfDay, endOfDay);
        return rituals.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<DailyRitualDTO> getAllUserRituals(Long userId) {
        List<DailyRitual> rituals = dailyRitualRepository.findByUserIdOrderByPriorityAscScheduledTimeAsc(userId);
        return rituals.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public DailyRitualDTO completeRitual(Long ritualId, Long userId) {
        DailyRitual ritual = dailyRitualRepository.findById(ritualId)
                .orElseThrow(() -> new ResourceNotFoundException("Ritual not found"));
        
        if (!ritual.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Ritual not found for user");
        }
        
        ritual.setIsCompleted(true);
        ritual.setIsSkipped(false);
        ritual.setCompletionDate(LocalDateTime.now());
        ritual.setStreakCount(ritual.getStreakCount() + 1);
        
        DailyRitual saved = dailyRitualRepository.save(ritual);
        return convertToDTO(saved);
    }
    
    @Transactional
    public DailyRitualDTO skipRitual(Long ritualId, Long userId) {
        DailyRitual ritual = dailyRitualRepository.findById(ritualId)
                .orElseThrow(() -> new ResourceNotFoundException("Ritual not found"));
        
        if (!ritual.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Ritual not found for user");
        }
        
        ritual.setIsSkipped(true);
        ritual.setIsCompleted(false);
        ritual.setStreakCount(0); // Reset streak on skip
        
        DailyRitual saved = dailyRitualRepository.save(ritual);
        return convertToDTO(saved);
    }
    
    @Transactional
    public DailyRitualDTO createRitual(DailyRitualDTO ritualDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        DailyRitual ritual = DailyRitual.builder()
                .user(user)
                .name(ritualDTO.getName())
                .description(ritualDTO.getDescription())
                .scheduledTime(ritualDTO.getScheduledTime())
                .category(ritualDTO.getCategory())
                .priority(ritualDTO.getPriority() != null ? ritualDTO.getPriority() : 1)
                .isCompleted(false)
                .isSkipped(false)
                .streakCount(0)
                .ritualDate(LocalDateTime.now())
                .build();
        
        DailyRitual saved = dailyRitualRepository.save(ritual);
        return convertToDTO(saved);
    }
    
    @Transactional
    public void deleteRitual(Long ritualId, Long userId) {
        DailyRitual ritual = dailyRitualRepository.findById(ritualId)
                .orElseThrow(() -> new ResourceNotFoundException("Ritual not found"));
        
        if (!ritual.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Ritual not found for user");
        }
        
        dailyRitualRepository.delete(ritual);
    }
    
    public Long getCompletedTodayCount(Long userId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return dailyRitualRepository.countCompletedTodayByUserId(userId, startOfDay, endOfDay);
    }
    
    public Long getTotalTodayCount(Long userId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return dailyRitualRepository.countTotalTodayByUserId(userId, startOfDay, endOfDay);
    }
    
    private DailyRitualDTO convertToDTO(DailyRitual ritual) {
        return DailyRitualDTO.builder()
                .id(ritual.getId())
                .name(ritual.getName())
                .description(ritual.getDescription())
                .scheduledTime(ritual.getScheduledTime())
                .isCompleted(ritual.getIsCompleted())
                .isSkipped(ritual.getIsSkipped())
                .completionDate(ritual.getCompletionDate())
                .ritualDate(ritual.getRitualDate())
                .category(ritual.getCategory())
                .priority(ritual.getPriority())
                .streakCount(ritual.getStreakCount())
                .createdAt(ritual.getCreatedAt())
                .updatedAt(ritual.getUpdatedAt())
                .build();
    }
    
    // Initialize default rituals for new users
    @Transactional
    public void initializeDefaultRituals(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<DailyRitual> defaultRituals = List.of(
            DailyRitual.builder()
                .user(user)
                .name("Ushapan (Copper Water)")
                .description("Drink first thing on an empty stomach")
                .scheduledTime(LocalTime.of(6, 15))
                .category("MORNING")
                .priority(1)
                .isCompleted(false)
                .isSkipped(false)
                .streakCount(0)
                .ritualDate(LocalDateTime.now())
                .build(),
            DailyRitual.builder()
                .user(user)
                .name("Jivha Nirlekhana")
                .description("Gentle tongue scraping for detoxification")
                .scheduledTime(LocalTime.of(6, 25))
                .category("MORNING")
                .priority(2)
                .isCompleted(false)
                .isSkipped(false)
                .streakCount(0)
                .ritualDate(LocalDateTime.now())
                .build(),
            DailyRitual.builder()
                .user(user)
                .name("15-min Surya Namaskar")
                .description("Sun salutation for energy and flexibility")
                .scheduledTime(LocalTime.of(7, 0))
                .category("MORNING")
                .priority(3)
                .isCompleted(false)
                .isSkipped(false)
                .streakCount(0)
                .ritualDate(LocalDateTime.now())
                .build(),
            DailyRitual.builder()
                .user(user)
                .name("Nasya Drops")
                .description("Two drops of medicated oil in each nostril")
                .scheduledTime(LocalTime.of(21, 0))
                .category("EVENING")
                .priority(4)
                .isCompleted(false)
                .isSkipped(false)
                .streakCount(0)
                .ritualDate(LocalDateTime.now())
                .build()
        );
        
        dailyRitualRepository.saveAll(defaultRituals);
    }
}