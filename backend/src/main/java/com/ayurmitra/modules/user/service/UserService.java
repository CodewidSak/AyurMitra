package com.ayurmitra.modules.user.service;

import com.ayurmitra.modules.user.dto.RegisterRequest;
import com.ayurmitra.modules.user.dto.UserDTO;
import com.ayurmitra.modules.user.entity.User;
import com.ayurmitra.modules.user.repository.UserRepository;
import com.ayurmitra.exception.BusinessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Username '" + request.getUsername() + "' is already taken");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email '" + request.getEmail() + "' is already registered");
        }
        
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .heightCm(request.getHeightCm())
                .weightKg(request.getWeightKg())
                .age(request.getAge())
                .gender(request.getGender())
                .build();
        
        user.calculateBMI();
        user.calculatePrakriti();
        
        return userRepository.save(user);
    }
    
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .heightCm(user.getHeightCm())
                .weightKg(user.getWeightKg())
                .age(user.getAge())
                .gender(user.getGender())
                .bmi(user.getBmi())
                .prakriti(user.getPrakriti())
                .build();
    }
    
    public User updateUserProfile(Long userId, RegisterRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found"));
        
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setHeightCm(request.getHeightCm());
        user.setWeightKg(request.getWeightKg());
        user.setAge(request.getAge());
        user.setGender(request.getGender());
        
        user.calculateBMI();
        user.calculatePrakriti();
        
        return userRepository.save(user);
    }
}
