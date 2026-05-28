package com.ayurmitra.modules.ai.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SymptomRequest {
    
    @NotBlank(message = "Body part is required")
    @Size(min = 2, max = 50, message = "Body part must be between 2 and 50 characters")
    private String bodyPart;
    
    @NotEmpty(message = "At least one symptom is required")
    @Size(min = 1, max = 10, message = "You can select between 1 and 10 symptoms")
    private List<@NotBlank(message = "Symptom cannot be blank")
                  @Size(min = 2, max = 50, message = "Each symptom must be between 2 and 50 characters") String> symptoms;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
}
