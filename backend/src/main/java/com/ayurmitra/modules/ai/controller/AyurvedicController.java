package com.ayurmitra.modules.ai.controller;

import com.ayurmitra.modules.ai.dto.AyurvedicResponse;
import com.ayurmitra.modules.ai.dto.SymptomRequest;
import com.ayurmitra.modules.ai.entity.ChatHistory;
import com.ayurmitra.modules.ai.service.AyurvedicService;
import com.ayurmitra.security.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ayurvedic")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AyurvedicController {
    
    private final AyurvedicService ayurvedicService;
    private final AuthenticationService authenticationService;
    
    @PostMapping("/remedy")
    public ResponseEntity<AyurvedicResponse> getRemedy(@Valid @RequestBody SymptomRequest request) {
        Long userId = authenticationService.getCurrentUserId();
        AyurvedicResponse response = ayurvedicService.getAyurvedicRemedy(userId, request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/consultation")
    public ResponseEntity<AyurvedicResponse> getConsultation(@Valid @RequestBody SymptomRequest request) {
        Long userId = authenticationService.getCurrentUserId();
        AyurvedicResponse response = ayurvedicService.getAyurvedicRemedy(userId, request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/chat-history")
    public ResponseEntity<List<ChatHistory>> getChatHistory() {
        Long userId = authenticationService.getCurrentUserId();
        List<ChatHistory> history = ayurvedicService.getUserChatHistory(userId);
        return ResponseEntity.ok(history);
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<ChatHistory>> getHistory() {
        Long userId = authenticationService.getCurrentUserId();
        List<ChatHistory> history = ayurvedicService.getUserChatHistory(userId);
        return ResponseEntity.ok(history);
    }
}
