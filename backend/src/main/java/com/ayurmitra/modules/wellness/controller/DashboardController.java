package com.ayurmitra.modules.wellness.controller;

import com.ayurmitra.modules.wellness.dto.DashboardStatsDTO;
import com.ayurmitra.modules.wellness.service.DashboardService;
import com.ayurmitra.security.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {
    
    private final DashboardService dashboardService;
    private final AuthenticationService authenticationService;
    
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        Long userId = authenticationService.getCurrentUserId();
        DashboardStatsDTO stats = dashboardService.getDashboardStats(userId);
        return ResponseEntity.ok(stats);
    }
}