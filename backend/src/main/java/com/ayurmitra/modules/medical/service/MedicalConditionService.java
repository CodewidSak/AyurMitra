package com.ayurmitra.modules.medical.service;

import com.ayurmitra.modules.medical.dto.MedicalConditionDTO;
import com.ayurmitra.modules.medical.entity.MedicalCondition;
import com.ayurmitra.modules.medical.repository.MedicalConditionRepository;
import com.ayurmitra.modules.user.entity.User;
import com.ayurmitra.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MedicalConditionService {
    
    private final MedicalConditionRepository medicalConditionRepository;
    private final UserRepository userRepository;
    
    public MedicalConditionService(MedicalConditionRepository medicalConditionRepository, 
                                   UserRepository userRepository) {
        this.medicalConditionRepository = medicalConditionRepository;
        this.userRepository = userRepository;
    }
    
    public MedicalCondition addCondition(Long userId, MedicalConditionDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        MedicalCondition condition = MedicalCondition.builder()
                .user(user)
                .conditionName(dto.getConditionName())
                .severity(dto.getSeverity())
                .description(dto.getDescription())
                .diagnosedDate(dto.getDiagnosedDate() != null ? dto.getDiagnosedDate() : LocalDateTime.now())
                .isActive(true)
                .build();
        
        return medicalConditionRepository.save(condition);
    }
    
    public List<MedicalConditionDTO> getUserConditions(Long userId) {
        return medicalConditionRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<MedicalConditionDTO> getActiveConditions(Long userId) {
        return medicalConditionRepository.findByUserIdAndIsActive(userId, true)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public MedicalCondition updateCondition(Long conditionId, MedicalConditionDTO dto) {
        MedicalCondition condition = medicalConditionRepository.findById(conditionId)
                .orElseThrow(() -> new RuntimeException("Condition not found"));
        
        condition.setConditionName(dto.getConditionName());
        condition.setSeverity(dto.getSeverity());
        condition.setDescription(dto.getDescription());
        condition.setIsActive(dto.getIsActive());
        
        return medicalConditionRepository.save(condition);
    }
    
    public void deleteCondition(Long conditionId) {
        medicalConditionRepository.deleteById(conditionId);
    }
    
    private MedicalConditionDTO convertToDTO(MedicalCondition condition) {
        return MedicalConditionDTO.builder()
                .id(condition.getId())
                .conditionName(condition.getConditionName())
                .severity(condition.getSeverity())
                .description(condition.getDescription())
                .diagnosedDate(condition.getDiagnosedDate())
                .isActive(condition.getIsActive())
                .build();
    }
}
