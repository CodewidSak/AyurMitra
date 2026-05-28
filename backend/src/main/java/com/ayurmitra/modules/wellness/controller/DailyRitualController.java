package com.ayurmitra.modules.wellness.controller;

import com.ayurmitra.modules.wellness.dto.DailyRitualDTO;
import com.ayurmitra.modules.wellness.service.DailyRitualService;
import com.ayurmitra.security.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rituals")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DailyRitualController {
    
    private final DailyRitualService dailyRitualService;
    private final AuthenticationService authenticationService;
    
    @GetMapping("/today")
    public ResponseEntity<List<DailyRitualDTO>> getTodayRituals() {
        Long userId = authenticationService.getCurrentUserId();
        List<DailyRitualDTO> rituals = dailyRitualService.getTodayRituals(userId);
        return ResponseEntity.ok(rituals);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<DailyRitualDTO>> getAllRituals() {
        Long userId = authenticationService.getCurrentUserId();
        List<DailyRitualDTO> rituals = dailyRitualService.getAllUserRituals(userId);
        return ResponseEntity.ok(rituals);
    }
    
    @PostMapping("/{ritualId}/complete")
    public ResponseEntity<DailyRitualDTO> completeRitual(@PathVariable Long ritualId) {
        Long userId = authenticationService.getCurrentUserId();
        DailyRitualDTO ritual = dailyRitualService.completeRitual(ritualId, userId);
        return ResponseEntity.ok(ritual);
    }
    
    @PostMapping("/{ritualId}/skip")
    public ResponseEntity<DailyRitualDTO> skipRitual(@PathVariable Long ritualId) {
        Long userId = authenticationService.getCurrentUserId();
        DailyRitualDTO ritual = dailyRitualService.skipRitual(ritualId, userId);
        return ResponseEntity.ok(ritual);
    }
    
    @PostMapping
    public ResponseEntity<DailyRitualDTO> createRitual(@RequestBody DailyRitualDTO ritualDTO) {
        Long userId = authenticationService.getCurrentUserId();
        DailyRitualDTO ritual = dailyRitualService.createRitual(ritualDTO, userId);
        return ResponseEntity.ok(ritual);
    }
    
    @DeleteMapping("/{ritualId}")
    public ResponseEntity<Void> deleteRitual(@PathVariable Long ritualId) {
        Long userId = authenticationService.getCurrentUserId();
        dailyRitualService.deleteRitual(ritualId, userId);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/initialize")
    public ResponseEntity<Void> initializeDefaultRituals() {
        Long userId = authenticationService.getCurrentUserId();
        dailyRitualService.initializeDefaultRituals(userId);
        return ResponseEntity.ok().build();
    }
}