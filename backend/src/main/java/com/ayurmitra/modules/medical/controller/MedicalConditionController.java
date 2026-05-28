package com.ayurmitra.modules.medical.controller;

import com.ayurmitra.modules.medical.dto.MedicalConditionDTO;
import com.ayurmitra.modules.medical.entity.MedicalCondition;
import com.ayurmitra.modules.medical.service.MedicalConditionService;
import com.ayurmitra.modules.user.entity.User;
import com.ayurmitra.modules.user.service.UserService;
import com.ayurmitra.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medical-conditions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class MedicalConditionController {
    
    private final MedicalConditionService medicalConditionService;
    private final UserService userService;
    
    public MedicalConditionController(MedicalConditionService medicalConditionService, UserService userService) {
        this.medicalConditionService = medicalConditionService;
        this.userService = userService;
    }
    
    @PostMapping
    public ResponseEntity<MedicalCondition> addCondition(Authentication authentication, 
                                                         @Valid @RequestBody MedicalConditionDTO dto) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        MedicalCondition condition = medicalConditionService.addCondition(user.getId(), dto);
        return ResponseEntity.ok(condition);
    }
    
    @GetMapping
    public ResponseEntity<List<MedicalConditionDTO>> getUserConditions(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<MedicalConditionDTO> conditions = medicalConditionService.getUserConditions(user.getId());
        return ResponseEntity.ok(conditions);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<MedicalConditionDTO>> getActiveConditions(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<MedicalConditionDTO> conditions = medicalConditionService.getActiveConditions(user.getId());
        return ResponseEntity.ok(conditions);
    }
    
    @PutMapping("/{conditionId}")
    public ResponseEntity<MedicalCondition> updateCondition(@PathVariable Long conditionId, 
                                                            @Valid @RequestBody MedicalConditionDTO dto) {
        MedicalCondition condition = medicalConditionService.updateCondition(conditionId, dto);
        return ResponseEntity.ok(condition);
    }
    
    @DeleteMapping("/{conditionId}")
    public ResponseEntity<Void> deleteCondition(@PathVariable Long conditionId) {
        medicalConditionService.deleteCondition(conditionId);
        return ResponseEntity.noContent().build();
    }
}
