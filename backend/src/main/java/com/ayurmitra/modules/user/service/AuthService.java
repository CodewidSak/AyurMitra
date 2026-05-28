package com.ayurmitra.modules.user.service;

import com.ayurmitra.modules.user.dto.AuthResponse;
import com.ayurmitra.modules.user.dto.LoginRequest;
import com.ayurmitra.modules.user.dto.RegisterRequest;
import com.ayurmitra.modules.user.entity.User;
import com.ayurmitra.security.JwtTokenProvider;
import com.ayurmitra.exception.BusinessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {
    
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    
    public AuthService(UserService userService, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }
    
    public AuthResponse register(RegisterRequest request) {
        User user = userService.registerUser(request);
        String token = jwtTokenProvider.generateToken(user.getUsername());
        
        return AuthResponse.builder()
                .token(token)
                .user(userService.convertToDTO(user))
                .message("User registered successfully")
                .build();
    }
    
    public AuthResponse login(LoginRequest request) {
        User user = userService.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessException("Invalid username or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException("Invalid username or password");
        }
        
        String token = jwtTokenProvider.generateToken(user.getUsername());
        
        return AuthResponse.builder()
                .token(token)
                .user(userService.convertToDTO(user))
                .message("Login successful")
                .build();
    }
}
