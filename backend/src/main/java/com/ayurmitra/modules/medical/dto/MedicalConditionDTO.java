package com.ayurmitra.modules.medical.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalConditionDTO {
    private Long id;
    
    @NotBlank(message = "Condition name is required")
    @Size(min = 2, max = 100, message = "Condition name must be between 2 and 100 characters")
    private String conditionName;
    
    @NotBlank(message = "Severity is required")
    @Pattern(regexp = "^(Mild|Moderate|Severe)$", message = "Severity must be Mild, Moderate, or Severe")
    private String severity;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    private LocalDateTime diagnosedDate;
    
    private Boolean isActive;
}
