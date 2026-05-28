package com.ayurmitra.config;

import com.ayurmitra.modules.wellness.service.HerbOfTheDayService;
import com.ayurmitra.modules.wellness.service.HealthMetricService;
import com.ayurmitra.modules.wellness.service.DailyRitualService;
import com.ayurmitra.modules.user.entity.User;
import com.ayurmitra.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final HerbOfTheDayService herbOfTheDayService;
    private final HealthMetricService healthMetricService;
    private final DailyRitualService dailyRitualService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        log.info("Initializing application data...");
        
        // Initialize herbs data
        herbOfTheDayService.initializeDefaultHerbs();
        log.info("Herbs data initialized");
        
        // Create a default user for testing if none exists
        if (userRepository.count() == 0) {
            User defaultUser = User.builder()
                    .username("testuser")
                    .email("test@ayurmitra.com")
                    .firstName("Test")
                    .lastName("User")
                    .password(passwordEncoder.encode("password123"))
                    .build();
            
            User savedUser = userRepository.save(defaultUser);
            log.info("Default user created with ID: {}", savedUser.getId());
            
            // Initialize default health metrics and rituals for the test user
            healthMetricService.initializeDefaultMetrics(savedUser.getId());
            dailyRitualService.initializeDefaultRituals(savedUser.getId());
            log.info("Default health metrics and rituals initialized for test user");
        }
        
        log.info("Application data initialization completed");
    }
}