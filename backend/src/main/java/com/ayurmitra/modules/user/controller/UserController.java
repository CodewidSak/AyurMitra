package com.ayurmitra.modules.user.controller;

import com.ayurmitra.modules.user.dto.RegisterRequest;
import com.ayurmitra.modules.user.dto.UserDTO;
import com.ayurmitra.modules.user.entity.User;
import com.ayurmitra.modules.user.service.UserService;
import com.ayurmitra.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getProfile(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(userService.convertToDTO(user));
    }
    
    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(Authentication authentication, @Valid @RequestBody RegisterRequest request) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        User updatedUser = userService.updateUserProfile(user.getId(), request);
        return ResponseEntity.ok(userService.convertToDTO(updatedUser));
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with ID " + userId + " not found"));
        return ResponseEntity.ok(userService.convertToDTO(user));
    }
}
