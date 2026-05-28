package com.ayurmitra.modules.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Double heightCm;
    private Double weightKg;
    private Integer age;
    private String gender;
    private Double bmi;
    private String prakriti;
}
